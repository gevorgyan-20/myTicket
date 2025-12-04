import Footer from './Footer';
import Header from './Header';
import React from 'react';

function Layout({ children }) {
    return (
        <div className="app-layout">
            
            <Header />

            <main className="main-content-area">
                <div className="container">
                    {children} 
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Layout;