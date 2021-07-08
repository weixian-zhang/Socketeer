import electron, {IpcMainEvent, BrowserWindow} from 'electron';
import {TcpServerView, IpcType} from '../common/models/TcpView';
import TcpServerManager from './TcpServerManager';
import { Utils } from '../common/Utils';

export default class MainTcpCommCenter {

    private static instance: MainTcpCommCenter;
    private tcpManager: TcpServerManager;
    private browser: BrowserWindow;

    private constructor(browser: BrowserWindow) {
        this.tcpManager = TcpServerManager.Instance(this);
        this.browser = browser;
        this.Init();
    }

    public static Instance(browser: BrowserWindow): MainTcpCommCenter {
        if(Utils.IsUoN(MainTcpCommCenter.instance)) {
            MainTcpCommCenter.instance = new MainTcpCommCenter(browser);
        }

        return MainTcpCommCenter.instance;
    }

    public Init() {
        electron.ipcMain.on(IpcType.TCP_Server_Create, this.handleIpcCreateTcpServer);
    }

    private handleIpcCreateTcpServer = (event: IpcMainEvent, args: any): void => {
       this.tcpManager.CreateTcpServer(<TcpServerView>args);
    }

    //update renderer real-time on any new server and remote clients states
    public SendLiveTcpServerData(data: TcpServerView[]) {
        this.browser.webContents.send(IpcType.TCP_Server_SendData_UpdatedServerClients, JSON.stringify(data));
    }

    public MessageInfo(message: string) {
        this.browser.webContents.send(IpcType.General_Message_Info, message);
    }
}