import React, { useState }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import TcpService from '../services/TcpService';
import {TcpServerView} from '../../common/models/TcpView';
import { Utils } from '../../common/Utils';

interface AppProps {
    //code related to your props goes here
 }

 interface AppState {
    value: any
 }

export default class TCPPane extends React.Component<any, any> {

    private tcpService: TcpService;

    constructor(props: any) {
        super(props);

        this.tcpService = new TcpService();

        this.state = {
            validateListeningPort: {
                value: '',
                error: false
            }
        };
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
                            <button type="button" className="btn btn-success">
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
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Create TCP Server</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="server-create-port" className="form-label">Listening Port</label>
                                <input type="text" className={!this.state.validateListeningPort.error ? 'form-control': 'form-control is-invalid'} id="server-create-port" placeholder="e.g: 2222" required
                                    onChange={e => {
                                        this.setState({ validateListeningPort: { value: e.target.value, error: false }});
                                    }} />
                                <div className="invalid-feedback">
                                    Please enter valid port number
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-success" onClick={e => this.CreateNewTcpServer(e)}>Create</button>
                        </div>
                        </div>
                    </div>
                </div>
                {/* TCP Server Modal end*/}
            </div>

        );
    }


    CreateNewTcpServer = (event: any) => {

        if(!this.validateServerCreateForm())
            return;

        const tcpServer = new TcpServerView(Utils.Uid(), 2222, '10.2.3.4', 2012);
        this.tcpService.CreateTcpServer(tcpServer);

        //electron.ipcRenderer.send(IPCMessage.TCP_Server_Create);
    }

    private validateServerCreateForm(): boolean {

        const port: number = parseInt(this.state.validateListeningPort.value);
        if(port > 0 && port < 65536) {
            this.setState({validateListeningPort: {error: false}});
            return true;
        } else {
            this.setState({validateListeningPort: {error: true}});
            return false;
        }
    }

}
