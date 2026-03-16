import { Link, useLocation } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus';
import { ChevronDownIcon } from "lucide-react";
import React from 'react';

function Header() {
    const location = useLocation();

    const navigationItems = [
        { label: "Home", to: "/", },
        { label: "About", to: "/about", },
        { label: "Movies", to: "/movies", },
        { label: "Concerts", to: "/concerts", },
        { label: "Standups", to: "/standups", },
        { label: "Sports", to: "/sports", },
    ];

    const { isAuthenticated, role, isLoading, user } = useAuthStatus(); 
    
    const adminPath = role === 'admin' ? '/admin' : '';

    if (isLoading) {
        return null; 
    }

    return (
        <header className="flex w-full h-[77px] z-20 items-center justify-between px-[108px] py-4 absolute top-0 left-0 bg-transparent">
          <Link to="/" className="nav-logo">
              <img src="/favicon.ico" alt="MyTicket Logo" className="w-10 h-10" />
          </Link>
    
          <nav className="inline-flex items-center gap-10 relative flex-[0_0_auto]">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={`relative w-fit mt-[-1.00px] font-font-body-b8-18-rregular font-[number:var(--font-body-b8-18-rregular-font-weight)] text-[length:var(--font-body-b8-18-rregular-font-size)] tracking-[var(--font-body-b8-18-rregular-letter-spacing)] leading-[var(--font-body-b8-18-rregular-line-height)] [font-style:var(--font-body-b8-18-rregular-font-style)] ${
                  location.pathname === item.to ? "text-white" : "text-[#999999]"
                } hover:text-white transition-colors cursor-pointer`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
    
          <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
            <button className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] cursor-pointer">
              <div className="relative w-6 h-4 bg-[url(/group.png)] bg-[100%_100%]" />
    
              <div className="relative w-fit mt-[-1.00px] font-font-body-b9-18-medium font-[number:var(--font-body-b9-18-medium-font-weight)] text-white text-[length:var(--font-body-b9-18-medium-font-size)] tracking-[var(--font-body-b9-18-medium-letter-spacing)] leading-[var(--font-body-b9-18-medium-line-height)] whitespace-nowrap [font-style:var(--font-body-b9-18-medium-font-style)]">
                Eng
              </div>
    
              <ChevronDownIcon className="relative w-4 h-4 text-white" />
            </button>
    
            {isAuthenticated ? (
              <>
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    className="h-10 px-4 py-[5px] inline-flex items-center justify-center gap-2 rounded-lg font-font-button-button-b1-16-rregular text-white text-[length:var(--font-button-button-b1-16-rregular-font-size)] border border-solid border-[#c14fe6] hover:bg-app-primary/20 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/user"
                  className="h-10 px-4 py-[5px] inline-flex items-center justify-center gap-2 rounded-lg font-font-button-button-b1-16-rregular text-white text-[length:var(--font-button-button-b1-16-rregular-font-size)] border border-solid border-[#c14fe6] hover:bg-app-primary/20 transition-colors"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="h-10 px-4 py-[5px] inline-flex items-center justify-center gap-2 rounded-lg font-font-button-button-b1-16-rregular text-[length:var(--font-button-button-b1-16-rregular-font-size)] text-white/90 hover:text-white transition-colors"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="h-10 px-4 py-[5px] bg-app-primary border border-solid border-[#c14fe6] inline-flex items-center justify-center gap-2 rounded-lg overflow-hidden hover:bg-app-primary/90 transition-colors font-font-button-button-b1-16-rregular text-white text-[length:var(--font-button-button-b1-16-rregular-font-size)]"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
      </header>
    );
}

export default Header;