import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] overflow-hidden text-white px-6">
            <SEO title={t('error.page_title') || "404 Not Found"} />
            <div className="relative z-10 text-center max-w-2xl mx-auto -mt-20">
                <h2 className="text-xl md:text-2xl font-poppins font-medium text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                    {t('error.title')}
                </h2>
                
                <Link 
                    to="/" 
                    className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/40 active:scale-95 mb-16"
                >
                    {t('error.button')}
                </Link>

                <div className="relative">
                    <h1 className="text-[120px] md:text-[240px] font-black leading-none tracking-tighter text-white select-none">
                        404
                    </h1>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-screen pointer-events-none select-none">
                <img 
                    src="/images/minimal-globe-technology-business-background.png" 
                    alt="" 
                    className="w-full h-full object-cover object-bottom opacity-90"
                />
            </div>

            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotFoundPage;
