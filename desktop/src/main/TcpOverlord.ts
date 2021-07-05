import {TcpServerView} from '../common/models/TcpView';
import TcpServerManager from './TcpServerManager';
import {TcpServerContextOverseer} from './TcpServerContext';
import { Utils } from '../common/Utils';
export default class TcpOverlord {

    private static instance: TcpOverlord;
    private serverManager: TcpServerManager;
    private contextOverseer: TcpServerContextOverseer;

    private constructor() {
        this.serverManager = TcpServerManager.Instance();
        this.contextOverseer = TcpServerContextOverseer.Instance();
    }

    public static Instance(): TcpOverlord {
        if(Utils.IsUoN(TcpOverlord.instance)) {
            TcpOverlord.instance = new TcpOverlord();
        }

        return TcpOverlord.instance;
    }

    public CreateTcpServer(tcpInfo: TcpServerView) {

        //TODO: create tcp server

        this.serverManager.CreateTcpServer(tcpInfo);

        //store db
        // const tcpInfo: TcpServerInfo = args as TcpServerInfo;

        // this.db.AddSocket(tcpInfo);

        // const result: any = this.db.GetTcpServers();
    }
}