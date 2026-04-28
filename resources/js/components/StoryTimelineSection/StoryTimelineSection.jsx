import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, Palette, Code, Rocket } from "lucide-react";

export default function StoryTimelineSection() {
  const { t } = useTranslation();

  const timeline = useMemo(() => [
    {
      icon: Search,
      title: t('story.items.i1.title'),
      description: t('story.items.i1.description')
    },
    {
      icon: Palette,
      title: t('story.items.i2.title'),
      description: t('story.items.i2.description')
    },
    {
      icon: Code,
      title: t('story.items.i3.title'),
      description: t('story.items.i3.description')
    },
    {
      icon: Rocket,
      title: t('story.items.i4.title'),
      description: t('story.items.i4.description')
    }
  ], [t]);

  return (
    <section className="relative w-full py-12 md:py-20 px-4 md:px-[108px]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-poppins text-2xl md:text-4xl font-bold text-white text-center mb-12">
          {t('story.title')}
        </h2>
        
        <div className="relative">
          {/* Horizontal line for desktop */}
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-[#303030] hidden lg:block" />
          
          {/* Vertical line for mobile */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%-80px)] bg-[#303030] block lg:hidden" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
            {timeline.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1B1B1B] border-2 border-[#E4AFF8] flex items-center justify-center mb-4 relative z-10 shadow-[0_0_20px_rgba(228,175,248,0.2)]">
                    <IconComponent className="w-8 h-8 text-[#E4AFF8]" />
                  </div>
                  <h3 className="font-poppins text-lg md:text-xl font-semibold text-white mb-2">
                    {index + 1}. {item.title}
                  </h3>
                  <p className="font-mulish text-sm leading-relaxed text-[#999999] max-w-[250px]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

