import {
    TcpServerContextOverseer,
    TcpServerContext,
    ServerConnStatus,
    RemoteClientConnStatus,
    TcpServer,
    TcpSocket
} from './TcpContexts';
import net, {Socket} from 'net';
import { TcpDataView, TcpServerView } from '../common/models/TcpView';
import { Utils } from '../common/Utils';
import TcpRendererIpc from './TcpRendererIpc';
import * as _ from 'lodash';

//https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10

/** interface for Main process, separating implementations from Renderer initiated functions
 * and Main process
*/
export interface TcpSocketManager {
    CreateSavedSocket(): void;
    //CreateServerSocketsFromSocFile(TcpServerView)
    //CreateClientSocketsFromSocFile(TcpClientView)
}

export class TcpServerManager {

    private static instance: TcpServerManager;
    private contextOverseer: TcpServerContextOverseer;
    private rendererIpc: TcpRendererIpc;

    constructor() {
        this.contextOverseer = TcpServerContextOverseer.Instance(this.rendererIpc);
    }

    public static Instance(): TcpServerManager {
        if(!TcpServerManager.instance) {
            TcpServerManager.instance = new TcpServerManager();
        }

        return TcpServerManager.instance;
    }

    public SetRendererIpc(rendererIpc: TcpRendererIpc) {
        this.rendererIpc = rendererIpc;
    }

    public CreateSavedTcpServers = () => {
        const savedServers: TcpServerView[] = this.contextOverseer.GetAllSavedTcpServers();

        _.each(savedServers, (s) => {
            this.CreateTcpServer(s, true);
        });
    }

    public RemoveServer(serverId: string): void {
        this.ServerStopListening(serverId, () => {
            this.contextOverseer.RemoveServer(serverId);
        });
    }

    public ServerStartListen(serverId: string, port: number): void {
        const serverContext = this.contextOverseer.GetServer(serverId);

        if(!serverContext.server.listening) {
            serverContext.server.listen(port);
        }
    }

    public ServerStopListening(serverId: string, callback?: ()=>void): void {
        const serverContext = this.contextOverseer.GetServer(serverId);

        if(serverContext.server.listening) {

            serverContext.sockets.forEach((s) => {
                s.destroy();
            });

            serverContext.server.close((err) => {
                if(!Utils.IsUoN(err)){
                    this.rendererIpc.MessageToRenderer(`Error on closing Server ${serverContext.TcpServerView.Name}: ${err.message}`)
                }

                serverContext.server.unref();
            })

            serverContext.sockets = [];
            serverContext.TcpServerView.RemoteClients = [];
        }

        if(!Utils.IsUoN(callback)) {
            callback();
        }
    }

    //TODO: create saved TCP server on startup, yet not conflict with
    //liveservers empty
    public CreateTcpServer(viewInfo: TcpServerView, isFromSavedView?: boolean): void {

        //check if port is in use
        if(this.contextOverseer.IsListeningPortSaved(viewInfo.ListeningPort) &&
            this.contextOverseer.IsListeningPortTakenByLiveServers(viewInfo.ListeningPort)) {
            this.rendererIpc.MessageToRenderer(`Listening port ${viewInfo.ListeningPort} is in use`);
            return;
        }

        let tcpServer: TcpServer;

        if(!Utils.IsUoN(isFromSavedView) && isFromSavedView) {
            tcpServer = this.NewTcpNetServer(viewInfo.Id);
        } else {
            tcpServer = this.NewTcpNetServer();
        }


        tcpServer.maxConnections = 10;

        //emitted when server closes ...not emitted until all connections closes.
        tcpServer.on('close', () => {
            this.contextOverseer.UpdateLiveServerState(tcpServer.Id, ServerConnStatus.Closed);

            this.rendererIpc.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
        });

        tcpServer.on('error',(err: Error) => {
            if(err != null) {

                this.contextOverseer.UpdateLiveServerState(tcpServer.Id, ServerConnStatus.Error, err);

                this.rendererIpc.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
            }
        });

        tcpServer.on('listening', () => {
            this.contextOverseer.UpdateLiveServerState(tcpServer.Id, ServerConnStatus.Listening);

            this.rendererIpc.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
        });


        // emitted when new client connects
        tcpServer.on('connection', (socket: Socket) => {

            const tcpSocket: TcpSocket = socket as TcpSocket;
            tcpSocket.ServerId = tcpServer.Id;

            tcpSocket.Id = Utils.Uid();

            tcpSocket.setEncoding('utf-8');

            this.contextOverseer.AddLiveRemoteClient(tcpSocket);
            this.rendererIpc.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());

            //remote client sends data to server
            tcpSocket.on( "data", (data: any) => {
                this.contextOverseer.AppendReceiveOrSentData(data, tcpSocket.ServerId, tcpSocket.Id, true);
                this.rendererIpc.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
            });

            tcpSocket.on( "error", (err: Error) => {
                this.contextOverseer.UpdateLiveRemoteClientState(tcpSocket, RemoteClientConnStatus.Error, err);
            });

            tcpSocket.on( "timeout", () => {
                this.contextOverseer.UpdateLiveRemoteClientState(tcpSocket, RemoteClientConnStatus.Timeout);
            });

            tcpSocket.on( "end", () => {
                this.contextOverseer.UpdateLiveRemoteClientState(tcpSocket, RemoteClientConnStatus.EndConnection);
            });

            tcpSocket.on( "close", err => {
                this.contextOverseer.RemoveLiveRemoteClient(tcpSocket.ServerId, tcpSocket.Id);
                this.rendererIpc.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
            });

        });

        //static port allocation
        tcpServer.listen(viewInfo.ListeningPort);

        this.contextOverseer.AddServer(viewInfo, tcpServer);
    }

    public SendDataToRemoteClient(data: string, serverId: string, socketId: string) {
        const socket = this.contextOverseer.GetLiveClientSocket(serverId, socketId);

        if(Utils.IsUoN(socket)) {
            this.rendererIpc.MessageToRenderer('Error on Send-Data-To-Remote-Client, socket not found');
            return;
        }

        socket.write(data, (err: Error) => {
            if(!Utils.IsUoN(err))
                this.rendererIpc.MessageToRenderer(`Error on Send-Data-To-Remote-Client - ${err.message}`);
        });

        this.contextOverseer.AppendReceiveOrSentData(data, serverId, socketId, false);

        this.rendererIpc.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
    }

    public DisconnectRemoteClient(serverId: string, socketId: string) {
        const socket: TcpSocket = this.contextOverseer.GetLiveClientSocket(serverId, socketId);

        socket.destroy();

        this.contextOverseer.RemoveLiveRemoteClient(serverId, socketId);
    }

    public GetLiveServerdata = (): void => {
        this.rendererIpc.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
    }

    private NewTcpNetServer(serverId?: string): TcpServer {

        const server = net.createServer();

        const tcpServer: TcpServer = server as TcpServer;

        if(!Utils.IsUoN(serverId)) {
            tcpServer.Id = serverId
        } else {
            tcpServer.Id = Utils.Uid();
        }

        return tcpServer;
    }
}