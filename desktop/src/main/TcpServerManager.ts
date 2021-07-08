import {
    TcpServerContextOverseer,
    TcpServerContext,
    ServerConnStatus,
    RemoteClientConnStatus,
    TcpServer,
    TcpSocket
} from './TcpContexts';
import net, {Socket} from 'net';
import { TcpServerView } from 'src/common/models/TcpView';
import { Utils } from '../common/Utils';
import MainTcpCommCenter from './MainTcpCommCenter';
import { Protocol } from 'src/common/models/SocketView';

//https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10

export default class TcpServerManager {

    private static instance: TcpServerManager;
    private contextOverseer: TcpServerContextOverseer;
    private commsCenter: MainTcpCommCenter;

    constructor(commsCenter: MainTcpCommCenter) {
        this.contextOverseer = TcpServerContextOverseer.Instance();
        this.commsCenter = commsCenter;
    }

    public static Instance(commsCenter: MainTcpCommCenter): TcpServerManager {
        if(!TcpServerManager.instance) {
            TcpServerManager.instance = new TcpServerManager(commsCenter);
        }

        return TcpServerManager.instance;
    }

    public CreateTcpServer(viewInfo: TcpServerView): void {

        const tcpServer: TcpServer = this.NewTcpNetServer();

        tcpServer.maxConnections = 10;

        //emitted when server closes ...not emitted until all connections closes.
        tcpServer.on('close', () => {
            this.contextOverseer.UpdateLiveServerState(tcpServer.Id, ServerConnStatus.Closed);

            this.commsCenter.SendLiveTcpServerData(this.contextOverseer.GetAllLiveTcpServer());
        });

        tcpServer.on('error',(err: Error) => {
            if(err != null) {
                this.contextOverseer.UpdateLiveServerState(tcpServer.Id, ServerConnStatus.Error, err);

                this.commsCenter.SendLiveTcpServerData(this.contextOverseer.GetAllLiveTcpServer());
            }
        });

        tcpServer.on('listening', () => {
            this.contextOverseer.UpdateLiveServerState(tcpServer.Id, ServerConnStatus.Listening);
            this.commsCenter.SendLiveTcpServerData(this.contextOverseer.GetAllLiveTcpServer());
        });


        // emitted when new client connects
        tcpServer.on('connection', (socket: Socket) => {

            const tcpSocket: TcpSocket = socket as TcpSocket;
            tcpSocket.ServerId = tcpServer.Id;
            tcpSocket.Id = Utils.Uid();

            tcpSocket.setEncoding('utf-8');

            //remote client has connected
            tcpSocket.on( "connection", () => {
                this.contextOverseer.AddLiveRemoteClient(tcpSocket);
            });

            //remote client sends data to server
            tcpSocket.on( "data", (data: any) => {
                //*TODO: send data
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
                this.contextOverseer.RemoveLiveRemoteClient(tcpSocket);
            });
        });

        //static port allocation
        tcpServer.listen(viewInfo.ListeningPort);

        this.contextOverseer.AddServer(viewInfo, tcpServer);
    }

    public KillSocket(id: string, remoteAddress: string, remotePort: number) {

        // const socket = this.contextOverseer.GetLiveRemoteClient(id, remoteAddress, remotePort);

        // if(socket != null) {

        //     socket.destroy();

        //     this.contextOverseer.RemoveLiveRemoteClient(id, remoteAddress, remotePort);
        // }
    }

    private NewTcpNetServer(): TcpServer {

        const server = net.createServer();

        const tcpServer: TcpServer = server as TcpServer;
        tcpServer.Id = Utils.Uid();

        return tcpServer;
    }
}