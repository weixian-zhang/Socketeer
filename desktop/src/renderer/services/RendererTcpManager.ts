import IpcMessage from '../../common/IpcMessage';
import electron from 'electron';

export default class RendererTcpManager {
    constructor() {
    }

    public CreateTcpServer(): void {
        electron.ipcRenderer.send(IpcMessage.TCP_Server_Create);
    }
}