import electron, {IpcMainEvent, BrowserWindow} from 'electron';
import {TcpServerView, IpcType, TcpDataView} from '../common/models/TcpView';
import {TcpServerManager} from './TcpServerManager';
import { Utils } from '../common/Utils';

export default class TcpRendererIpc {

    private static instance: TcpRendererIpc;
    private tcpManager: TcpServerManager;
    private browser: BrowserWindow;

    private constructor(browser: BrowserWindow, tcpManager: TcpServerManager) {
        this.tcpManager = tcpManager;
        this.browser = browser;
        this.Init();
    }

    public static Instance(browser: BrowserWindow, tcpManager: TcpServerManager): TcpRendererIpc {
        if(Utils.IsUoN(TcpRendererIpc.instance)) {
            TcpRendererIpc.instance = new TcpRendererIpc(browser, tcpManager);
        }

        return TcpRendererIpc.instance;
    }

    public Init() {
        electron.ipcMain.on(IpcType.TCP_Server_Create_On_Startup, this.CreateSavedTcpServers);

        electron.ipcMain.on(IpcType.TCP_Server_Create, this.OnCreateTcpServer);

        electron.ipcMain.on(IpcType.TCP_Server_GetData_UpdatedServerClients, this.OnGetLiveServerdata);

        electron.ipcMain.on(IpcType.TCP_Server_SendData_ToRemoteClient, this.OnSendDataToRemoteClient);

        electron.ipcMain.on(IpcType.TCP_Server_Disconnect_Remote_Client, this.OnDisconnectRemoteClient);
    }

    private CreateSavedTcpServers = (event: IpcMainEvent, args: any): void => {
        this.tcpManager.CreateSavedTcpServers();
    }

    private OnCreateTcpServer = (event: IpcMainEvent, args: any): void => {
       this.tcpManager.CreateTcpServer(<TcpServerView>args);
    }

    private OnGetLiveServerdata= (event: IpcMainEvent, args: any): void => {
        this.tcpManager.GetLiveServerdata();
    }

    //update renderer real-time on any new server and remote clients states
    public SendNewServerStateToRenderer(data: TcpServerView[]) {
        this.browser.webContents.send(IpcType.TCP_Server_SendData_UpdatedServerClients, JSON.stringify(data));
    }


    public OnSendDataToRemoteClient = (event: IpcMainEvent, args: any): void => {
        const dataObj = JSON.parse(args);
        const {data, serverId, socketId} = dataObj;

        this.tcpManager.SendDataToRemoteClient(data, serverId, socketId);
    }

    private OnDisconnectRemoteClient = (event: IpcMainEvent, args: any): void => {
        const {serverId, socketId} = JSON.parse(args);
        this.tcpManager.DisconnectRemoteClient(serverId, socketId);
    }

    public MessageToRenderer(message: string) {
        this.browser.webContents.send(IpcType.General_Message_Info, message);
    }
}