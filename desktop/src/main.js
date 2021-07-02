"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var TcpManager_1 = __importDefault(require("./main/TcpManager"));
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    console.log("isDev: " + electron_is_dev_1.default);
    win.loadURL("file://" + __dirname + "/src/index.html");
    // win.loadURL(
    //   isDev
    //     ? 'http://localhost:3000'
    //     : `file://${app.getAppPath()}/index.html`,
    // );
    win.maximize();
    win.webContents.openDevTools();
};
electron_1.app.on('ready', createWindow);
var tcp = new TcpManager_1.default();
tcp.CreateTcpServer();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxQ0FBOEM7QUFDOUMsb0VBQW9DO0FBQ3BDLGlFQUEyQztBQUUzQyxJQUFNLFlBQVksR0FBRztJQUNuQixJQUFJLEdBQUcsR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDMUIsS0FBSyxFQUFFLEdBQUc7UUFDVixNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNkLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLHVCQUF1QixFQUFFLElBQUk7WUFDN0IsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFXLHlCQUFRLENBQUMsQ0FBQztJQUVqQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVUsU0FBUyxvQkFBaUIsQ0FBQyxDQUFDO0lBQ2xELGVBQWU7SUFDZixVQUFVO0lBQ1YsZ0NBQWdDO0lBQ2hDLGlEQUFpRDtJQUNqRCxLQUFLO0lBRUwsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRWYsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNqQyxDQUFDLENBQUE7QUFFRCxjQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUU5QixJQUFNLEdBQUcsR0FBRyxJQUFJLG9CQUFVLEVBQUUsQ0FBQztBQUM3QixHQUFHLENBQUMsZUFBZSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3cgfSBmcm9tICdlbGVjdHJvbic7XHJcbmltcG9ydCBpc0RldiBmcm9tICdlbGVjdHJvbi1pcy1kZXYnO1xyXG5pbXBvcnQgVGNwTWFuYWdlciBmcm9tICcuL21haW4vVGNwTWFuYWdlcic7XHJcblxyXG5jb25zdCBjcmVhdGVXaW5kb3cgPSAoKTogdm9pZCA9PiB7XHJcbiAgbGV0IHdpbiA9IG5ldyBCcm93c2VyV2luZG93KHtcclxuICAgIHdpZHRoOiA4MDAsXHJcbiAgICBoZWlnaHQ6IDYwMCxcclxuICAgIHdlYlByZWZlcmVuY2VzOiB7XHJcbiAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcclxuICAgICAgbm9kZUludGVncmF0aW9uSW5Xb3JrZXI6IHRydWUsXHJcbiAgICAgIGNvbnRleHRJc29sYXRpb246IGZhbHNlLFxyXG4gICAgICBlbmFibGVSZW1vdGVNb2R1bGU6IHRydWVcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgY29uc29sZS5sb2coYGlzRGV2OiAkeyBpc0RldiB9YCk7XHJcblxyXG4gIHdpbi5sb2FkVVJMKGBmaWxlOi8vJHtfX2Rpcm5hbWV9L3NyYy9pbmRleC5odG1sYCk7XHJcbiAgLy8gd2luLmxvYWRVUkwoXHJcbiAgLy8gICBpc0RldlxyXG4gIC8vICAgICA/ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnXHJcbiAgLy8gICAgIDogYGZpbGU6Ly8ke2FwcC5nZXRBcHBQYXRoKCl9L2luZGV4Lmh0bWxgLFxyXG4gIC8vICk7XHJcblxyXG4gIHdpbi5tYXhpbWl6ZSgpO1xyXG5cclxuICB3aW4ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XHJcbn1cclxuXHJcbmFwcC5vbigncmVhZHknLCBjcmVhdGVXaW5kb3cpO1xyXG5cclxuY29uc3QgdGNwID0gbmV3IFRjcE1hbmFnZXIoKTtcclxudGNwLkNyZWF0ZVRjcFNlcnZlcigpOyJdfQ==