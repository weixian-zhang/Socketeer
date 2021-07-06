import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import MainTcpCommCenter from './MainTcpCommCenter';
import path from 'path';
import Db from './Db';

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



  win.maximize();

  win.webContents.openDevTools();


  MainTcpCommCenter.Instance(win);
  Db.Instance();
}

console.log('');

app.on('ready', createWindow);