export class SocketInfo {
    Id: string
    Protocol: Protocol

    constructor(id: string, protocol: Protocol) {
        this.Id = id;
        this.Protocol = protocol;
    }

}

export enum Protocol {
    Tcp,
    Http
}

export enum ConnectionStatus {
    Connected,
    Disconnect
}