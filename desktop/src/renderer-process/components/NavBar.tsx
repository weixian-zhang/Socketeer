import * as React from 'react';
import { Link, HashRouter as Router } from 'react-router-dom';

export default class NavBar extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Router>
                <nav className="navbar fixed-top navbar-expand-md navbar-custom">
                    <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/tcp">TCP</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="collapse navbar-collapse flex-grow-0">
                        <div className="navbar-nav text-right">
                            <a className="nav-link" href="#">SignIn</a>
                        </div>
                    </div>
                </nav>
            </Router>
        );
    }
}