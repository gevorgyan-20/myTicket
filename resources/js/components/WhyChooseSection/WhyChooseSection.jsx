import React from "react";
import { Card, CardContent } from "../UI/Card";
import './WhyChooseSection.css';

const features = [
  {
    icon: "/images/icons/Your-Ticket-is-on-the-Way.svg",
    title: "Your Ticket is on the Way!",
    description: "We're sending your ticket straight to your email. Just confirm your name and email below, and you're all set for an unforgettable experience! 🚀",
    iconPosition: "right",
    colSpan: "md:col-span-2"
  },
  {
    icon: "/images/icons/online-ticket-purchasing.svg",
    title: "Online Ticket Purchasing",
    description: "Allows users to browse events, select seats, and buy tickets instantly via secure payment methods 🎟️",
    iconPosition: "top",
    colSpan: "md:col-span-1"
  },
  {
    icon: "/images/icons/customer-support.svg",
    title: "Customer Support",
    description: "24/7 live chat, email, or phone support for booking issues. 🌟",
    iconPosition: "bottom",
    colSpan: "md:col-span-1"
  },
  {
    icon: "/images/icons/event-discovering.svg",
    title: "Event Discovery",
    description: "Personalized suggestions based on user preferences, location, and past bookings. Filters for categories, venues, and price ranges. The goal is to detect meaningful occurrences (events) in analysis, or automated responses. 💰",
    iconPosition: "top-right",
    colSpan: "md:col-span-2"
  }
];

export default function WhyChooseSection() {
  return (
    <section className="relative w-full py-20 px-[108px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-2 mb-12">
          <h2 className="[font-family:'Inter',Helvetica] text-4xl font-bold text-white text-center">
            Why Choose <span className="text-[#E4AFF8]">MyTicket</span>?
          </h2>
          <p className="[font-family:'Inter',Helvetica] text-base text-white text-center">
            Experience excellence with a team that truly cares
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
                className={`bg-[#1B1B1B] rounded-2xl border-none relative overflow-hidden min-h-[280px] ${feature.colSpan}`}
              >
                <div className='bg-[#731d884f] absolute left-20 blur-2xl top-0 w-auto h-full aspect-square rounded-[100%]'></div>

                <div className='absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-[#1b1b1b80] to-[#0e041126] via-[#1b1b1b80] rounded-2xl'></div>
                <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute left-0 top-0 opacity-[36%]" />
                <img src="/images/dollars-vector.svg" alt="dollars-vector" className="w-1/2 h-full object-cover absolute right-0 top-0 opacity-[36%]" />

                <CardContent className="relative p-8 flex z-[2] h-[323px] overflow-hidden" >
                  <div className="absolute inset-0 opacity-[0.05] z-[1] pointer-events-none pattern-gear" />
                  
                  {isIconTop ? (
                    <div className="relative z-[3] w-full flex flex-col gap-4">
                      <div className="w-[120px] h-[120px] flex items-center justify-center mx-auto">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="[font-family:'Inter',Helvetica] text-2xl font-semibold text-white mb-2 text-center">
                        {feature.title}
                      </h3>
                      <p className="[font-family:'Inter',Helvetica] text-lg leading-6 text-[#999999] text-center">
                        {feature.description}
                      </p>
                    </div>
                  ) : isIconBottom ? (
                    <div className="relative z-[3] w-full flex flex-col gap-4">
                      <h3 className="[font-family:'Inter',Helvetica] text-2xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="[font-family:'Inter',Helvetica] text-lg leading-6 text-[#999999]">
                        {feature.description}
                      </p>
                      <div className="w-32 h-32 flex items-center justify-center mx-auto mt-2">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  ) : isIconRight ? (
                    <div className="relative z-[3] w-full flex flex-row items-start gap-6">
                      <div className="flex-1 flex flex-col h-full justify-center gap-3">
                        <h3 className="[font-family:'Inter',Helvetica] text-2xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="[font-family:'Inter',Helvetica] text-lg leading-6 text-[#999999]">
                          {feature.description}
                        </p>
                      </div>
                      <div className="relative flex-1 w-[250px] h-[510px] flex items-center justify-center flex-shrink-0">
                        <img 
                          src={feature.icon} 
                          alt={feature.title}
                          className="absolute top-12 -right-[110px] w-full h-full -rotate-[28deg] object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-[3] w-full flex flex-row items-start gap-[31px]">
                      <div className="w-[calc(100%-151px)] flex flex-col h-full justify-center gap-3">
                        <h3 className="[font-family:'Inter',Helvetica] text-2xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="[font-family:'Inter',Helvetica] text-lg leading-6 text-[#999999]">
                          {feature.description}
                        </p>
                      </div>
                      <div className="size-[120px] flex items-center justify-center flex-shrink-0">
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
