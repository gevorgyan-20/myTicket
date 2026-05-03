import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'hy', label: 'Հայ', flag: 'am' },
    { code: 'ru', label: 'Рус', flag: 'ru' },
    { code: 'en', label: 'Eng', flag: 'gb' },
  ];

  const currentLanguage = languages.find(lang => lang.code === (i18n.language?.split('-')[0] || 'hy')) || languages[0];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] cursor-pointer group"
      >
        <span className={`fi fi-${currentLanguage.flag} rounded-sm`}></span>
        <div className="relative w-fit font-font-body-b9-18-medium font-[number:var(--font-body-b9-18-medium-font-weight)] text-white text-[length:var(--font-body-b9-18-medium-font-size)] tracking-[var(--font-body-b9-18-medium-letter-spacing)] leading-[var(--font-body-b9-18-medium-line-height)] whitespace-nowrap [font-style:var(--font-body-b9-18-medium-font-style)] group-hover:text-app-primary transition-colors">
          {currentLanguage.label}
        </div>
        <ChevronDown className={`relative w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden backdrop-blur-md">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-white/80 transition-colors hover:bg-white/5 ${
                currentLanguage.code === lang.code ? 'bg-white/5' : ''
              }`}
            >
              <span className={`fi fi-${lang.flag} rounded-sm`}></span>
              <span className="font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
