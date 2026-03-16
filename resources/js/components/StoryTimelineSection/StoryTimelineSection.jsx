import React from "react";
import { Search, Palette, Code, Rocket } from "lucide-react";

const timeline = [
  {
    icon: Search,
    title: "Research & Discovery",
    description: "Understanding the market needs and user expectations"
  },
  {
    icon: Palette,
    title: "Experience Design",
    description: "Creating intuitive and beautiful user interfaces"
  },
  {
    icon: Code,
    title: "Platform Development",
    description: "Building a robust and scalable ticketing platform"
  },
  {
    icon: Rocket,
    title: "Launch & Growth",
    description: "Launching the platform and continuously improving"
  }
];

export default function StoryTimelineSection() {
  return (
    <section className="relative w-full py-20 px-[108px]">
      <div className="max-w-7xl mx-auto">
        <h2 className="[font-family:'Inter',Helvetica] text-4xl font-bold text-white text-center mb-12">
          What is the story of <span className="text-[#E4AFF8]">MyTicket</span>?
        </h2>
        
        <div className="relative">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-[#303030] hidden lg:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {timeline.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1B1B1B] border-2 border-[#E4AFF8] flex items-center justify-center mb-4 relative z-10">
                    <IconComponent className="w-8 h-8 text-[#E4AFF8]" />
                  </div>
                  <h3 className="[font-family:'Inter',Helvetica] text-xl font-semibold text-white mb-2">
                    {index + 1}. {item.title}
                  </h3>
                  <p className="[font-family:'Inter',Helvetica] text-sm leading-6 text-[#999999]">
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

