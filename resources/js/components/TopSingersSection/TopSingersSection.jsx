import React, { useState } from 'react';
import { Card, CardContent } from "../UI/Card";
import "./TopSingersSection.css";

const topSingersRow1 = [
  { name: "Beyonce", date: "15 April,London", image: "/image-292-35.png" },
  { name: "Adele", date: "5 May,New York", image: "/image-292-15.png" },
  { name: "Drake", date: "20 June,Toronto", image: "/image-292-16.png" },
  {
    name: "Taylor Swift",
    date: "10 July,Nashville",
    image: "/image-292-17.png",
  },
  {
    name: "Ed Sheeran",
    date: "25 August,Los Angeles",
    image: "/image-292-18.png",
  },
  {
    name: "Billie Eilish",
    date: "30 September,Chicago",
    image: "/image-292-19.png",
  },
  {
    name: "Billie Eilish",
    date: "30 September,Chicago",
    image: "/image-292-20.png",
  },
  { name: "Beyonce", date: "15 April,London", image: "/image-292-35.png" },
  { name: "Adele", date: "5 May,New York", image: "/image-292-15.png" },
  { name: "Drake", date: "20 June,Toronto", image: "/image-292-16.png" },
  {
    name: "Taylor Swift",
    date: "10 July,Nashville",
    image: "/image-292-17.png",
  },
  {
    name: "Ed Sheeran",
    date: "25 August,Los Angeles",
    image: "/image-292-18.png",
  },
  {
    name: "Billie Eilish",
    date: "30 September,Chicago",
    image: "/image-292-19.png",
  },
  {
    name: "Billie Eilish",
    date: "30 September,Chicago",
    image: "/image-292-20.png",
  },
  { name: "Beyonce", date: "15 April,London", image: "/image-292-35.png" },
  { name: "Adele", date: "5 May,New York", image: "/image-292-15.png" },
  { name: "Drake", date: "20 June,Toronto", image: "/image-292-16.png" },
  {
    name: "Taylor Swift",
    date: "10 July,Nashville",
    image: "/image-292-17.png",
  },
  {
    name: "Ed Sheeran",
    date: "25 August,Los Angeles",
    image: "/image-292-18.png",
  },
  {
    name: "Billie Eilish",
    date: "30 September,Chicago",
    image: "/image-292-19.png",
  },
  {
    name: "Billie Eilish",
    date: "30 September,Chicago",
    image: "/image-292-20.png",
  },
];

const topSingersRow2 = [
  { name: "Beyonce", date: "15 April,London", image: "/image-292-35.png" },
  { name: "Adele", date: "5 May,New York", image: "/image-292-36.png" },
  { name: "Drake", date: "30 June,Toronto", image: "/image-292-37.png" },
  {
    name: "Taylor Swift",
    date: "13 July,Nashville",
    image: "/image-292-38.png",
  },
  { name: "Ed Sheeran", date: "25 August,Dublin", image: "/image-292-39.png" },
  {
    name: "Billie Eilish",
    date: "10 September,Los Angeles",
    image: "/image-292-40.png",
  },
  {
    name: "The Weeknd",
    date: "20 October,Las Vegas",
    image: "/image-292-41.png",
  },
  { name: "Beyonce", date: "15 April,London", image: "/image-292-35.png" },
  { name: "Adele", date: "5 May,New York", image: "/image-292-36.png" },
  { name: "Drake", date: "30 June,Toronto", image: "/image-292-37.png" },
  {
    name: "Taylor Swift",
    date: "13 July,Nashville",
    image: "/image-292-38.png",
  },
  { name: "Ed Sheeran", date: "25 August,Dublin", image: "/image-292-39.png" },
  {
    name: "Billie Eilish",
    date: "10 September,Los Angeles",
    image: "/image-292-40.png",
  },
  {
    name: "The Weeknd",
    date: "20 October,Las Vegas",
    image: "/image-292-41.png",
  },
  { name: "Beyonce", date: "15 April,London", image: "/image-292-35.png" },
  { name: "Adele", date: "5 May,New York", image: "/image-292-36.png" },
  { name: "Drake", date: "30 June,Toronto", image: "/image-292-37.png" },
  {
    name: "Taylor Swift",
    date: "13 July,Nashville",
    image: "/image-292-38.png",
  },
  { name: "Ed Sheeran", date: "25 August,Dublin", image: "/image-292-39.png" },
  {
    name: "Billie Eilish",
    date: "10 September,Los Angeles",
    image: "/image-292-40.png",
  },
  {
    name: "The Weeknd",
    date: "20 October,Las Vegas",
    image: "/image-292-41.png",
  },
];

function TopSingersSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="flex flex-col w-full items-center gap-8 pb-[98px] relative">
      <header className="flex flex-col max-w-[461px] items-center gap-2">
        <h2 className="[font-family:'Inter', Helvetica] font-medium leading-[34px] text-[#ffffff] text-[28px] text-center">
          Top singers
        </h2>

        <p className="text-center leading-[19px]">
          <span className="text-[#999999]">
            Find the singers you're looking for quickly.
          </span>
          <span className="text-[#E4AFF8]"> You can see more.</span>
        </p>
      </header>
    
      <div className="relative w-full h-[181px]">
        <div
            className="w-screen flex flex-col gap-4 absolute top-0 -left-[108px] overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
            className={`flex gap-4 animate-marquee-right ${isHovered ? 'paused' : ''}`}
            style={{ width: "max-content" }}
            >
            {topSingersRow1.map((singer, index) => (
                <Card
                key={`row1-${index}`}
                className="flex-shrink-0 w-[280px] bg-[#191919] rounded-xl border border-solid border-[#303030] hover:border-[#404040] transition-colors cursor-pointer"
                >
                <CardContent className="flex items-center gap-3 p-1 pr-4">
                    <img
                    className="w-[75px] h-[75px] rounded-[10px] object-cover"
                    alt={singer.name}
                    src={singer.image}
                    />
                    <div className="flex flex-col gap-1">
                    <div className="[font-family:'Inter',Helvetica] font-medium text-[#ffffff] text-lg tracking-[0] leading-[normal]">
                        {singer.name}
                    </div>
                    <div className="[font-family:'Inter',Helvetica] font-normal text-[#b3b3b3] text-sm tracking-[0] leading-[normal]">
                        {singer.date}
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>

            <div
            className={`flex gap-4 animate-marquee-left ${isHovered ? 'paused' : ''}`}
            style={{ width: "max-content" }}
            >
            {topSingersRow2.map((singer, index) => (
                <Card
                key={`row2-${index}`}
                className="flex-shrink-0 w-[280px] bg-[#191919] rounded-xl border border-solid border-[#303030] hover:border-[#404040] transition-colors cursor-pointer"
                >
                <CardContent className="flex items-center gap-3 p-1 pr-4">
                    <img
                    className="w-[75px] h-[75px] rounded-[10px] object-cover"
                    alt={singer.name}
                    src={singer.image}
                    />
                    <div className="flex flex-col gap-1">
                    <div className="[font-family:'Inter',Helvetica] font-medium text-[#ffffff] text-lg tracking-[0] leading-[normal]">
                        {singer.name}
                    </div>
                    <div className="[font-family:'Inter',Helvetica] font-normal text-[#b3b3b3] text-sm tracking-[0] leading-[normal]">
                        {singer.date}
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default TopSingersSection;