export declare class SocketInfo {
    Id: string;
    Protocol: Protocol;
    constructor(id: string, protocol: Protocol);
}
export declare enum Protocol {
    Tcp = 0,
    Http = 1
}
export declare enum ConnectionStatus {
    Connected = 0,
    Disconnect = 1
}
//# sourceMappingURL=SocketInfo.d.ts.map