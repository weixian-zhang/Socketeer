import * as React from 'react';

import {IpcRenderer} from 'electron';

//https://dev.to/franamorim/tutorial-reminder-widget-with-electron-react-1hj9

export default class App extends React.Component {

    ipcRenderer: IpcRenderer;

    constructor(props: any) {
        super(props);

        this.ipcRenderer = window.require('electron').ipcRenderer;
        this.ipcRenderer.send('hello');
    }


    // public readLocalFile(): string {
    //     //return this.fs.readFileSync('C:/Users/weixzha/Desktop/hello.txt','utf8');
    //     return 'hello';
    // }

    // public StartHttpServer(): void {

    //     console.log(this.path.join('a','b','c'));

    //     let app: Application = this.express();
    //     app.get('/', (req: Request, res: Response) => {
    //         let data = this.readLocalFile();
    //         res.send('From Electron App leh. Data' + data)
    //     })

    //     app.listen(8090, () => {
    //         console.log(`Example app listening at http://localhost:${8090}`)
    //     })
    // }
}