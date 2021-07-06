import {
    TcpServerContextOverseer,
    TcpServerContext,
    ServerConnStatus,
    RemoteClientConnStatus
} from './TcpServerContext';
import net, {Socket} from 'net';
import { TcpServerView } from 'src/common/models/TcpView';
import { Utils } from '../common/Utils';

//https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10

class TcpServer extends net.Server {
    Id: string = '';
}

export default class TcpServerManager {

    private static instance: TcpServerManager;
    private contextOverseer: TcpServerContextOverseer;

    constructor() {
        this.contextOverseer = TcpServerContextOverseer.Instance();
    }

    public static Instance(): TcpServerManager {
        if(!TcpServerManager.instance) {
            TcpServerManager.instance = new TcpServerManager();
        }

        return TcpServerManager.instance;
    }

    private NewTcpServer(): TcpServer {

        const server = net.createServer();

        const tcpServer: TcpServer = server as TcpServer;

        tcpServer.Id = Utils.Uid();

        return tcpServer;
    }

    public CreateTcpServer(tcpInfo: TcpServerView): void {

        const server = this.NewTcpServer();

        server.maxConnections = 10;


        //emitted when server closes ...not emitted until all connections closes.
        server.on('close', () => {
            this.contextOverseer.UpdateServerState(server.Id, null, ServerConnStatus.Closed);
        });

        server.on('error',(err: Error) => {
            if(err != null) {
                this.contextOverseer.UpdateServerState(server.Id, err, ServerConnStatus.Error);
            }

        });

        server.on('listening', () => {
            this.contextOverseer.UpdateServerState(server.Id, null, ServerConnStatus.Listening);
        });


        // emitted when new client connects
        server.on('connection', (socket: Socket) => {

            socket.setEncoding('utf-8');

            //remote client has connected
            socket.on( "connection", () => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.Id, socket.remoteAddress, socket.remotePort, null, RemoteClientConnStatus.Connected);
            });

            //remote client sends data to server
            socket.on( "data", (data: any) => {
                //*TODO: send data
            });

            socket.on( "error", (err: Error) => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.Id, socket.remoteAddress, socket.remotePort, err, RemoteClientConnStatus.Error);
            });

            socket.on( "timeout", () => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.Id, socket.remoteAddress, socket.remotePort, null, RemoteClientConnStatus.Timeout);
            });

            socket.on( "end", () => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.Id, socket.remoteAddress, socket.remotePort, null, RemoteClientConnStatus.RemoteClientEndConnection);
            });

            socket.on( "close", err => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.Id, socket.remoteAddress, socket.remotePort, null, RemoteClientConnStatus.Closed);

                this.contextOverseer.RemoveRemoteClient(server.Id, socket.remoteAddress, socket.remotePort);
            });
        });

        //static port allocation
        server.listen(tcpInfo.ListeningPort);

        this.contextOverseer.AddServer(new TcpServerContext(tcpInfo, server));
    }

    public KillSocket(id: string, remoteAddress: string, remotePort: number) {
        const client = this.contextOverseer.GetRemoteClient(id, remoteAddress, remotePort);

        if(client != null) {

            client.Socket.destroy();

            this.contextOverseer.RemoveRemoteClient(id, remoteAddress, remotePort);
        }
    }




}