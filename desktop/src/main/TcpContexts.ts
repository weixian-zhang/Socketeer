import {RemoteClientView, TcpServerView} from '../common/models/TcpView'
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

    public GetLiveRemoteClient(serverId: string, remoteAddress: string, remotePort: number): Socket | null {

        let serverContext = this.liveServers.find(x => x.Id() == serverId );

        const client = serverContext.sockets.find
            (x => x.remoteAddress == remoteAddress && x.remotePort == remotePort);

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

        this.commsCenter.SendLiveTcpServerData(this.GetAllLiveTcpServer());
    }

    public RemoveLiveRemoteClient(tcpSocket: TcpSocket): void {

        const { Id, ServerId } = tcpSocket;

        let tcpServerContext = this.liveServers.find(x => x.Id() == ServerId );

        if(tcpServerContext != null) {
            //remote UI view
            _.remove(tcpServerContext.TcpServerView.RemoteClients, x => x.Id == Id);

            //remove socket from ServerContext
            _.remove(tcpServerContext.sockets, x => x.Id == Id);
        }
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