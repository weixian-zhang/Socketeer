import * as React from 'react';
import { Link, HashRouter as Router } from 'react-router-dom';

export default class NavBar extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Router>
                <div className="row">
                    <nav className="nav nav-tabs navbar-expand-md navbar-custom bg-success justify-content-center">
                        <div className="navbar-collapse collapse order-md-0 dual-collapse2">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/tcp">TCP</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="d-inline-flex">
                            <div className="navbar-nav">
                                <a className="nav-link" href="#">Sign In</a>
                            </div>
                        </div>
                    </nav>
                </div>
            </Router>
        );
    }
}