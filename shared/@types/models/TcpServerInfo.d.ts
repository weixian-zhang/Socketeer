import { SocketInfo, ConnectionStatus } from "./SocketInfo";
export declare class TcpServerInfo extends SocketInfo {
    DestinationAddress: string;
    DestinationPort: number;
    ConnectionEstablishTime: Date;
    ConnectionStatus: ConnectionStatus;
    constructor(id: string, destinationAddress: string, destinationPort: number);
}
//# sourceMappingURL=TcpServerInfo.d.ts.map