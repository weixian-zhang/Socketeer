import electron, {IpcMainEvent, BrowserWindow} from 'electron';
import {TcpServerView, TcpRemoteClientDataView, IpcType} from '../common/models/TcpView';
import TcpOverlord from './TcpOverlord';
import { Utils } from '../common/Utils';

export default class MainTcpCommCenter {

    private static instance: MainTcpCommCenter;
    private tcpOverlord: TcpOverlord;
    private browser: BrowserWindow;

    private constructor(browser: BrowserWindow) {
        this.tcpOverlord = TcpOverlord.Instance();
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
       this.tcpOverlord.CreateTcpServer(<TcpServerView>args);
    }

    public RemoteClientSendData(data: TcpRemoteClientDataView) {
        this.browser.webContents.send(IpcType.TCP_Server_RemoteClient_Send_Data, JSON.stringify(data));
    }
}