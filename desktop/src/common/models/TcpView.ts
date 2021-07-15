export class IpcType{
    static TCP_Server_Create_On_Startup: string = 'tcp-server-create-on-startup';
    static TCP_Server_Create: string = 'tcp-server-create';
    static TCP_Server_Disconnect_Remote_Client: string = 'tcp-server-disconnect-remote-client';
    static TCP_Server_GetData_UpdatedServerClients: string = 'tcp-server-getdata-updatedserveremoteclients';
    static TCP_Server_SendData_UpdatedServerClients: string = 'tcp-server-senddata-updatedserveremoteclients';
    static TCP_Server_SendData_ToRemoteClient: string = 'tcp-server-senddata-toremoteclient';
    static General_Message_Info: string = 'general-message-info';
}

export class RemoteClientView {
    Id: string;
    ServerId: string;
    RemoteAddress: string;
    RemotePort: number;
    Error: string;
    ConnEstablishTime: Date;
    ConnStatus: string = '';
    Data: TcpDataView[] = [];

    constructor( id: string, serverId: string, remoteAddress: string, remotePort: number,
        connEstablishTime: Date, connStatus: string) {
        this.Id = id;
        this.ServerId = serverId;
        this.RemoteAddress = remoteAddress;
        this.RemotePort = remotePort;
        this.ConnEstablishTime = connEstablishTime;
        this.ConnStatus = connStatus;
    }
}

import { SocketView, SocketType, Protocol, ServerSocketView } from "./SocketView";

export class TcpServerView extends SocketView implements ServerSocketView {
    Name: string = '';
    ListeningPort: number;
    ConnEstablishTime: Date;
    ConnStatus: string = '';
    Error: string = '';
    RemoteClients: RemoteClientView[] = [];

    constructor(name:string, listeningPort: number) {
        super(SocketType.Server, Protocol.TCP);

        this.Name = name;
        this.ListeningPort = listeningPort;
    }

    public IsListening(): boolean {
        return (this.ConnStatus == 'Listening') ? true : false;
    }
}

export class TcpDataView {
    ServerId: string;
    SocketId: string;
    Data: string = '';
    SendAt: Date = new Date();
    IsReceive: boolean = false;

    constructor(serverId: string, socketId: string, data: string, isReceive?: boolean) {
        this.ServerId = serverId;
        this.SocketId = socketId;
        this.Data = data;
        this.IsReceive = isReceive;
    }
}