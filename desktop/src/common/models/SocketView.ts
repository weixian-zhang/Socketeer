export class SocketView {
    Id: string
    SocketType: SocketType
    Protocol: Protocol

    constructor(id: string, socketType: SocketType, protocol: Protocol) {
        this.Id = id;
        this.SocketType = socketType;
        this.Protocol = protocol;
    }

}

export enum Protocol {
    TCP,
    HTTP
}

export enum SocketType {
    Server,
    Client
}