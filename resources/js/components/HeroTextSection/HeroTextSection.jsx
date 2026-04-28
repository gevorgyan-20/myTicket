import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function HeroTextSection() {
    const { t } = useTranslation();
    const container = useRef();

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from(".hero-title span", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out"
        })
        .from(".hero-subtitle", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.5");
    }, { scope: container });

    return (
      <section ref={container} className="flex flex-col w-full max-w-4xl mx-auto items-center justify-center gap-6 px-4 pt-24 md:pt-32 lg:pt-48">
        <h1 className="hero-title w-full font-poppins font-bold text-white text-5xl md:text-7xl lg:text-8xl text-center tracking-tight leading-tight">
          <span className="inline-block">{t('hero.titlePart1')}&nbsp;</span>
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {t('hero.titlePart2')}
          </span>
          <span className="inline-block">&nbsp;{t('hero.titlePart3')}</span>
        </h1>
  
        <p className="hero-subtitle w-full max-w-2xl mx-auto text-gray-400 text-lg md:text-xl text-center leading-relaxed">
          {t('hero.subtitle')}
        </p>
      </section>
    );
}
  
export default HeroTextSection;