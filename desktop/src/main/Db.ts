import DB from 'better-sqlite3-helper';
//import {Database} from 'better-sqlite3'
import {TcpServerView} from '../common/models/TcpView';
import { SocketView, Protocol, SocketType } from "../common/models/SocketView";

DB({
    path: './dist/Db/sqlite3.db', // this is the default
    readonly: false, // read only
    fileMustExist: false, // throw error if database not exists
    WAL: true, // automatically enable 'PRAGMA journal_mode = WAL'
    migrate: false
  })

//https://www.npmjs.com/package/better-sqlite3-helper

export default class Db {

    private static instance: Db;

    //db: Database;
    SocketViewTable: string = 'SocketView';
    tableExist: string = `SELECT name FROM sqlite_master WHERE type='table' AND name='${this.SocketViewTable}';`;
    createSocketViewTable: string = `CREATE TABLE IF NOT EXISTS ${this.SocketViewTable}(Id PRIMARY KEY, Protocol text, SocketType text, Info text)`;


    //https://github.com/DefinitelyTyped/DefinitelyTyped/blob/5e58f71c5e96c7c4bfc316f3b5b3f39124027609/types/electron-store/electron-store-tests.ts#L1

    private constructor() {
        // this.db = DB();
        //this.InitDb();

        DB().exec(this.createSocketViewTable);
    }

    public static Instance(): Db {
        if (!Db.instance) {
            Db.instance = new Db();
        }

        return Db.instance;
    }

    public AddSocket(socketView: SocketView, info: any): void {
        const infoj: string = JSON.stringify(info);
        // const insert: string =
        //     `INSERT INTO ${this.activeSocketTable}(Id, Protocol, SocketType, Info)` +
        //     `VALUES(${socket.Id}, ${socket.Protocol}, ${socket.SocketType}, ${infoj})`;

        DB().insert(this.SocketViewTable, {
            Id: socketView.Id,
            Protocol: socketView.Protocol,
            SocketType: socketView.SocketType,
            Info: infoj
        });

        // this.db.run(insert, function(err: Error) {
        //     if (err) {
        //       return console.log(err.message);
        //     }
        //   });

        // this.db.close();
    }

    public RemoveSocket(socketView: SocketView): void {
        //const delTSQL: string = `DELETE FROM ${this.activeSocketTable} WHERE Id = '${socket.Id}'`;


        DB().delete(this.SocketViewTable, {
            Id: socketView.Id
        });

        // this.db.are(delTSQL, function(err: Error) {
        //     return console.log(err.message);
        // });
    }

    public GetTcpServers(): TcpServerView[] {

    const tcpServers: TcpServerView[] = [];

    let rows: any[] =
        DB().query(`SELECT * from ${this.SocketViewTable} WHERE Protocol = '${Protocol.TCP}' AND SocketType = '${SocketType.Server}'`);

    for(let x of rows) {
        let tcpServer: TcpServerView = x as TcpServerView;
        tcpServers.push(tcpServer);
    }

    return tcpServers;
    //    const getAllTcpServers: string = `SELECT * from ${this.activeSocketTable} WHERE Protocol = '${Protocol.TCP}' AND SocketType = '${SocketType.Server}'`;
    //     this.db.all(getAllTcpServers, (err: Error, rows: any[]) => {

    //         rows.forEach((row) => {
    //             const infoj: any = JSON.parse(row.Info);
    //             const info: TcpServerView = <TcpServerView>infoj;
    //             tcpServers.push(info);
    //         });
    //     });

    //     return tcpServers;
    }

    // private InitDb = (): void => {
    //     this.db.get(this.tableExist, (err: Error, rows: any[]) => {
    //         // if (rows.length == 0) {

    //         //     this.db.run(this.createActiveSocketTable, function(err: Error) {
    //         //         return console.log(err.message);
    //         //     });
    //         // }
    //     });
    // }
}