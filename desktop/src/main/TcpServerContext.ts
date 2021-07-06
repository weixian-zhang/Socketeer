import {TcpServerView} from '../common/models/TcpView'
import net, {Server, Socket} from 'net';
import Db from './Db';
import { Protocol, SocketType, SocketView } from '../common/models/SocketView';
import {Utils} from '../common/Utils';

//add custom Id to net.Server
// declare module 'net' {
//     export function server(cfg: any): net.Server;
//     interface Server {
//         TcpServerId:  string
//     }
// }

// Object.defineProperty(net.Server.prototype, 'TcpServerId', {
//     enumerable: false,
//     get(this: net.Server){
//         return this.TcpServerId;
//     },
//     set(this: net.Server, value: any){
//         this.TcpServerId = value;
//     }
// });

/* Overseer */
export class TcpServerContextOverseer {

    private static instance: TcpServerContextOverseer;
    private servers: TcpServerContext[];
    private db: Db;

    private constructor() {
        this.servers = [];
        this.db = Db.Instance();
    }

    public static Instance(): TcpServerContextOverseer {
        if (!TcpServerContextOverseer.instance) {
            TcpServerContextOverseer.instance = new TcpServerContextOverseer();
        }

        return TcpServerContextOverseer.instance;
    }

    public AddServer(serverContext: TcpServerContext): void {
        this.servers.push(serverContext);

        this.db.AddSocket(new SocketView(serverContext.Id(), SocketType.Server, Protocol.TCP), serverContext.TcpServerView);
    }

    public UpdateServerState(serverId: string, err: Error | null, connStatus: ServerConnStatus): void {

        let tcpServerContext = this.servers.find(x => x.Id() == serverId );

        if(tcpServerContext != undefined) {
            tcpServerContext.UpdateState(err, connStatus);
        }

    }

    public UpdateRemoteClientState(serverId: string, remoteAddress: string | undefined, remotePort: number | undefined, err: Error | null, connectionStatus: RemoteClientConnStatus): void {

        let tcpServerContext = this.servers.find(x => x.Id() == serverId );

        tcpServerContext?.UpdateRemoteClient(remoteAddress, remotePort, err, connectionStatus);
    }

    public GetRemoteClient(serverId: string, remoteAddress: string, remotePort: number): RemoteClientContext | null {
        let tcpServerContext = this.servers.find(x => x.Id() == serverId );

        if(tcpServerContext != null) {
            return tcpServerContext.FindRemoteClient(remoteAddress, remotePort);
        } else {
            return null;
        }
    }

    public RemoveRemoteClient(serverId: string, remoteAddress: string | undefined, remotePort: number | undefined): void {

        if(Utils.IsUoN(remoteAddress) || Utils.IsUoN(remotePort))
            return;

        let tcpServerContext = this.servers.find(x => x.Id() == serverId );

        if(tcpServerContext != null) {
            tcpServerContext.DeleteRemoteClient(remoteAddress, remotePort);
        }
    }
}


/* TcpServerContext */
export class TcpServerContext {

    TcpServerView: TcpServerView;
    server: Server;
    remoteClients: RemoteClientContext[]; //remoteAddress + remotePort

    constructor(tcpServerView: TcpServerView, server: Server) {
        this.TcpServerView = tcpServerView;
        this.server = server;
        this.remoteClients = [];
        this.TcpServerView.ConnDescription = ServerConnStatus[ServerConnStatus.NotListening];
    }

    public Id(): string {
        return this.TcpServerView.Id;
    }

    public UpdateState(err: Error | null, connStatus: ServerConnStatus) {
        if(err != null) {
            this.TcpServerView.Error = err.message;
        }
        this.TcpServerView.ConnDescription = ServerConnStatus[connStatus];
    }

    public AddRemoteClient(client: Socket) {

        this.remoteClients.push( new RemoteClientContext(client) );
    }

    public UpdateRemoteClient
        (remoteAddress: string | undefined, remotePort: number | undefined, error: Error | null, connStatus: RemoteClientConnStatus): void {

        if(!remoteAddress || !remotePort)
        return;

        for(let i in this.remoteClients) {
            if(this.remoteClients[i].Socket.remoteAddress == remoteAddress &&
                this.remoteClients[i].Socket.remotePort == remotePort) {
                    this.remoteClients[i].UpdateState(error, connStatus);
                }
        }
    }

    public DeleteRemoteClient(remoteAddress: string | undefined, remotePort: number | undefined): void {

        if(Utils.IsUoN(remoteAddress) || Utils.IsUoN(remotePort))
            return;

        const index = this.remoteClients.findIndex
            (x => x.Socket.remoteAddress == remoteAddress && x.Socket.remotePort == remotePort);
        this.remoteClients.splice(index, 1);
    }

    public FindRemoteClient(remoteAddress: string, remotePort: number): RemoteClientContext | null {

        const index: number =
            this.remoteClients.findIndex(x => x.Socket.remoteAddress == remoteAddress && x.Socket.remotePort == remotePort);

        if(index != -1) {
            return this.remoteClients[index];
        } else {
            return null;
        }
    }
}

/* RemoteClientContext */
export class RemoteClientContext {

    Socket: Socket;
    ConnDescription: string = '';
    Error: string = '';

    constructor(socket: Socket) {
        this.Socket = socket;
    }

    public UpdateState(err: Error | null, connStatus: RemoteClientConnStatus) {
        if(err != null) {
            this.Error = err.message;
        }
        this.ConnDescription = RemoteClientConnStatus[connStatus];
    }
}

export enum ServerConnStatus {
    Listening,
    NotListening,
    Closed,
    Error
}

export enum RemoteClientConnStatus {
    Connected,
    Connecting,
    Closed,
    Error,
    RemoteClientEndConnection,
    Timeout
}