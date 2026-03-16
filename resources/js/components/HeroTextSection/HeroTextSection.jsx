import React from 'react';

function HeroTextSection() {
    return (
      <section className="flex flex-col w-full max-w-[745px] mx-auto items-center justify-center gap-8 px-4 pt-[216px]">
        <h1 className="w-full [font-family:'Inter',Helvetica] font-normal text-white text-7xl text-center tracking-[0] leading-[72px]">
          <span className="font-bold text-white">What </span>
          <span className="font-bold text-[#d580f2]">Concert</span>
          <span className="font-bold text-white"> would you like to go to?</span>
        </h1>
  
        <p className="w-full font-font-body-b11-20-rregular font-[number:var(--font-body-b11-20-rregular-font-weight)] text-white text-[length:var(--font-body-b11-20-rregular-font-size)] text-center tracking-[var(--font-body-b11-20-rregular-letter-spacing)] leading-[var(--font-body-b11-20-rregular-line-height)] [font-style:var(--font-body-b11-20-rregular-font-style)]">
          More than 100 concerts in different countries are now available to you.
        </p>
      </section>
    );
}
  
export default HeroTextSection;