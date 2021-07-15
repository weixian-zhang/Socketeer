export class SocketView {
    Id: string = '';
    SocketType: SocketType
    Protocol: Protocol

    constructor(socketType: SocketType, protocol: Protocol) {
        this.SocketType = socketType;
        this.Protocol = protocol;
    }

}

export interface ServerSocketView {
    ListeningPort: number;
}

export class Protocol {
    static TCP: string = 'TCP';
    static HTTP: string = 'HTTP';
}

export class SocketType {
    static Server: string = 'Server';
    static Client: string = 'Client';
}