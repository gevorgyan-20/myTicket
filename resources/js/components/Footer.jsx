import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Send,
  Mic
} from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Send, href: '#', label: 'Telegram' }
  ];

  return (
    <footer className="relative w-full bg-[#0D0D0D] py-12">
      <div className="flex flex-col items-center gap-8 mx-auto px-[111px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Mic className="w-8 h-8 text-[#E4AFF8]" />
          <span className="[font-family:'Inter',Helvetica] text-3xl font-bold text-[#E4AFF8] italic">
            MyTicket
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <Link 
            to="/" 
            className="[font-family:'Inter',Helvetica] text-base text-white hover:text-[#E4AFF8] transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/contact" 
            className="[font-family:'Inter',Helvetica] text-base text-white hover:text-[#E4AFF8] transition-colors"
          >
            Contact us
          </Link>
          <Link 
            to="/about" 
            className="[font-family:'Inter',Helvetica] text-base text-white hover:text-[#E4AFF8] transition-colors"
          >
            About us
          </Link>
          <Link 
            to="/privacy" 
            className="[font-family:'Inter',Helvetica] text-base text-white hover:text-[#E4AFF8] transition-colors"
          >
            Privacy Policy
          </Link>
        </nav>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-4">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-black border border-white flex items-center justify-center text-white hover:bg-[#E4AFF8] hover:border-[#E4AFF8] transition-colors"
              >
                <IconComponent className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        <div className="w-full h-px bg-[#333333]" />

        {/* Copyright */}
        <p className="[font-family:'Inter',Helvetica] text-sm text-white text-center">
          Copyright © MyTicket
        </p>
      </div>
    </footer>
  );
}
