"use client";

import React from 'react';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "../UI/Button";
import { Card, CardContent } from "../UI/Card";
import CustomDatePicker from "../UI/CustomDatePicker";
import { Grid, Music, Mic, Film, MapPin, Calendar, Search, Bookmark, Ticket, PartyPopper } from 'lucide-react';

function ConcertSearchSection({ onSearch, activeCategory, onCategoryChange }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const tabItems = [
    {
      value: "all",
      label: t('concerts.categories.all'),
      icon: <Grid size={20} />,
    },
    {
      value: "concerts",
      label: t('search.tabs.concerts'),
      icon: <Music size={20} />,
    },
    {
      value: "standups",
      label: t('search.tabs.standups'),
      icon: <Mic size={20} />,
    },
    {
      value: "movies",
      label: t('search.tabs.movies'),
      icon: <Film size={20} />,
    },
  ];

  const features = [
    {
      icon: <Bookmark size={18} className="text-purple-400" />,
      label: t('search.features.anytime.title'),
    },
    { 
      icon: <Ticket size={18} className="text-purple-400" />,
      label: t('search.features.refundable.title'),
    },
    {
      icon: <PartyPopper size={18} className="text-purple-400" />,
      label: t('search.features.deals.title'),
    },
  ];

  const handleSearch = () => {
    onSearch?.({ query, location, date });
  };

  return (
    <section className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto relative py-12 md:py-24">
      <Card className="w-full bg-white/5 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">
        <CardContent className="flex flex-col items-center gap-6 p-4 md:p-8">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full pb-6 border-b border-white/5">
            {tabItems.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onCategoryChange?.(tab.value)}
                className={`flex gap-2 px-5 py-2.5 rounded-full items-center transition-all duration-300 ${
                  activeCategory === tab.value
                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <span className="opacity-80">{tab.icon}</span>
                <span className="font-semibold text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto] items-center w-full gap-4 md:gap-2">
            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
              <div className="p-2.5 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <Grid className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-poppins text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('search.fields.what.title')}</span>
                <input 
                  type="text"
                  placeholder={t('search.fields.what.subtitle')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-base w-full placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="hidden md:block h-12 w-px bg-white/10" />

            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
              <div className="p-2.5 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-poppins text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('search.fields.where.title')}</span>
                <input 
                  type="text"
                  placeholder={t('search.fields.where.subtitle')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-base w-full placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="hidden md:block h-12 w-px bg-white/10" />

            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
              <div className="p-2.5 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-poppins text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('search.fields.when.title')}</span>
                <CustomDatePicker 
                  value={date}
                  onChange={setDate}
                  placeholder={t('search.fields.when.subtitle')}
                />
              </div>
            </div>

            <Button 
              onClick={handleSearch}
              className="w-full md:w-16 h-14 md:h-16 flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-purple-600/20"
            >
              <Search className="w-6 h-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-2">
        {features.map((feature) => (
          <div
            key={feature.label}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors cursor-default"
          >
            <div className="p-1 bg-white/5 rounded-full">{feature.icon}</div>
            <span className="text-xs font-medium uppercase tracking-wider">
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ConcertSearchSection;