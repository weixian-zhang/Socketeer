import * as React from 'react';
import {Application, Request, Response} from 'express';
const app = window.require('electron').remote;
// const fs = app.require('fs')
// const express = app.require('express')

//https://dev.to/franamorim/tutorial-reminder-widget-with-electron-react-1hj9

export default class App extends React.Component {

    fs: any;
    express: any;

    constructor(props: any) {
        super(props);

        this.fs = app.require('fs');

        this.express = app.require('express');

        this.StartHttpServer();
    }

    public readLocalFile(): string {
        return this.fs.readFileSync('C:/Users/weixzha/Desktop/hello.txt','utf8');
    }

    public StartHttpServer(): void {

        let app: Application = this.express();
        app.get('/', (req: Request, res: Response) => {
            let data = this.readLocalFile();
            res.send('From Electron App leh. Data' + data)
        })

        app.listen(8090, () => {
            console.log(`Example app listening at http://localhost:${8090}`)
        })
    }
}