import electron, {IpcMainEvent} from 'electron';
import IpcMessage from '../common/IpcMessage';

export default class TcpManager {
    constructor() {

    }

    public InitTcpServer(): void {
        electron.ipcMain.on(IpcMessage.TCP_Server_Create, this.handleCreateTcpServer);
    }

    private handleCreateTcpServer(event: IpcMainEvent): void {

        console.log('main process hit!')

    }
}