import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "../UI/Card";
import './FeaturesHighlightSection.css';

function FeaturesHighlightSection() {
  const { t } = useTranslation();

  const featuresList = [
    {
      id: 1,
      title: t('search.features.refundable.title'),
      description: t('search.features.refundable.description'),
      icon: "/images/icons/return-on-investment.svg",
      pattern: "gear"
    },
    {
      id: 2,
      title: t('search.features.deals.title'),
      description: t('search.features.deals.description'),
      icon: "/images/icons/hot-deal.svg",
      pattern: "percentage"
    },
    {
      id: 3,
      title: t('search.features.anytime.title'),
      description: t('search.features.anytime.description'),
      icon: "/images/icons/service-24-hour.svg",
      pattern: "gear"
    }
  ];

  return (
    <section className="relative w-full py-12 lg:py-20 overflow-hidden">
      <div className="relative flex flex-col lg:flex-row gap-6 mx-auto rounded-lg bg-transparent">
        {/* Dividers hidden on mobile */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-[5] pointer-events-none" />

        <div className="flex flex-col flex-1 lg:flex-[0_0_60%] gap-6 relative">
          <div className="hidden lg:block absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 z-[5] pointer-events-none" />
        
          <Card className="flex-1 bg-[#1B1B1B] rounded-2xl border-none relative overflow-hidden">
            <div className='bg-[#731d884f] absolute left-20 blur-2xl top-0 w-auto h-full aspect-square rounded-[100%]'></div>
            <div className='absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-[#1b1b1b80] to-[#0e041126] via-[#1b1b1b80] rounded-2xl'></div>

            <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute left-0 top-0 opacity-[36%]" />
            <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute right-0 top-0 opacity-[36%]" />
            
            <CardContent className="relative p-8 lg:p-12 lg:pl-[108px] h-full flex flex-col md:flex-row items-center gap-8 lg:gap-[115px] z-[2]">
              <div className="absolute inset-0 opacity-[0.05] z-[1] pointer-events-none pattern-gear" />
              
              <div className="w-32 lg:w-40 h-auto flex items-center justify-center relative z-[3] flex-shrink-0">
                <img 
                  src={featuresList[0].icon} 
                  alt={featuresList[0].title}
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(213,128,242,0.3)]"
                />
              </div>
              
              <div className="flex flex-col gap-2 relative z-[3] flex-1 text-center md:text-left">
                <h3 className="font-poppins font-semibold text-xl lg:text-2xl leading-8 text-[#ffffff] m-0">
                  {featuresList[0].title}
                </h3>
                <p className="font-normal text-sm leading-5 text-[#999999] m-0">
                  {featuresList[0].description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 bg-[#1B1B1B] rounded-2xl border-none relative overflow-hidden">
            <div className='bg-[#731d884f] absolute left-20 blur-2xl top-0 w-auto h-full aspect-square rounded-[100%]'></div>
            <div className='absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-[#1b1b1b80] to-[#0e041126] via-[#1b1b1b80] rounded-2xl'></div>

            <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute left-0 top-0 opacity-[36%]" />
            <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute right-0 top-0 opacity-[36%]" />
            
            <CardContent className="relative p-8 lg:p-12 lg:pl-[108px] h-full flex flex-col md:flex-row items-center gap-8 lg:gap-[115px] z-[2]">
              <div className="absolute inset-0 opacity-[0.05] z-[1] pointer-events-none pattern-percentage" />
              
              <div className="w-32 lg:w-40 h-auto flex items-center justify-center relative z-[3] flex-shrink-0">
                <img 
                  src={featuresList[1].icon} 
                  alt={featuresList[1].title}
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(213,128,242,0.3)]"
                />
              </div>
              
              <div className="flex flex-col gap-2 relative z-[3] flex-1 text-center md:text-left">
                <h3 className="font-poppins font-semibold text-xl lg:text-2xl leading-8 text-[#ffffff] m-0">
                  {featuresList[1].title}
                </h3>
                <p className="font-normal text-sm leading-5 text-[#999999] m-0">
                  {featuresList[1].description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 lg:flex-[0_0_38%]">
          <Card className="h-full min-h-[300px] lg:min-h-[400px] border-none bg-[#1B1B1B] rounded-2xl relative overflow-hidden">
            <div className='bg-[#731d884f] absolute left-20 blur-2xl top-0 w-auto h-full aspect-square rounded-[100%]'></div>
            <div className='absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-[#1b1b1b80] to-[#0e041126] via-[#1b1b1b80] rounded-2xl'></div>

            <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute left-0 top-0 opacity-[36%]" />
            <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute right-0 top-0 opacity-[36%]" />
            
            <CardContent className="relative p-8 lg:p-12 lg:pl-[108px] h-full flex flex-col justify-between items-center gap-6 z-[2]">
              <div className="absolute inset-0 opacity-[0.05] z-[1] pointer-events-none pattern-gear" />
              
              <div className="flex flex-col gap-2 relative z-[3]">
                <h3 className="font-poppins font-semibold text-xl lg:text-2xl text-center leading-8 text-[#ffffff] m-0">
                  {featuresList[2].title}
                </h3>
                <p className="font-normal text-sm text-center leading-5 text-[#999999] m-0">
                  {featuresList[2].description}
                </p>
              </div>
              
              <div className="w-48 lg:w-60 h-auto flex items-center justify-center relative z-[3] flex-shrink-0">
                <img 
                  src={featuresList[2].icon} 
                  alt={featuresList[2].title}
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(213,128,242,0.3)]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default FeaturesHighlightSection;
