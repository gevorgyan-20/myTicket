import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import React from 'react';

function Layout({ children }) {
    const location = useLocation(); 
    const isProfilePage = location.pathname === '/user';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="app-layout">
            
            {!isProfilePage && !isAuthPage && <Header />}

            <main className="main-content-area">
                <div>
                    {children} 
                </div>
            </main>

            {!isAuthPage && <Footer />}
        </div>
    );
}

export default Layout;