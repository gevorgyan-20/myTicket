import { Link, useLocation } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus';
import { ChevronDownIcon, Menu, X } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Header({ isTransparent }) {
    const { t } = useTranslation();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigationItems = [
        { label: t('header.home'), to: "/", },
        { label: t('header.about'), to: "/about", },
        { label: t('header.movies'), to: "/movies", },
        { label: t('header.concerts'), to: "/concerts", },
        { label: t('header.standups'), to: "/standups", },
    ];

    const { isAuthenticated, role, isLoading, user } = useAuthStatus(); 
    
    const adminPath = role === 'admin' ? '/admin' : '';

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    if (isLoading) {
      return null; 
    }

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            isTransparent 
            ? "bg-transparent border-transparent" 
            : "bg-[#0c0c0cb3] backdrop-blur-md border-b border-white/5"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 md:h-20 items-center justify-between relative z-50">
            {isTransparent ? 
             <div></div> : (
              <Link to="/" className="flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
                <img src="/favicon.ico" alt="MyTicket Logo" className="size-8 md:size-[60px]" />
              </Link>
            )}
      
            <nav className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    location.pathname === item.to ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
      
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
      
              {isAuthenticated ? (
                <Link
                  to={role === 'admin' ? "/admin" : "/user"}
                  className="h-10 px-5 flex items-center justify-center rounded-full text-sm font-semibold border border-purple-500/50 text-white hover:bg-purple-500/10 transition-all"
                >
                  {role === 'admin' ? t('header.adminDashboard') : t('header.profile')}
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/register"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4"
                  >
                    {t('header.register')}
                  </Link>
                  <Link
                    to="/login"
                    className="h-10 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-lg shadow-purple-500/20"
                  >
                    {t('header.signIn')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              <LanguageSwitcher />
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-400 hover:text-white transition-all duration-300 z-50"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={28} className="text-white" /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <div className={`lg:hidden fixed inset-0 z-40 bg-[#0c0c0c] h-screen overflow-y-auto transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className={`flex flex-col h-full p-8 pt-24 transition-transform duration-500 ${isMenuOpen ? 'translate-y-0' : '-translate-y-8'}`}>
              <nav className="flex flex-col gap-8">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-3xl font-semibold tracking-tighter transition-all duration-300 ${
                      location.pathname === item.to ? "text-purple-500 translate-x-2" : "text-white hover:text-purple-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4 pb-8">
                {isAuthenticated ? (
                  <Link
                    to={role === 'admin' ? "/admin" : "/user"}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full h-16 flex items-center justify-center rounded-2xl bg-purple-600 text-white font-bold text-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
                  >
                    {role === 'admin' ? t('header.adminDashboard') : t('header.profile')}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full h-16 flex items-center justify-center rounded-2xl bg-purple-600 text-white font-bold text-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
                    >
                      {t('header.signIn')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full h-16 flex items-center justify-center rounded-2xl border border-white/10 text-white font-bold text-xl active:scale-95 transition-transform"
                    >
                      {t('header.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
      </header>
    );
}

export default Header;