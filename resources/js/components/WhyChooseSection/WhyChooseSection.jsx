import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../UI/Card";
import './WhyChooseSection.css';

export default function WhyChooseSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: "/images/icons/Your-Ticket-is-on-the-Way.svg",
      title: t('whyChoose.f1.title'),
      description: t('whyChoose.f1.description'),
      iconPosition: "right",
      colSpan: "md:col-span-2"
    },
    {
      icon: "/images/icons/online-ticket-purchasing.svg",
      title: t('whyChoose.f2.title'),
      description: t('whyChoose.f2.description'),
      iconPosition: "top",
      colSpan: "md:col-span-1"
    },
    {
      icon: "/images/icons/customer-support.svg",
      title: t('whyChoose.f3.title'),
      description: t('whyChoose.f3.description'),
      iconPosition: "bottom",
      colSpan: "md:col-span-1"
    },
    {
      icon: "/images/icons/event-discovering.svg",
      title: t('whyChoose.f4.title'),
      description: t('whyChoose.f4.description'),
      iconPosition: "top-right",
      colSpan: "md:col-span-2"
    }
  ];

  return (
    <section className="relative w-full py-12 md:py-20 px-4 md:px-[108px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-2 mb-12">
          <h2 className="font-poppins text-2xl md:text-4xl font-bold text-white text-center">
            {t('whyChoose.title')}<span className="text-[#E4AFF8]">MyTicket</span>?
          </h2>
          <p className="font-mulish text-sm md:text-base text-gray-300 text-center">
            {t('whyChoose.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const isIconRight = feature.iconPosition === "right";
            const isIconTop = feature.iconPosition === "top";
            const isIconBottom = feature.iconPosition === "bottom";
            
            return (
              <Card 
                key={index}
                className={`bg-[#1B1B1B] rounded-2xl border-none relative overflow-hidden min-h-[250px] md:min-h-[280px] ${feature.colSpan}`}
              >
                <div className='bg-[#731d884f] absolute left-20 blur-2xl top-0 w-auto h-full aspect-square rounded-[100%]'></div>

                <div className='absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-[#1b1b1b80] to-[#0e041126] via-[#1b1b1b80] rounded-2xl'></div>
                <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute left-0 top-0 opacity-[36%]" />
                <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute right-0 top-0 opacity-[36%]" />

                <CardContent className="relative p-6 md:p-8 flex z-[2] h-auto md:h-[323px] overflow-hidden" >
                  <div className="absolute inset-0 opacity-[0.05] z-[1] pointer-events-none pattern-gear" />
                  
                  {isIconTop ? (
                    <div className="relative z-[3] w-full flex flex-col gap-4">
                      <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] flex items-center justify-center mx-auto">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="font-poppins text-xl md:text-2xl font-semibold text-white mb-2 text-center">
                        {feature.title}
                      </h3>
                      <p className="font-mulish text-sm md:text-lg leading-relaxed text-[#999999] text-center">
                        {feature.description}
                      </p>
                    </div>
                  ) : isIconBottom ? (
                    <div className="relative z-[3] w-full flex flex-col gap-4">
                      <h3 className="font-poppins text-xl md:text-2xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="font-mulish text-sm md:text-lg leading-relaxed text-[#999999]">
                        {feature.description}
                      </p>
                      <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mx-auto mt-2">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  ) : isIconRight ? (
                    <div className="relative z-[3] w-full flex flex-col md:flex-row items-start gap-6">
                      <div className="flex-1 flex flex-col h-full justify-center gap-3">
                        <h3 className="font-poppins text-xl md:text-2xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="font-mulish text-sm md:text-lg leading-relaxed text-[#999999]">
                          {feature.description}
                        </p>
                      </div>
                      <div className="relative flex-1 w-full md:w-[250px] h-[200px] md:h-[510px] flex items-center justify-center flex-shrink-0">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="absolute md:top-12 -right-4 md:-right-[110px] w-auto h-full md:w-full md:h-full md:-rotate-[28deg] object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-[3] w-full flex flex-row items-start gap-4 md:gap-[31px]">
                      <div className="flex-1 flex flex-col h-full justify-center gap-3">
                        <h3 className="font-poppins text-xl md:text-2xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="font-mulish text-sm md:text-lg leading-relaxed text-[#999999]">
                          {feature.description}
                        </p>
                      </div>
                      <div className="w-20 h-20 md:w-[120px] md:h-[120px] flex items-center justify-center flex-shrink-0">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
