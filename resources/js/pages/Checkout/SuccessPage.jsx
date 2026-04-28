import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import FeedbackModal from '../../components/FeedbackModal/FeedbackModal';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || t('common.yourEmail');
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFeedbackModalOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white font-mulish flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />

            <div className="max-w-xl w-full relative z-10">
                <div className="bg-[#161616]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 lg:p-12 text-center shadow-2xl relative overflow-hidden">
                    {/* Inner Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/10 rounded-full mb-8 relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                        <CheckCircle className="w-12 h-12 text-emerald-500 relative z-10 animate-bounce-slow" />
                    </div>
                    
                    <h1 className="font-poppins text-4xl lg:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                        {t('checkout.success.title')}
                    </h1>
                    <p className="text-xl lg:text-2xl text-gray-400 font-medium mb-8">
                        {t('checkout.success.subtitle')}
                    </p>
                    
                    <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/5">
                        <p className="text-sm text-gray-500 mb-2 uppercase tracking-widest">{t('checkout.success.sentTo')}</p>
                        <p className="text-lg font-bold text-purple-400 font-poppins">{email}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-bold transition-all active:scale-[0.98]"
                            onClick={() => navigate('/')}
                        >
                            {t('checkout.success.backHome')}
                        </button>
                        <button 
                            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
                            onClick={() => navigate('/user')}
                        >
                            {t('checkout.success.goProfile')}
                        </button>
                    </div>
                </div>
            </div>

            <FeedbackModal 
                isOpen={isFeedbackModalOpen} 
                onClose={() => setIsFeedbackModalOpen(false)} 
            />

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}} />
        </div>
    );
};

export default SuccessPage;
