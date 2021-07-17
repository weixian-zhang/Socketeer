export class SocketView {
    Id: string = '';
    SocketType: SocketType;
    Protocol: Protocol;
    ListeningPort?: number;

    constructor(socketType: SocketType, protocol: Protocol, listeningPort?: number) {
        this.SocketType = socketType;
        this.Protocol = protocol;
        this.ListeningPort = listeningPort;
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