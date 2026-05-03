import React from "react";
import AboutHeroSection from "../components/AboutHeroSection/AboutHeroSection";
import WhyChooseSection from "../components/WhyChooseSection/WhyChooseSection";
import ExperienceSection from "../components/ExperienceSection/ExperienceSection";
import StoryTimelineSection from "../components/StoryTimelineSection/StoryTimelineSection";
import ContactSection from "../components/ContactSection/ContactSection";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full bg-[#0D0D0D] min-h-screen">
      <SEO title={t('header.about')} />
      <AboutHeroSection />
      <WhyChooseSection />
      <ExperienceSection />
      <StoryTimelineSection />
      <ContactSection />
    </div>
  );
}
