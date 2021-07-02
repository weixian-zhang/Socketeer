import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import RendererTcpManager from '../services/RendererTcpManager';

export default class TCPPane extends React.Component {

    private tcpManager: RendererTcpManager;

    constructor(props: any) {
        super(props);

        this.tcpManager = new RendererTcpManager();
    }

    render() {
        return(
            // already in container-fluid
            <div>
                <div className="row mt-1">
                    <div className="col-lg-8">
                        <div className="btn-group">
                            <button type="button" className="btn btn-success btn-mr-5"
                             onClick={this.CreateNewTcpServer}>
                                <FontAwesomeIcon  icon={faPlus} />
                                TCP Server
                            </button>
                            <button type="button" className="btn btn-success">
                                <FontAwesomeIcon  icon={faPlus} />
                                TCP Client
                            </button>
                        </div>

                    </div>
                </div>
                <div className="row">

                </div>
            </div>

        );
    }

    CreateNewTcpServer = (event: any) => {

        this.tcpManager.CreateTcpServer();

        //electron.ipcRenderer.send(IPCMessage.TCP_Server_Create);
    }

}
