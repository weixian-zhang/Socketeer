import { SocketInfo, Protocol, ConnectionStatus } from "./SocketInfo";

export class TcpServerInfo extends SocketInfo {
    DestinationAddress: string
    DestinationPort: number
    ConnectionEstablishTime: Date = new Date()
    ConnectionStatus: ConnectionStatus = ConnectionStatus.Disconnect

    constructor(id: string, destinationAddress: string, destinationPort: number) {
        super(id, Protocol.Tcp);
        this.DestinationAddress = destinationAddress;
        this.DestinationPort = destinationPort;
    }
}