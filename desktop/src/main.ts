import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import TcpManager from './main/TcpManager';

const createWindow = (): void => {
  let win = new BrowserWindow({
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
}

app.on('ready', createWindow);

const tcp = new TcpManager();
tcp.InitTcpServer();