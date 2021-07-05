import {
    TcpServerContextOverseer,
    TcpServerContext,
    ServerConnStatus,
    RemoteClientConnStatus
} from './TcpServerContext';
import net, {Socket} from 'net';
import { TcpServerView } from 'src/common/models/TcpView';

//https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10

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

    public CreateTcpServer(tcpInfo: TcpServerView): void {

        var server = net.createServer();

        this.contextOverseer.SetServerId(tcpInfo.Id, server)

        server.maxConnections = 10;
server
        server.CustomProps.Id = tcpInfo.Id;

        //emitted when server closes ...not emitted until all connections closes.
        server.on('close', () => {
            this.contextOverseer.UpdateServerState(server.CustomProps.Id, null, ServerConnStatus.Closed);
        });

        server.on('error',(err: Error) => {
            if(err != null) {
                this.contextOverseer.UpdateServerState(server.CustomProps.Id, err, ServerConnStatus.Error);
            }

        });

        server.on('listening', () => {
            this.contextOverseer.UpdateServerState(server.CustomProps.Id, null, ServerConnStatus.Listening);
        });


        // emitted when new client connects
        server.on('connection', (socket: Socket) => {

            socket.setEncoding('utf-8');

            //remote client has connected
            socket.on( "connection", () => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.CustomProps.Id, socket.remoteAddress, socket.remotePort, null, RemoteClientConnStatus.Connected);
            });

            //remote client sends data to server
            socket.on( "data", (data: any) => {
                //*TODO: send data
            });

            socket.on( "error", (err: Error) => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.CustomProps.Id, socket.remoteAddress, socket.remotePort, err, RemoteClientConnStatus.Error);
            });

            socket.on( "timeout", () => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.CustomProps.Id, socket.remoteAddress, socket.remotePort, null, RemoteClientConnStatus.Timeout);
            });

            socket.on( "end", () => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.CustomProps.Id, socket.remoteAddress, socket.remotePort, null, RemoteClientConnStatus.RemoteClientEndConnection);
            });

            socket.on( "close", err => {
                this.contextOverseer.UpdateRemoteClientState
                    (server.CustomProps.Id, socket.remoteAddress, socket.remotePort, null, RemoteClientConnStatus.Closed);

                this.contextOverseer.RemoveRemoteClient(server.CustomProps.Id, socket.remoteAddress, socket.remotePort);
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