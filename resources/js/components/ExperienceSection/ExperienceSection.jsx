import React from "react";
import { useTranslation } from "react-i18next";

export default function ExperienceSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full py-12 md:py-20 px-4 md:px-[108px]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div className="order-1 lg:order-none flex justify-center lg:justify-start">
            <div className="w-full max-w-[434px] aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/icons/about-1.png" 
                alt="Concert Hall - La La Land"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="order-2 lg:order-none flex flex-col justify-center">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-white mb-6">
              {t('experience.title')}<br className="hidden md:block" />
              {" "}{t('experience.subtitle')}
            </h2>
            <ul className="space-y-4">
              <li className="font-mulish text-sm md:text-base leading-relaxed text-gray-300">
                {t('experience.items.i1')}
              </li>
              <li className="font-mulish text-sm md:text-base leading-relaxed text-gray-300">
                {t('experience.items.i2')}
              </li>
            </ul>
          </div>

          <div className="order-4 lg:order-none flex flex-col justify-center">
            <ul className="space-y-4">
              <li className="font-mulish text-sm md:text-base leading-relaxed text-gray-300">
                {t('experience.items.i3')}
              </li>
              <li className="font-mulish text-sm md:text-base leading-relaxed text-gray-300">
                {t('experience.items.i4')}
              </li>
              <li className="font-mulish text-sm md:text-base leading-relaxed text-gray-300">
                {t('experience.items.i5')}
              </li>
              <li className="font-mulish text-sm md:text-base leading-relaxed text-gray-300">
                {t('experience.items.i6')}
              </li>
            </ul>
          </div>

          <div className="order-3 lg:order-none flex justify-center lg:justify-end">
            <div className="w-full max-w-[434px] aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/icons/about-2.png" 
                alt="Crowd at Event"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
