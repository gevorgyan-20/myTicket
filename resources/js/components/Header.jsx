import { Link, useLocation } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus'; 
import React from 'react';

function Header() {
    const location = useLocation();

    const { isAuthenticated, role, isLoading, user } = useAuthStatus(); 
    
    // Դինամիկ բազային ուղի՝ ադմինի համար
    const adminPath = role === 'admin' ? '/admin' : '';

    if (isLoading) {
        return null; 
    }

    return (
        <header className="main-header">
            <nav className="main-nav-content">
                
                {/* ՁԱԽ ԱՆԿՅՈՒՆ՝ Լոգո */}
                <Link to="/" className="nav-logo">
                    <span class = 'fs-my'>My</span>
                    Ticket.am
                </Link>

                {/* ԿԵՆՏՐՈՆ՝ Նավիգացիա */}
                <ul className="nav-links center-links">
                    <li><Link to="/about">About</Link></li>
                    <li><Link to={`${adminPath}/movies`}>Movies</Link></li>
                    <li><Link to={`${adminPath}/concerts`}>Concerts</Link></li>
                    <li><Link to={`${adminPath}/standups`}>Standups</Link></li>
                </ul>

                {/* ԱՋ ԱՆԿՅՈՒՆ՝ Auth/User Տարրեր */}
                <div className="auth-area">
                    {isAuthenticated ? (
                        <>
                            {/* 1. Admin Dashboard Link (Միայն Admin-ի համար) */}
                            {role === 'admin' && (
                                <Link to="/admin" className="admin-link">Admin Dashboard</Link>
                            )}
                            
                            {/* 2. User/Profile Link (Այստեղից կգնան UserPage, որտեղ կլինի Logout-ը) */}
                            <Link to="/user" className="user-profile-link">
                               <i className="profile-icon"></i>
                               <span>Profile</span>
                            </Link>
                        </>
                    ) : (
                        /* Մուտք Չգործած Օգտատիրոջ Տարրեր */
                        <>
                            <Link to="/register" state={{ backgroundLocation: location }} className="btn-register">Register</Link>
                            <Link to="/login" state={{ backgroundLocation: location }} className="btn-login">Sign In</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;