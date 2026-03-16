import React from "react";

export default function ExperienceSection() {
  return (
    <section className="relative w-full py-20 px-[108px]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:row-span-1">
            <div className="w-[434px] h-[434px] rounded-2xl overflow-hidden">
              <img 
                src="/images/icons/about-1.png" 
                alt="Concert Hall - La La Land"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:row-span-1 flex flex-col justify-center">
            <h2 className="[font-family:'Inter',Helvetica] text-3xl font-bold text-white mb-6">
              More Than Just a Ticket<br />
              The <span className="text-[#E4AFF8]">MyTicket</span> Experience
            </h2>
            <ul className="space-y-4">
              <li className="[font-family:'Inter',Helvetica] text-base leading-7 text-white">
                1. Every ticket is the start of a memory, not just entry to an event.
              </li>
              <li className="[font-family:'Inter',Helvetica] text-base leading-7 text-white">
                2. Whether it's a concert, sports match, or theater show - your full experience matters.
              </li>
            </ul>
          </div>

          <div className="lg:row-span-1 flex flex-col justify-center">
            <ul className="space-y-4">
              <li className="[font-family:'Inter',Helvetica] text-base leading-7 text-white">
                1. MyTicket ensures a smooth and enjoyable journey from booking to the final moment.
              </li>
              <li className="[font-family:'Inter',Helvetica] text-base leading-7 text-white">
                2. We connect you to world-class events with just a few clicks.
              </li>
              <li className="[font-family:'Inter',Helvetica] text-base leading-7 text-white">
                3. Our platform is designed for ease, speed, and excitement.
              </li>
              <li className="[font-family:'Inter',Helvetica] text-base leading-7 text-white">
                4. With MyTicket, every step feels like part of the show.
              </li>
            </ul>
          </div>

          <div className="flex justify-end items-center lg:row-span-1">
            <div className="w-[434px] h-[434px] rounded-2xl overflow-hidden">
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
