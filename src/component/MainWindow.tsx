import React, { Component } from 'react';
import * as fs from 'fs';
//https://finbits.io/blog/electron-create-react-app-electron-builder/
//https://msanatan.com/2020/04/19/accessing-nodejs-modules-with-create-react-app-and-electron/
export default class MainWindow extends React.Component {
    constructor(props: any) {
        super(props);

        this.PrintFileContent();
    }

    render(){
        return (
            ''
        );
    }

    PrintFileContent(): void {

        let data = fs.readFileSync('C:/Users/weixzha/Desktop/ftr/hello.txt','utf-8');

        console.log(data);
    }

}