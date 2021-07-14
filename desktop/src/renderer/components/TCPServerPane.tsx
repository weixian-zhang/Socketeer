import React, { useState }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faReply, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import electron, {IpcRendererEvent} from 'electron';
import {TcpServerView,IpcType, RemoteClientView, TcpDataView} from '../../common/models/TcpView';
import $ from 'jquery';
import {Modal} from 'bootstrap/dist/js/bootstrap.bundle.min';
import * as _ from 'lodash';
import moment from 'moment';
import {Utils} from '../../common/Utils';

 interface AppState {
    Validation: Validation,
    LiveServers: TcpServerView[],
    SelectedSocket: {
        ServerId: string,
        SocketId: string
    }
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


export default class TCPServerPane extends React.Component<any, AppState> {

    private _isMounted = false;
    private modalTcpServerCreate: Modal;
    private modalSocketViewData: Modal;
    private modalShowMsgFromMain: Modal;

    constructor(props: any) {
        super(props);

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
            LiveServers: [],
            SelectedSocket: {
                ServerId: '',
                SocketId: ''
            }
        };

        this.CreateSavedTcpServers();


        //this.GetLiveTcpServerData();
    }

    componentDidMount() {

        this.modalTcpServerCreate = new Modal(document.getElementById("modal-tcp-server-create"), {});
        this.modalSocketViewData = new Modal(document.getElementById("modal-remoteclient-receivedata"), {});
        this.modalShowMsgFromMain = new Modal(document.getElementById("modal-show-message-from-main"), {});

        this.InitIpcListeners();
    }

    InitIpcListeners = () => {
        electron.ipcRenderer.on(IpcType.TCP_Server_SendData_UpdatedServerClients, (event:IpcRendererEvent, args: any) => {
            this.OnNewSocketUpdateReceive(args);
        });

        electron.ipcRenderer.on(IpcType.General_Message_Info, (event:IpcRendererEvent, args: any) => {
            this.ShowMessageFromMain(args);
        });
    }

    CreateSavedTcpServers() {
        electron.ipcRenderer.send(IpcType.TCP_Server_Create_On_Startup);
    }

    render() {
        return(
            // already in container-fluid
            <div className="row">

            <div className="container-fluid" style={{overflowY: 'auto'}}>
                <div className="row mt-1">
                    <div className="col-lg-8">
                     <button type="button" className="btn btn-secondary btn-mr-5"
                            data-bs-toggle="modal" data-bs-target="#modal-tcp-server-create">
                                <FontAwesomeIcon  icon={faPlus} />
                                TCP Server
                            </button>

                    </div>
                </div>
                <div className="row h-50">
                    <div style={{marginTop: '10px'}}>
                        <p className="h6">Servers</p>
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Listening Port</th>
                                    <th scope="col">Error</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            {
                                this.state.LiveServers.map((server: TcpServerView, i) => {
                                    return (
                                        <tbody>
                                            <tr>
                                                <th>{server.Name}</th>
                                                <td><b>{server.ListeningPort}</b></td>
                                                <td><span style={{width: '30px'}}>{server.Error}</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                            Actions
                                                        </button>
                                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                            <li><a className="dropdown-item" href="#">Close</a></li>
                                                            <li><a className="dropdown-item" href="#">Listen</a></li>
                                                            <li><a className="dropdown-item" href="#">Remove</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            {this.RenderRemoteClients(server.RemoteClients)}
                                        </tbody>
                                    )
                                })
                            }
                        </table>
                    </div>
                </div>

                {/* TCP Server Modal */}
                <div className="modal fade" id="modal-tcp-server-create">
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
                                    maxLength={20}
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
                {/* end TCP Server Modal*/}

                {/* modal show main message*/}
                <div className="modal" id="modal-show-message-from-main">
                    <div className="modal-dialog modal-dialog-centered" >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title" id="exampleModalLabel">Info</h6>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p id="modal-show-message-from-main-message"></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Socket receive data modal*/}
                <div className="modal fade" id="modal-remoteclient-receivedata">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                        <div className="modal-content">
                            <div className="modal-body">
                                {
                                    this.RenderSocketReceiveData()
                                }
                            </div>

                            <div className="modal-footer">
                                <div className="container-fluid">
                                    <div className="row">
                                        <textarea id="textarea-server-senddata-remoteclient" placeholder="send data to client" className="form-control" style={{height: '90px'}} />
                                    </div>
                                    <div className="row mt-2">
                                        <button type="button" className="btn btn-secondary"
                                        onClick={this.SendDataToRemoteClient}>Send</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>


            </div>
        );
    }

    private RenderRemoteClients(clients: RemoteClientView[]) {
        return (
            (clients.length > 0) ?
                <tr>
                    <td colSpan={2}>
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Remote Address</th>
                                    <th scope="col">Remote Port</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Error</th>
                                    <th scope="col">Connected On</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            {
                                clients.map((client: RemoteClientView, i) => {
                                    return (
                                        <tbody>
                                            <tr>
                                                <th scope="row">{client.RemoteAddress}</th>
                                                <td>{client.RemotePort}</td>
                                                <td>{client.ConnStatus}</td>
                                                <td>{client.Error}</td>
                                                <td>{moment(client.ConnEstablishTime).startOf('minute').fromNow()}</td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                            Actions
                                                        </button>
                                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                            <li><a className="dropdown-item" href="#"
                                                                data-bs-toggle="modal" data-bs-target="#modal-remoteclient-receivedata"
                                                              onClick={ e => {
                                                                const selectedSocket = this.state.SelectedSocket;
                                                                selectedSocket.ServerId = client.ServerId;
                                                                selectedSocket.SocketId = client.Id;
                                                                this.setState({SelectedSocket: selectedSocket});
                                                                }}>View/Send Data</a></li>
                                                            <li><a className="dropdown-item" onClick={(e) => {
                                                                const selectedSocket = this.state.SelectedSocket;
                                                                selectedSocket.ServerId = client.ServerId;
                                                                selectedSocket.SocketId = client.Id;
                                                                this.setState({SelectedSocket: selectedSocket});
                                                                this.DisconnectRemoteClient();
                                                            }}>Disconnect</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })
                            }
                        </table>
                    </td>
                </tr>
            : ''
        );
    }

    private RenderSocketReceiveData() {

        const socketData: TcpDataView[] = [];

        this.state.LiveServers.map((server: TcpServerView, i) => {
            if(server.Id == this.state.SelectedSocket.ServerId) {
                server.RemoteClients.map((client: RemoteClientView, index) => {
                    if(client.Data.length > 0) {
                        if(client.Id == this.state.SelectedSocket.SocketId) {
                            client.Data.map((data: TcpDataView, index) => {
                                socketData.push(data);
                            })
                        }
                    }
                });
            }
        });

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className = "col">
                    <h6>Receive</h6>
                    {
                        (socketData.length > 0) ?
                        _.sortBy(socketData, 'SendAt')
                            .reverse()
                                .filter(x => x.IsReceive)
                                    .map((data: TcpDataView, index) => {
                            return(
                                <div  className={(data.IsReceive) ? 'card border-info mt-2' : 'card  border-success mt-2'}>
                                    <div>
                                        <span>
                                        {
                                            (data.IsReceive) ?
                                                <FontAwesomeIcon  icon={faReply} />
                                            :
                                                <FontAwesomeIcon  icon={faPaperPlane} />
                                        }
                                        </span>
                                        <span style={{marginLeft: '8px'}}>{moment(data.SendAt).startOf('minute').fromNow()}:</span>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{data.Data}</p>
                                    </div>
                                </div>
                            )
                        })
                        : <div>no data receive</div>
                    }
                    </div>
                    <div className = "col">
                    <h6>Sent</h6>
                    {
                        (socketData.length > 0) ?
                        _.sortBy(socketData, 'SendAt')
                            .reverse()
                                .filter(x => !x.IsReceive)
                                    .map((data: TcpDataView, index) => {
                            return(
                                <div  className={(data.IsReceive) ? 'card border-info mt-2' : 'card  border-success mt-2'}>
                                    <div>
                                        <span>
                                        {
                                            (data.IsReceive) ?
                                                <FontAwesomeIcon  icon={faReply} />
                                            :
                                                <FontAwesomeIcon  icon={faPaperPlane} />
                                        }
                                        </span>
                                        <span style={{marginLeft: '8px'}}>{moment(data.SendAt).startOf('minute').fromNow()}:</span>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{data.Data}</p>
                                    </div>
                                </div>
                            )
                        })
                        : <div>no data sent</div>
                    }
                    </div>
                </div>
            </div>
        );
    }

    private ShowMessageFromMain = (message: string) => {
        $("#modal-show-message-from-main-message").text(message);
        this.modalShowMsgFromMain.show();
    }

    private CreateNewTcpServer = (event: any) => {

        if(!this.validateServerCreateForm())
            return;

        const port: number = this.state.Validation.CreateServer.ListeningPort.value;
        const name: string = this.state.Validation.CreateServer.ServerName?.value;

        const tcpServer = new TcpServerView(name, port);

        this.CreateTcpServer(tcpServer);

        this.modalTcpServerCreate.hide();
    }

    private CreateTcpServer(tcpServer: TcpServerView): void {
        electron.ipcRenderer.send(IpcType.TCP_Server_Create, tcpServer);
    }

    private DisconnectRemoteClient(): void {
        const serverId: string = this.state.SelectedSocket.ServerId;
        const socketId: string = this.state.SelectedSocket.SocketId;
        electron.ipcRenderer.send(IpcType.TCP_Server_Disconnect_Remote_Client,
            JSON.stringify({
                serverId: serverId,
                socketId: socketId
            })
        );
    }

    private SendDataToRemoteClient = (): void =>  {
        const data: string = $("#textarea-server-senddata-remoteclient").val() as string;

        if(Utils.IsUoN(data))
            return;

        electron.ipcRenderer.send(IpcType.TCP_Server_SendData_ToRemoteClient,
            JSON.stringify({
            data: data,
            serverId: this.state.SelectedSocket.ServerId,
            socketId: this.state.SelectedSocket.SocketId
        }));
    }

    public OnNewSocketUpdateReceive = (data: string) => {
        const newServers: TcpServerView[] = JSON.parse(data);
        let existingServers = this.state.LiveServers;

        existingServers = newServers;
        this.setState({LiveServers: existingServers});

    }


    // private OnServerReceiveDataFromClient = (data: string) => {
    //     const tcpData: TcpDataView = JSON.parse(data)

    //     const liveServers = this.state.LiveServers;
    //     liveServers.map((server: TcpServerView, index) => {
    //         if(server.Id == tcpData.ServerId) {
    //             server.RemoteClients.map((client: RemoteClientView, index) => {
    //                 if(client.Id == tcpData.SocketId) {
    //                     client.Data.push(tcpData);
    //                 }
    //             });
    //         }
    //     });

    //     this.setState({LiveServers: liveServers});
    // }

    private GetLiveTcpServerData = (): void => {
        electron.ipcRenderer.send(IpcType.TCP_Server_GetData_UpdatedServerClients);
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

    // private SortDataByLatest(data: TcpDataView[]): TcpDataView[] {
    //     return _.sortBy(data, 'SendAt');
    //     return sortedData;
    // }
}
