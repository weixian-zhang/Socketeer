import electron, {IpcRendererEvent} from 'electron';
import {TcpServerView, IpcType} from '../common/models/TcpView';

export interface ITcpIpcCallbacks {
    OnNewSocketUpdateReceive(data: string): void;
}

export class RendererTcpCommsCenter {

    private static instance: RendererTcpCommsCenter;
    private tcpPaneCallbacks: ITcpIpcCallbacks;

    private constructor(tcpPaneCallbacks: ITcpIpcCallbacks) {
        this.tcpPaneCallbacks = tcpPaneCallbacks;
    }

    public static Instance(tcpIpcCalbacks: ITcpIpcCallbacks): RendererTcpCommsCenter {
        if(!this.instance) {
            this.instance = new RendererTcpCommsCenter(tcpIpcCalbacks);
        }

        return this.instance;
    }

    public CreateTcpServer(serviceView: TcpServerView) {
        electron.ipcRenderer.send(IpcType.TCP_Server_Create, serviceView);
    }

    public InitIpcListeners = () => { //, onMessageInfoReceive) {

        electron.ipcRenderer.on(IpcType.TCP_Server_SendData_UpdatedServerClients, (event:IpcRendererEvent, args: any) => {
            this.tcpPaneCallbacks.OnNewSocketUpdateReceive(args);
        });

        //general message - info
        // electron.ipcRenderer.on(IpcType.General_Message_Info, (event:IpcRendererEvent, args: any) => {
        //     onMessageInfoReceive(args as string);
        // });
    }
}