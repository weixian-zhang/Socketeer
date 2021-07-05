import {IpcType, TcpServerView} from '../../common/models/TcpView';
import electron from 'electron';

export default class TcpService {
    constructor() {
    }

    public CreateTcpServer(tcpView: TcpServerView): void {
        electron.ipcRenderer.send(IpcType.TCP_Server_Create, tcpView);
    }
}