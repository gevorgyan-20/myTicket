import React from 'react';
import { Link } from 'react-router-dom'; 
import useAuthStatus from '../hooks/useAuthStatus'; 

export default function Footer(){
    const { role } = useAuthStatus(); 

    // Determines if the admin prefix should be used for event links
    const adminPath = role === 'admin' ? '/admin' : '';

    return (
        <footer className="footer">
            <div className="container mx-auto px-4">
                
                <div className="footer__top">
                    
                    {/* Left Corner: MyTicket Logo / Home Link */}
                    <Link to="/" className="nav-logo">
                        <span class = 'fs-my'>My</span>
                        Ticket.am
                    </Link>

                    {/* Contact Information (Fake number) */}
                    <div className="footer__contact">
                        <h4 className="footer__contact-title">Contact Us</h4>
                        <p className="footer__contact-item">Phone: <a href="tel:+37498112233" className="footer__contact-link">+374 98 11 22 33</a></p>
                        <p className="footer__contact-item">Email: info@myticketapp.am</p>
                    </div>

                    {/* Navigation */}
                    <nav className="footer__nav">
                        <Link to={`${adminPath}/movies`} className="footer__nav-link">Movies</Link>
                        <Link to={`${adminPath}/concerts`} className="footer__nav-link">Concerts</Link>
                        <Link to={`${adminPath}/standups`} className="footer__nav-link">Standups</Link>
                        <Link to="/about" className="footer__nav-link">About Us</Link>
                    </nav>

                </div>

                {/* Copyright */}
                <div className="footer__copyright">
                    <i className="myticket-icon"></i>
                    <p className="footer__copyright-text">
                        &copy; {new Date().getFullYear()} MyTicketApp. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
