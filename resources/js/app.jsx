import './bootstrap';
import './i18n';
import './echo';
import 'flag-icons/css/flag-icons.min.css';
import '../css/app.css';
import '../css/app.scss';

import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './routes/AppRoutes'; 
import Layout from './components/Layout'; 
import ScrollToTop from './components/ScrollToTop';

const container = document.getElementById('root'); 

if (container) {
    const root = createRoot(container);

    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <ScrollToTop />
                <Layout>
                    <AppRoutes />
                </Layout>
            </BrowserRouter>
        </React.StrictMode>
    );
}