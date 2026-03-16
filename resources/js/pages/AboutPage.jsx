import React from "react";
import AboutHeroSection from "../components/AboutHeroSection/AboutHeroSection";
import WhyChooseSection from "../components/WhyChooseSection/WhyChooseSection";
import ExperienceSection from "../components/ExperienceSection/ExperienceSection";
import StoryTimelineSection from "../components/StoryTimelineSection/StoryTimelineSection";
import ContactSection from "../components/ContactSection/ContactSection";

export default function AboutPage() {
  return (
    <div className="relative w-full bg-[#0D0D0D] min-h-screen">
      <AboutHeroSection />
      <WhyChooseSection />
      <ExperienceSection />
      <StoryTimelineSection />
      <ContactSection />
    </div>
  );
}
