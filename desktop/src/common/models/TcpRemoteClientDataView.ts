export default class TcpRemoteClientDataView {
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