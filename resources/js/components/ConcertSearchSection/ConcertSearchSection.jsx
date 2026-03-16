"use client";

import React from 'react';
import { useState } from "react";
import { Button } from "../UI/Button";
import { Card, CardContent } from "../UI/Card";

const tabItems = [
  {
    value: "concerts",
    label: "Concerts",
    icon: "/images/icons/note.svg",
  },
  {
    value: "shows",
    label: "Shows",
    icon: "/images/icons/masks.svg",
  },
  {
    value: "sports",
    label: "Sports",
    icon: "/images/icons/dumbbell.svg",
  },
  {
    value: "festivals",
    label: "Festivals",
    icon: "/images/icons/ferris-wheel.svg",
  },
];

const searchFields = [
  {
    icon: "/images/icons/Widget.svg",
    title: "what",
    subtitle: "Event Type",
  },
  {
    icon: "/images/icons/map-point.svg",
    title: "where",
    subtitle: "Location",
  },
  {
    icon: "/images/icons/Calendar.svg",
    title: "when",
    subtitle: "Date",
  },
];

const features = [
  {
    icon: "/images/icons/BookMark.svg",
    label: "Book Anytime",
  },
  { 
    icon: "/images/icons/Ticket.svg",
    label: "Refundable Tickets",
  },
  {
    icon: "/images/icons/Confetti.svg",
    label: "Smart Deals",
  },
];

function ConcertSearchSection() {
  const [activeTab, setActiveTab] = useState("concerts");

  return (
    <section className="flex flex-col items-center gap-4 w-full max-w-[1016px] mx-auto relative pt-[95px] pb-[100px]">
      <Card className="w-full bg-[#1b1b1bcc] rounded-2xl border border-[#303030] backdrop-blur-[32px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(32px)_brightness(100%)] shadow-bg-blur">
        <CardContent className="flex flex-col items-center gap-4 px-10 py-6">
          <div className="flex items-start justify-between w-full pb-4 border-b border-[#232323]">
            {tabItems.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`inline-flex gap-2 px-6 py-3 rounded-3xl items-center transition-colors ${
                  activeTab === tab.value
                    ? "bg-[#232323]"
                    : "hover:bg-[#1a1a1a]"
                }`}
              >
                <img className="w-5 h-5" alt={tab.label} src={tab.icon} />
                <span className="font-font-body-b8-18-rregular font-[number:var(--font-body-b8-18-rregular-font-weight)] text-white text-[length:var(--font-body-b8-18-rregular-font-size)] tracking-[var(--font-body-b8-18-rregular-letter-spacing)] leading-[var(--font-body-b8-18-rregular-line-height)] [font-style:var(--font-body-b8-18-rregular-font-style)]">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between w-full px-4 py-3 rounded-2xl">
            {searchFields.map((field, index) => (
              <div key={field.title} className="flex items-center gap-3">
                {index > 0 && <div className="h-12 w-px bg-[#232323] mr-3" />}
                <button className="inline-flex items-center gap-3 min-w-[200px] text-left hover:opacity-80 transition-opacity">
                  <img className="w-8 h-8" alt={field.title} src={field.icon} />
                  <div className="inline-flex flex-col items-start justify-center">
                    <div className="font-font-body-b11-20-rregular font-[number:var(--font-body-b11-20-rregular-font-weight)] text-white text-[length:var(--font-body-b11-20-rregular-font-size)] tracking-[var(--font-body-b11-20-rregular-letter-spacing)] leading-[var(--font-body-b11-20-rregular-line-height)] whitespace-nowrap [font-style:var(--font-body-b11-20-rregular-font-style)]">
                      {field.title}
                    </div>
                    <div className="font-font-body-b3-14-rregular font-[number:var(--font-body-b3-14-rregular-font-weight)] text-[#999999] text-[length:var(--font-body-b3-14-rregular-font-size)] tracking-[var(--font-body-b3-14-rregular-letter-spacing)] leading-[var(--font-body-b3-14-rregular-line-height)] [font-style:var(--font-body-b3-14-rregular-font-style)]">
                      {field.subtitle}
                    </div>
                  </div>
                </button>
              </div>
            ))}

            <Button className="size-12 gap-2 p-3 bg-[#C14FE6] rounded-lg border border-[#c14fe6] hover:bg-[#a642cc] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z" fill="white"/>
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="inline-flex items-center gap-8">
        {features.map((feature) => (
          <div
            key={feature.label}
            className="inline-flex items-center justify-center gap-2"
          >
            <img className="w-6 h-6" alt={feature.label} src={feature.icon} />
            <span className="font-font-body-b5-16-rregular font-[number:var(--font-body-b5-16-rregular-font-weight)] text-[#999999] text-[length:var(--font-body-b5-16-rregular-font-size)] tracking-[var(--font-body-b5-16-rregular-letter-spacing)] leading-[var(--font-body-b5-16-rregular-line-height)] whitespace-nowrap [font-style:var(--font-body-b5-16-rregular-font-style)]">
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ConcertSearchSection;