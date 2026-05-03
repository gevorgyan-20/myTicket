import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const PrivacyPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white py-24 px-[104px] max-lg:px-6">
            <SEO title={t('privacy.title')} />
            <div className="mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {t('privacy.title')}
                </h1>
                <p className="text-gray-500 mb-12 font-medium">{t('privacy.lastUpdated')}</p>
                
                <div className="space-y-12">
                    <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
                        {t('privacy.intro')}
                    </p>

                    <div className="space-y-16">
                        {['collection', 'usage', 'protection'].map((key) => (
                            <section key={key} className="space-y-6">
                                <h2 className="text-3xl font-bold text-white font-poppins">
                                    {t(`privacy.sections.${key}.title`)}
                                </h2>
                                <p className="text-gray-400 leading-relaxed text-xl max-w-3xl">
                                    {t(`privacy.sections.${key}.content`)}
                                </p>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
