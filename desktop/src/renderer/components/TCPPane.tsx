import React, { useState }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import electron, {IpcRendererEvent} from 'electron';
import {TcpServerView,IpcType, RemoteClientView, TcpRemoteClientView} from '../../common/models/TcpView';
import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import * as _ from 'lodash';
import {RendererTcpCommsCenter, ITcpIpcCallbacks} from '../RendererTcpCommsCenter';

 interface AppState {
    Validation: Validation,
    LiveServers: TcpServerView[]
 }
 type Validation = {
    CreateServer: {
        ListeningPort?: {
            value: number,
            error: boolean
        },
        ServerName?: {
            value: string,
            error: boolean
        }
    }
 }


export default class TCPPane extends React.Component<any, AppState> implements ITcpIpcCallbacks {

    private commsCenter: RendererTcpCommsCenter;
    private _isMounted = false;

    constructor(props: any) {
        super(props);

        this.commsCenter = RendererTcpCommsCenter.Instance(this);

        this.state = {
            Validation: {
                CreateServer: {
                    ListeningPort: {
                        value: 0,
                        error: false
                    },
                    ServerName: {
                        value: '',
                        error: false
                    },
                }
            },
            LiveServers: []
        };
    }

    componentDidMount() {
        this.InitIpcListeners();
    }

    InitIpcListeners = () => {
        electron.ipcRenderer.on(IpcType.TCP_Server_SendData_UpdatedServerClients, (event:IpcRendererEvent, args: any) => {
            this.OnNewSocketUpdateReceive(args);
        });
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
                <div className="row h-50">
                    <div style={{overflow: 'auto', marginTop: '10px'}}>
                        <p className="h6">Servers</p>
                        <table className="table table-striped table-hover table-sm">
                            <thead>
                                <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Listening Port</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    () => {
                                        this.state.LiveServers.map((server: TcpServerView, i) => {
                                            <tr>
                                                <td>{server.Name}</td>
                                                <td>{server.ListeningPort}</td>
                                            </tr>
                                            (server.RemoteClients.length > 0) ?
                                                <tr>
                                                    <td colSpan={2}>
                                                        <p className="h7 mt-10">Remote Clients</p>
                                                        <table className="table mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">client</th>
                                                                    <th scope="col">Remote Port</th>
                                                                    <th scope="col">Status</th>
                                                                    <th scope="col">Error</th>
                                                                    <th scope="col">Connected On</th>
                                                                </tr>
                                                            </thead>
                                                            {
                                                                server.RemoteClients.map((client: RemoteClientView, i) => {
                                                                    <tr>
                                                                        <td colSpan={2}>
                                                                            <p className="h7 mt-10">Remote Clients</p>
                                                                            <table className="table mb-0">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th scope="col">client</th>
                                                                                        <th scope="col">Remote Port</th>
                                                                                        <th scope="col">Status</th>
                                                                                        <th scope="col">Error</th>
                                                                                        <th scope="col">Connected On</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th scope="col">client.RemoteAddress</th>
                                                                                        <th scope="col">client.RemotePort</th>
                                                                                        <th scope="col">client.ConnStatus</th>
                                                                                        <th scope="col">client.Error</th>
                                                                                        <th scope="col">client.ConnEstablishTime</th>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                })
                                                            }
                                                        </table>
                                                    </td>
                                                </tr>
                                            : ''
                                        });
                                    }
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Client */}
                <div className="row h-25">
                    <div style={{overflow: 'auto'}}>
                        <p className="h6">Clients</p>
                        <table className="table table-striped table-hover table-sm">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                </tr>
                                <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                                </tr>
                                <tr>
                                <th scope="row">3</th>
                                <td colSpan={2}>Larry the Bird</td>
                                <td>@twitter</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
                                <input type="text" className={!this.state.Validation.CreateServer.ListeningPort?.error ? 'form-control': 'form-control is-invalid'} id="server-create-port" placeholder="e.g: 2222" required
                                    onChange={e => {
                                        const validation = this.state.Validation;
                                        validation.CreateServer.ListeningPort.value = parseInt(e.target.value);
                                        this.setState({Validation: validation});
                                    }} />
                                <div className="invalid-feedback">
                                    Please enter valid port number
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="server-create-name" className="form-label">Name</label>
                                <input type="text" className={!this.state.Validation.CreateServer.ServerName?.error ? 'form-control': 'form-control is-invalid'} id="server-create-port" placeholder="e.g: server-app-2222" required
                                    maxLength={10}
                                    onChange={e => {
                                        const validation = this.state.Validation;
                                        validation.CreateServer.ServerName.value = e.target.value.trim();
                                        this.setState({Validation: validation});
                                    }} />
                                <div className="invalid-feedback">
                                    Provide a friendly name to identity server
                                    <br />
                                    Nospace
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

        const port: number = this.state.Validation.CreateServer.ListeningPort.value;
        const name: string = this.state.Validation.CreateServer.ServerName?.value;

        const tcpServer = new TcpServerView(name, port);

        this.commsCenter.CreateTcpServer(tcpServer);

        $('#modal-tcp-server-create').modal('hide');
    }

    public OnNewSocketUpdateReceive = (data: string) => {
        const servers: TcpServerView[] = JSON.parse(data);
        let svrState = this.state.LiveServers;
        svrState = servers;
        this.setState({LiveServers: svrState});
    }

    private onMessageInfoReceive = (info: string): void => {
        //TODO: pop-up prompt5
    }

    private validateServerCreateForm(): boolean {

        const errors: number[] = [];
        const port: number =this.state.Validation.CreateServer.ListeningPort.value;
        const name: string =this.state.Validation.CreateServer.ServerName.value;

        let validation = this.state.Validation;


        if(port > 0 && port < 65536) {
            validation.CreateServer.ListeningPort.error = false;
            this.setState({Validation: validation});
        } else {
            validation.CreateServer.ListeningPort.error = true;
            this.setState({Validation: validation});
            errors.push(1);
        }

        if(name != '') {
            validation.CreateServer.ServerName.error = false;
            this.setState({Validation: validation});
        } else {
            validation.CreateServer.ServerName.error = true;
            this.setState({Validation: validation});
            errors.push(1);
        }

        if(errors.length > 0) {
            return false;
        } else {
            return true;
        }
    }

}
