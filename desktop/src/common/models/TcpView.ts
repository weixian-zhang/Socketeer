export class IpcType{
    static TCP_Server_Create: string = 'tcp-server-create';
    static TCP_Server_SendData_UpdatedServerClients: string = 'tcp-server-senddata-updatedserveremoteclients';
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
    Data: string;

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

import { SocketView, SocketType, Protocol } from "./SocketView";

export class TcpServerView extends SocketView {
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
}

export class TcpRemoteClientView {

    //address + port is a unique remote client
    RemoteAddress: string = '';
    RemotePort: number = 0;
    ConnectionStatus: string = 'Connecting';
    Error: string = '';

    constructor(remoteAddress: string, remotePort: number, connStatus: string, err: string) {
        this.RemoteAddress = remoteAddress;
        this.RemotePort = remotePort;
        this.ConnectionStatus = connStatus;
        this.Error = err;
    }
}