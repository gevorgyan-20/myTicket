import React from "react";
import { Mic } from "lucide-react";

export default function AboutHeroSection() {
  return (
    <section className="relative w-full py-32 px-[108px] overflow-hidden">
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
        <div className="flex items-center gap-3 mb-4">
          <Mic className="w-12 h-12 text-[#E4AFF8]" />
          <h1 className="[font-family:'Inter',Helvetica] text-5xl font-bold text-white">
            About us
          </h1>
        </div>
        
        <p className="[font-family:'Inter',Helvetica] text-lg leading-7 text-[#999999] max-w-3xl">
          MyTicket is your premier destination for discovering and booking tickets to the most exciting events. 
          From concerts and sports events to festivals and shows, we bring you closer to unforgettable experiences. 
          Our platform is designed with you in mind, offering seamless ticket purchasing, secure transactions, 
          and exceptional customer support. Join thousands of event enthusiasts who trust MyTicket for their 
          entertainment needs.
        </p>
      </div>
    </section>
  );
}

