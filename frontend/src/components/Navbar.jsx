// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // we'll create this for styling

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>API Runner</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/run-proxy">Run API</Link></li>
                <li><Link to="/view-all-configs">View All Configs</Link></li>
                <li><Link to="/view-config">View Single Config</Link></li>
                <li><Link to="/add-config">Add Config</Link></li>
                <li><Link to="/update-config">Update Config</Link></li>
                <li><Link to="/delete-config">Delete Config</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;
