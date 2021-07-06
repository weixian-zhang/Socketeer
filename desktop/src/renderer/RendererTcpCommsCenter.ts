import electron from 'electron';
import {TcpServerView, IpcType} from '../common/models/TcpView';

export default class RendererTcpCommsCenter {

    private static instance: RendererTcpCommsCenter;

    private constructor() {

    }

    public static Instance(): RendererTcpCommsCenter {
        if(!this.instance) {
            this.instance = new RendererTcpCommsCenter();
        }

        return this.instance;
    }

    public CreateTcpServer(serviceView: TcpServerView) {
        electron.ipcRenderer.send(IpcType.TCP_Server_Create, serviceView);
    }
}