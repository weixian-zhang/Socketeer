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
import MainTcpCommCenter from './MainTcpCommCenter';
import { Protocol } from 'src/common/models/SocketView';

//https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10

export default class TcpServerManager {

    private static instance: TcpServerManager;
    private contextOverseer: TcpServerContextOverseer;
    private commsCenter: MainTcpCommCenter;

    constructor(commsCenter: MainTcpCommCenter) {
        this.commsCenter = commsCenter;
        this.contextOverseer = TcpServerContextOverseer.Instance(this.commsCenter);
    }

    public static Instance(commsCenter: MainTcpCommCenter): TcpServerManager {
        if(!TcpServerManager.instance) {
            TcpServerManager.instance = new TcpServerManager(commsCenter);
        }

        return TcpServerManager.instance;
    }


    public CreateTcpServer(viewInfo: TcpServerView): void {

        //check if port is in use
        if(this.contextOverseer.IsListeningPortTaken(viewInfo.ListeningPort)) {
            this.commsCenter.MessageToRenderer(`Listening port ${viewInfo.ListeningPort} is in use`);
            return;
        }

        const tcpServer: TcpServer = this.NewTcpNetServer();

        tcpServer.maxConnections = 10;

        //emitted when server closes ...not emitted until all connections closes.
        tcpServer.on('close', () => {
            this.contextOverseer.UpdateLiveServerState(tcpServer.Id, ServerConnStatus.Closed);

            this.commsCenter.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
        });

        tcpServer.on('error',(err: Error) => {
            if(err != null) {

                this.contextOverseer.UpdateLiveServerState(tcpServer.Id, ServerConnStatus.Error, err);

                this.commsCenter.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
            }
        });

        tcpServer.on('listening', () => {
            this.contextOverseer.UpdateLiveServerState(tcpServer.Id, ServerConnStatus.Listening);

            this.commsCenter.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
        });


        // emitted when new client connects
        tcpServer.on('connection', (socket: Socket) => {

            const tcpSocket: TcpSocket = socket as TcpSocket;
            tcpSocket.ServerId = tcpServer.Id;
            tcpSocket.Id = Utils.Uid();

            tcpSocket.setEncoding('utf-8');

            this.contextOverseer.AddLiveRemoteClient(tcpSocket);
            this.commsCenter.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());

            //remote client sends data to server
            tcpSocket.on( "data", (data: any) => {
                this.contextOverseer.AppendReceiveOrSentData(data, tcpSocket.ServerId, tcpSocket.Id, true);
                this.commsCenter.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
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
                this.commsCenter.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
            });

        });

        //static port allocation
        tcpServer.listen(viewInfo.ListeningPort);

        this.contextOverseer.AddServer(viewInfo, tcpServer);
    }

    public SendDataToRemoteClient(data: string, serverId: string, socketId: string) {
        const socket = this.contextOverseer.GetLiveClientSocket(serverId, socketId);

        if(Utils.IsUoN(socket)) {
            this.commsCenter.MessageToRenderer('Error on Send-Data-To-Remote-Client, socket not found');
            return;
        }

        socket.write(data, (err: Error) => {
            if(!Utils.IsUoN(err))
                this.commsCenter.MessageToRenderer(`Error on Send-Data-To-Remote-Client - ${err.message}`);
        });

        this.contextOverseer.AppendReceiveOrSentData(data, serverId, socketId, false);

        this.commsCenter.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
    }

    public DisconnectRemoteClient(serverId: string, socketId: string) {
        const socket: TcpSocket = this.contextOverseer.GetLiveClientSocket(serverId, socketId);

        socket.destroy();

        this.contextOverseer.RemoveLiveRemoteClient(serverId, socketId);
    }

    public GetLiveServerdata = (): void => {
        this.commsCenter.SendNewServerStateToRenderer(this.contextOverseer.GetAllLiveTcpServer());
    }

    private NewTcpNetServer(): TcpServer {

        const server = net.createServer();

        const tcpServer: TcpServer = server as TcpServer;
        tcpServer.Id = Utils.Uid();

        return tcpServer;
    }
}