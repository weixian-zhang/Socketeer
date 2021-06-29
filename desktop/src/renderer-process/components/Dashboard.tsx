import * as React from 'react';

import * as shared from '../../../../shared/models/SocketInfo'

export default class Dashboard extends React.Component {

    socketInfo: shared.SocketInfo;

    constructor(props: any) {
        super(props);

        this.socketInfo = new shared.SocketInfo("SocketInfo from shared project", shared.Protocol.Tcp);
    }

    render() {
        return(
            <div>
                Dashboard - {this.socketInfo.Id}
            </div>
        );
    }

}
