import React from 'react';

export default class App extends React.Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <div onClick = {this.clicked}>hello!</div>
            </div>
        );
    }

    clicked = () : void => {
        console.log("clicked!!!");
    }
}