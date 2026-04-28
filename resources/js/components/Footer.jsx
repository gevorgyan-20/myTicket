import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Send, href: '#', label: 'Telegram' }
  ];

  return (
    <footer className="relative w-full bg-[#0D0D0D] py-12 md:py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8 md:gap-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <Mic className="w-8 h-8 text-purple-400" />
          <span className="text-2xl md:text-3xl font-bold text-white italic tracking-tight">
            MyTicket
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {[
            { label: t('footer.home'), to: "/" },
            { label: t('footer.contact'), to: "/contact" },
            { label: t('footer.about'), to: "/about" },
            { label: t('footer.privacy'), to: "/privacy" }
          ].map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className="text-sm md:text-base text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all duration-300"
              >
                <IconComponent className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        <div className="w-full h-px bg-white/5" />

        {/* Copyright */}
        <p className="text-xs md:text-sm text-gray-500 text-center">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
