import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import MainTcpCommCenter from './main/MainTcpCommCenter';
import path from 'path';
import Db from './main/Db';

console.log(path.join(__dirname, '../', 'node_modules/.bin/electron.cmd'));

// require('electron-reload')(__dirname, {

//   electron: path.join(__dirname, '../', 'node_modules/.bin/electron.cmd')
// });

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

  win.loadURL(`file://${__dirname}/index.html`);
  // win.loadURL(
  //   isDev
  //     ? 'http://localhost:3000'
  //     : `file://${app.getAppPath()}/index.html`,
  // );



  win.maximize();

  win.webContents.openDevTools();


  MainTcpCommCenter.Instance(win);
  Db.Instance();
}

console.log('');

app.on('ready', createWindow);