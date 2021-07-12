import * as React from 'react';
import NavBar from './components/NavBar';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom'
import Dashboard from './components/Dashboard';
import TCPServerPane from './components/TCPServerPane';

export default class App extends React.Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Router>
                <div className="container-fluid">
                    <NavBar />
                    <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/dashboard" component={Dashboard} />
                            <Route path="/tcp" component={TCPServerPane} />
                        </Switch>
                </div>
            </Router>
        );
    }
}

// export default hot(module)(App);