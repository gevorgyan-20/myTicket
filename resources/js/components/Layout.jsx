import { useLocation, matchPath } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import React, { useState, useEffect } from 'react';
import LuxuryLoader from './UI/LuxuryLoader';

function Layout({ children }) {
    const location = useLocation(); 
    const isProfilePage = location.pathname === '/user';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const isAdminPage = location.pathname.startsWith('/admin');
    
    const knownRoutes = [
        '/', '/about', '/user', '/movies', '/movies/:id', 
        '/concerts', '/concerts/:id', '/standups', '/standups/:id', 
        '/checkout', '/checkout/success', '/register', '/login', 
        '/admin/*', '/terms', '/privacy', '/:eventType/:eventId/seats'
    ];

    const isKnownPage = knownRoutes.some(path => matchPath(path, location.pathname));
    const isNotFoundPage = !isKnownPage;
    

    const [showLoader, setShowLoader] = useState(() => {
        return !sessionStorage.getItem('hasShownLuxuryLoader');
    });

    const handleLoaderFinished = () => {
        setShowLoader(false);
    };

    return (
        <div className="app-layout">
            {showLoader && <LuxuryLoader onFinished={handleLoaderFinished} />}
            
            {!isProfilePage && !isAuthPage && !isAdminPage && <Header isTransparent={isNotFoundPage} />}

            <main className="main-content-area">
                <div style={{ 
                    visibility: showLoader ? 'hidden' : 'visible', 
                    opacity: showLoader ? 0 : 1, 
                    transform: showLoader ? 'scale(0.98)' : 'scale(1)',
                    transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}>
                    {children} 
                </div>
            </main>

            {!isAuthPage && !isAdminPage && !isProfilePage && !isNotFoundPage && <Footer />}
        </div>
    );
}

export default Layout;