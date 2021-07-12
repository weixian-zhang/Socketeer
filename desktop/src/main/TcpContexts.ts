import {RemoteClientView, TcpServerView, TcpDataView} from '../common/models/TcpView'
import net, {Socket} from 'net';
import Db from './Db';
import { Protocol, SocketType, SocketView } from '../common/models/SocketView';
import {Utils} from '../common/Utils';
import * as _ from "lodash";
import MainTcpCommCenter  from './MainTcpCommCenter';

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
    private liveServers: TcpServerContext[];
    private db: Db;
    private commsCenter: MainTcpCommCenter;

    private constructor(commsCenter: MainTcpCommCenter) {
        this.liveServers = [];
        this.db = Db.Instance();
        this.commsCenter = commsCenter;
    }

    public static Instance(commsCenter: MainTcpCommCenter): TcpServerContextOverseer {
        if (!TcpServerContextOverseer.instance) {
            TcpServerContextOverseer.instance = new TcpServerContextOverseer(commsCenter);
        }

        return TcpServerContextOverseer.instance;
    }

    public GetAllLiveTcpServer(): TcpServerView[] {
        const svrViews: TcpServerView[] = [];

        _.each(this.liveServers, x => svrViews.push(x.TcpServerView));

        return svrViews;
    }

    public IsListeningPortTaken(port: number): boolean {
       const server = this.liveServers.find(x => x.TcpServerView.ListeningPort == port);
       if(!Utils.IsUoN(server))
            return true;
        else
            return false;
    }

    public GetServer(serverId: string) {
        const server = this.liveServers.find(x => x.Id() == serverId);
        return server;
    }

    public AddServer(viewInfo: TcpServerView, tcpServer: TcpServer): void {

        viewInfo.ConnStatus = ServerConnStatus.NotListening;
        viewInfo.Id = tcpServer.Id;
        viewInfo.Protocol = Protocol.TCP;
        viewInfo.SocketType = SocketType.Server;

        this.liveServers.push(new TcpServerContext(viewInfo, tcpServer));

        const viewJ = JSON.stringify(viewInfo);

        this.db.AddSocket(viewInfo, viewJ);
    }

    public RemoveServer(serverId: string): void {

        const server = this.liveServers.find(x => x.Id() == serverId);

        if(server != null) {

            this.db.RemoveSocket(server.TcpServerView as SocketView)

            _.remove(this.liveServers, x => x.Id() == serverId);
        }
    }

    public UpdateLiveServerState(serverId: string, connStatus: string, err?: Error | null,): void {

        for(let index in this.liveServers) {
            if(this.liveServers[index].Id() == serverId) {
                if(!Utils.IsUoN(err))
                this.liveServers[index].TcpServerView.Error =  err.message;
                this.liveServers[index].TcpServerView.ConnStatus =  connStatus;
            }
        }
    }

    public GetLiveClientSocket(serverId: string, socketId: string): TcpSocket | null {

        let serverContext = this.liveServers.find(x => x.Id() == serverId );

        if(Utils.IsUoN(serverContext))
            return null;

        const socket = serverContext.sockets.find(x => x.Id == socketId);

        if(Utils.IsUoN(socket))
            return null;
        else
            return socket;
    }

    public GetLiveClientView(serverId: string, socketId: string): RemoteClientView | null {

        let serverContext = this.liveServers.find(x => x.Id() == serverId );

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


        const server =  this.liveServers.find(x => x.Id() == ServerId);

        if(!Utils.IsUoN(server)) {

            server.sockets.push(socket);

            server.TcpServerView.RemoteClients.push(remoteClient);
        }
    }

    public UpdateLiveRemoteClientState(tcpSocket: TcpSocket, connStatus: string, err?: Error | null): void {

        const { Id, ServerId } = tcpSocket;

        let tcpServerContext = this.liveServers.find(x => x.Id() == ServerId );

        for(let index in tcpServerContext.TcpServerView.RemoteClients) {
            let c = tcpServerContext.TcpServerView.RemoteClients;

            if(c[index].Id == Id) {
                if(!Utils.IsUoN(err))
                    c[index].Error = err.message

                c[index].ConnStatus = RemoteClientConnStatus[connStatus];
            }
        }

        this.commsCenter.SendNewServerStateToRenderer(this.GetAllLiveTcpServer());
    }

    public RemoveLiveRemoteClient(serverId: string, socketId: string): void {

        let tcpServerContext = this.liveServers.find(x => x.Id() == serverId );

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
        this.TcpServerView.ConnEstablishTime = new Date();
        this.TcpServerView.ConnStatus = ServerConnStatus[ServerConnStatus.NotListening];
        this.sockets = [];
    }

    public Id(): string {
        return this.TcpServerView.Id;
    }
}