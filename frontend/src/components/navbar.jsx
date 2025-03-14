import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

const Navbar = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="brand">Ratings App</Link>
                <Link to="/" className="nav-link">Stores</Link>
                {auth.user && auth.user.role !== 'normal' && (
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                )}
            </div>
            <div className="nav-right">
                {auth.token ? (
                    <>
                        <span className="nav-text">Hello, {auth.user.name}</span>
                        <button onClick={handleLogout} className="button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
