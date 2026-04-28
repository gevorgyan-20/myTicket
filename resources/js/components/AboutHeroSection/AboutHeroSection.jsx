import React from "react";
import { useTranslation } from "react-i18next";
import { Mic } from "lucide-react";

export default function AboutHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full py-20 md:py-32 px-4 md:px-[108px] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/people-working-as-team-company.png')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#8e24aa]/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto text-center">
        <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
          <Mic className="w-10 h-10 md:w-12 md:h-12 text-[#E4AFF8]" />
          <h1 className="font-poppins text-3xl md:text-5xl font-bold text-white">
            {t('about.hero.title')}
          </h1>
        </div>
        
        <p className="font-mulish text-base md:text-lg leading-relaxed text-[#999999] max-w-3xl">
          {t('about.hero.description')}
        </p>
      </div>
    </section>
  );
}

