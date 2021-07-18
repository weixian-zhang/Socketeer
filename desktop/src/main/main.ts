import { app, dialog, BrowserWindow, Menu } from 'electron';
import isDev from 'electron-is-dev';
import TcpRendererIpc from './TcpRendererIpc';
import {TcpServerManager} from './TcpServerManager';
import * as _ from 'lodash';

console.log(`${__dirname}/node_modules/electron`);
// Enable live reload for Electron too
// require('electron-reload')(path.join(__dirname, '../../'), {
//   // Note that the path to electron may vary according to the main file
//   electron: require(path.join(__dirname, '../../', '/node_modules/electron'))
// });

console.log();

const createWindow = (): void => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });


  console.log(`isDev: ${ isDev }`);

  //win.loadURL(`file://${__dirname}/index.html`);
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${__dirname}/index.html`,
  );

  var menu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {
              label:'Import .soc File',
              click() {
                OpenSocFile(win);
              }
            },
            {label:'Export .soc File'},
            {
              label:'Exit',
              click() {
                app.exit();
              }
            }
        ]
    }
])
Menu.setApplicationMenu(menu);

  win.maximize();

  win.title = "Socketeer";

  if(isDev){
    win.webContents.openDevTools();
  }

  const tcpManager = TcpServerManager.Instance();
  const tcpRendererIpc = TcpRendererIpc.Instance(win, tcpManager);
  tcpManager.SetRendererIpc(tcpRendererIpc);

  tcpManager.CreateSavedTcpServers();
}

app.on('ready', createWindow);

/**helpers */
const OpenSocFile = (win: BrowserWindow):void => {
  const dialogPromise = dialog.showOpenDialog(win, { properties: ['openFile'] });

  dialogPromise.then((result) => {

    const socFilePath: string = _.first(result.filePaths);

  }).catch(err => {
    console.log(err)
  })
}