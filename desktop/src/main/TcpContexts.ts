import {RemoteClientView, TcpServerView, TcpDataView} from '../common/models/TcpView'
import net, {Socket} from 'net';
import Db from './Db';
import { Protocol, SocketType, SocketView } from '../common/models/SocketView';
import {Utils} from '../common/Utils';
import * as _ from "lodash";
import TcpRendererIpc  from './TcpRendererIpc';

export class TcpServer extends net.Server {
    Id: string = '';
}

export class TcpSocket extends net.Socket {
    ServerId: string = '';
    Id: string = '';
}


export class ServerConnStatus {
    static Listening: string = 'Listening';
    static NotListening: string = 'Not Listening';
    static Closed: string = 'Closed';
    static Error: string = 'Error';
}

export class RemoteClientConnStatus {
    static Connected: string = 'Connected';
    static Connecting: string = 'Connecting';
    static Closed: string = 'Closed';
    static Error: string = 'Error';
    static Timeout: string = 'Timeout';
    static EndConnection: string = 'Client ended connection';
}


/* Overseer */
export class TcpServerContextOverseer {

    private static instance: TcpServerContextOverseer;
    public LiveServers: TcpServerContext[];
    private db: Db;
    private rendererIpc: TcpRendererIpc;

    private constructor(rendererIpc: TcpRendererIpc) {
        this.LiveServers = [];
        this.db = Db.Instance();
        this.rendererIpc = rendererIpc;
    }

    public static Instance(rendererIpc: TcpRendererIpc): TcpServerContextOverseer {
        if (!TcpServerContextOverseer.instance) {
            TcpServerContextOverseer.instance = new TcpServerContextOverseer(rendererIpc);
        }

        return TcpServerContextOverseer.instance;
    }

    public GetAllSavedTcpServers(): TcpServerView[] {
       const serverFromJson =  this.db.GetAllTcpServers();

       const serverResult: TcpServerView[] = [];

       _.each(serverFromJson, function(s) {
            const {Name, ListeningPort} = s;

            //create new object instead of parsing from Json to preserve functions in TcpServerView
            const newTcpView = new TcpServerView(Name, ListeningPort);
            newTcpView.Id = s.Id
            serverResult.push(newTcpView);
       });

       return serverResult;
    }

    public GetAllLiveTcpServer(): TcpServerView[] {
        const svrViews: TcpServerView[] = [];

        _.each(this.LiveServers, x => svrViews.push(x.TcpServerView));

        return svrViews;
    }

    public IsListeningPortTakenByLiveServers(port: number): boolean {
        if(Utils.IsUoN(this.LiveServers.find(x => x.TcpServerView.ListeningPort == port)))
            return false;
        else
            return true;
     }

    public IsListeningPortSaved(port: number): boolean {
       return this.db.IsServerPortTaken(port, Protocol.TCP);
    }

    public GetServer(serverId: string) {
        const server = this.LiveServers.find(x => x.Id() == serverId);
        return server;
    }

    public AddServer(viewInfo: TcpServerView, tcpServer: TcpServer): void {

        viewInfo.ConnStatus = ServerConnStatus.NotListening;
        viewInfo.Id = tcpServer.Id;
        viewInfo.Protocol = Protocol.TCP;
        viewInfo.SocketType = SocketType.Server;


        this.LiveServers.push(new TcpServerContext(viewInfo, tcpServer));

        const viewJ = JSON.stringify(viewInfo);

        this.db.AddSocket(viewInfo, viewJ);
    }

    public RemoveServer(serverId: string): void {

        const serverContext = this.LiveServers.find(x => x.Id() == serverId);

        this.db.RemoveSocket(serverContext.TcpServerView as SocketView)
        _.remove(this.LiveServers, x => x.Id() == serverId);
    }

    public UpdateLiveServerState(serverId: string, connStatus: string, err?: Error | null,): void {

        for(let index in this.LiveServers) {
            if(this.LiveServers[index].Id() == serverId) {
                if(!Utils.IsUoN(err))
                this.LiveServers[index].TcpServerView.Error =  err.message;
                this.LiveServers[index].TcpServerView.ConnStatus =  connStatus;
            }
        }
    }

    public GetLiveClientSocket(serverId: string, socketId: string): TcpSocket | null {

        let serverContext = this.LiveServers.find(x => x.Id() == serverId );

        if(Utils.IsUoN(serverContext))
            return null;

        const socket = serverContext.sockets.find(x => x.Id == socketId);

        if(Utils.IsUoN(socket))
            return null;
        else
            return socket;
    }

    public GetLiveClientView(serverId: string, socketId: string): RemoteClientView | null {

        let serverContext = this.LiveServers.find(x => x.Id() == serverId );

        if(Utils.IsUoN(serverContext))
            return null;

        const client = serverContext.TcpServerView.RemoteClients.find(x => x.Id == socketId);

        if(Utils.IsUoN(client))
            return null;
        else
            return client;
    }

    public AddLiveRemoteClient(socket: TcpSocket) {

        const { Id, ServerId, remoteAddress, remotePort} = socket;

        const remoteClient = new RemoteClientView(Id, ServerId, remoteAddress, remotePort,
            new Date(), RemoteClientConnStatus.Connected);


        const server =  this.LiveServers.find(x => x.Id() == ServerId);

        if(!Utils.IsUoN(server)) {

            server.sockets.push(socket);

            server.TcpServerView.RemoteClients.push(remoteClient);
        }
    }

    public UpdateLiveRemoteClientState(tcpSocket: TcpSocket, connStatus: string, err?: Error | null): void {

        const { Id, ServerId } = tcpSocket;

        let tcpServerContext = this.LiveServers.find(x => x.Id() == ServerId );

        for(let index in tcpServerContext.TcpServerView.RemoteClients) {
            let c = tcpServerContext.TcpServerView.RemoteClients;

            if(c[index].Id == Id) {
                if(!Utils.IsUoN(err))
                    c[index].Error = err.message

                c[index].ConnStatus = RemoteClientConnStatus[connStatus];
            }
        }

        this.rendererIpc.SendNewServerStateToRenderer(this.GetAllLiveTcpServer());
    }

    public RemoveLiveRemoteClient(serverId: string, socketId: string): void {

        let tcpServerContext = this.LiveServers.find(x => x.Id() == serverId );

        if(!Utils.IsUoN(tcpServerContext)) {
            //remote UI view
            _.remove(tcpServerContext.TcpServerView.RemoteClients, x => x.Id == socketId);

            //remove socket from ServerContext
            _.remove(tcpServerContext.sockets, x => x.Id == socketId);
        }
    }

    public AppendReceiveOrSentData(data: string, serverId: string, socketId: string, isReceive: boolean) {
        const clientView = this.GetLiveClientView(serverId, socketId);

        clientView.Data.push(new TcpDataView(serverId, socketId, String(data), isReceive));
    }
}


/* TcpServerContext */
export class TcpServerContext {

    TcpServerView: TcpServerView;
    server: TcpServer;
    sockets: TcpSocket[]

    constructor(tcpServerView: TcpServerView, server: TcpServer) {

        this.TcpServerView = tcpServerView;
        this.server = server;
        this.TcpServerView.ConnEstablishTime = new Date();
        this.TcpServerView.ConnStatus = ServerConnStatus[ServerConnStatus.NotListening];
        this.sockets = [];
    }

    public Id(): string {
        return this.TcpServerView.Id;
    }
}