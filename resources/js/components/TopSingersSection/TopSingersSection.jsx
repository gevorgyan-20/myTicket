import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "../UI/Card";
import "./TopSingersSection.css";

function TopSingersSection() {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  // Helper to duplicate items for infinite effect if needed, 
  // but here we already have enough items in the static arrays.

  const topSingersRow1 = [
    { name: "Beyonce", date: "15 April, London", image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop" },
    { name: "Adele", date: "5 May, New York", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop" },
    { name: "Drake", date: "20 June, Toronto", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop" },
    { name: "Taylor Swift", date: "10 July, Nashville", image: "https://images.unsplash.com/photo-1520872024861-399fa0c86321?w=400&h=400&fit=crop" },
    { name: "Ed Sheeran", date: "25 August, LA", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=400&fit=crop" },
    { name: "Billie Eilish", date: "30 Sept, Chicago", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop" },
  ];
  
  const topSingersRow2 = [
    { name: "The Weeknd", date: "20 Oct, Las Vegas", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop" },
    { name: "Dua Lipa", date: "12 Nov, Paris", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop" },
    { name: "Harry Styles", date: "1 Dec, London", image: "https://images.unsplash.com/photo-1514525253361-bee8a187499b?w=400&h=400&fit=crop" },
    { name: "SZA", date: "15 Jan, Miami", image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400&h=400&fit=crop" },
    { name: "Bad Bunny", date: "2 Feb, Mexico City", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop" },
    { name: "Doja Cat", date: "18 March, Tokyo", image: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?w=400&h=400&fit=crop" },
  ];

  // Double the rows for smooth looping
  const row1 = [...topSingersRow1, ...topSingersRow1, ...topSingersRow1];
  const row2 = [...topSingersRow2, ...topSingersRow2, ...topSingersRow2];

  return (
    <section className="flex flex-col w-full items-center gap-12 py-24 relative overflow-hidden">
      <header className="flex flex-col items-center gap-4 px-4">
        <h2 className="font-poppins text-4xl md:text-6xl font-black text-white text-center uppercase tracking-tighter">
            {t('singers.title')}
        </h2>
        <p className="text-center text-gray-500 max-w-lg text-sm md:text-base">
            {t('singers.subtitle')} <span className="text-purple-400 font-bold cursor-pointer hover:text-purple-300 transition-colors">{t('singers.seeMore')}</span>
        </p>
      </header>
    
      <div 
        className="relative w-full flex flex-col gap-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Row 1 */}
        <div className="flex w-full overflow-hidden">
            <div className={`flex gap-6 animate-marquee-right ${isHovered ? 'paused' : ''} py-2`}>
                {row1.map((singer, index) => (
                    <Card key={`row1-${index}`} className="flex-shrink-0 w-72 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-purple-500/30 transition-all group cursor-pointer rounded-2xl">
                        <CardContent className="flex items-center gap-4 p-2 pr-6">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                                <img className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={singer.name} src={singer.image} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">{singer.name}</span>
                                <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">{singer.date}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        {/* Row 2 */}
        <div className="flex w-full overflow-hidden">
            <div className={`flex gap-6 animate-marquee-left ${isHovered ? 'paused' : ''} py-2`}>
                {row2.map((singer, index) => (
                    <Card key={`row2-${index}`} className="flex-shrink-0 w-72 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-purple-500/30 transition-all group cursor-pointer rounded-2xl">
                        <CardContent className="flex items-center gap-4 p-2 pr-6">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                                <img className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={singer.name} src={singer.image} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">{singer.name}</span>
                                <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">{singer.date}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

export default TopSingersSection;