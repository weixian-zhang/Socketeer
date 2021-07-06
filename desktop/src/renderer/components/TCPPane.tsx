import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import TcpService from '../services/TcpService';
import {TcpServerView} from '../../common/models/TcpView';
import { Utils } from '../../common/Utils';

export default class TCPPane extends React.Component {

    private tcpService: TcpService;

    constructor(props: any) {
        super(props);

        this.tcpService = new TcpService();
    }

    render() {
        return(
            // already in container-fluid
            <div>
                <div className="row mt-1">
                    <div className="col-lg-8">
                        <div className="btn-group">
                            <button type="button" className="btn btn-success btn-mr-5"
                            data-bs-toggle="modal" data-bs-target="#modal-tcp-server-create">
                                <FontAwesomeIcon  icon={faPlus} />
                                TCP Server
                            </button>
                            <button type="button" className="btn btn-success" onClick={this.TestClick}>
                                <FontAwesomeIcon  icon={faPlus} />
                                TCP Client
                            </button>
                        </div>

                    </div>
                </div>
                <div className="row">

                </div>

                {/* TCP Server Modal */}
                <div className="modal fade" id="modal-tcp-server-create" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Create TCP Server</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="server-listeningport" placeholder="2222" />
                            {/* <label for="server-listeningport">Listening Port</label> */}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div>
            </div>

        );
    }

    CreateNewTcpServer = (event: any) => {

        const tcpServer = new TcpServerView(Utils.Uid(), 2222, '10.2.3.4', 2012);
        this.tcpService.CreateTcpServer(tcpServer);

        //electron.ipcRenderer.send(IPCMessage.TCP_Server_Create);
    }

    TestClick() {
        console.log('clicked');
    }

}
