import {IpcType, TcpServerView} from '../../common/models/TcpView';
import RendererTcpCommsCenter from '../RendererTcpCommsCenter';
import electron from 'electron';

export default class TcpService {

    commsCenter: RendererTcpCommsCenter;
    private static instance: TcpService;

    private constructor() {
        this.commsCenter = RendererTcpCommsCenter.Instance();
    }

    public static Instance(): TcpService {
        if(!this.instance) {
            this.instance = new TcpService();
        }

        return this.instance;
    }


    public CreateTcpServer(server: TcpServerView): void {
        this.commsCenter.CreateTcpServer(server);
    }
}