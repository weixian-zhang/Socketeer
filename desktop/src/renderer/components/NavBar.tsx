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
                    <nav className="nav nav-tabs navbar-expand-md navbar-custom justify-content-center">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/tcp">TCP Server</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </Router>
        );
    }
}