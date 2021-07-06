export class IpcType{
    static TCP_Server_Create: string = 'tcp-server-create';
    static TCP_Server_RemoteClient_Send_Data: string = 'tcp-server-remoteclient-send-data';
}

export class TcpRemoteClientDataView {
    ServerId: string;
    RemoteAddress: string;
    RemotePort: number;
    Data: string;

    constructor( serverId: string, remoteAddress: string, remotePort: number, data: string) {
        this.ServerId = serverId;
        this.RemoteAddress = remoteAddress;
        this.RemotePort = remotePort;
        this.Data = data;
    }
}

import { SocketView, SocketType, Protocol } from "./SocketView";

export class TcpServerView extends SocketView {
    ListeningPort: number;
    ConnectionEstablishTime: Date = new Date()
    ConnDescription: string = '';
    Error: string = '';

    constructor(id: string, listeningPort: number) {
        super(id, SocketType.Server, Protocol.TCP);
        this.ListeningPort = listeningPort;
    }
}

export class TcpRemoteClientView {

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