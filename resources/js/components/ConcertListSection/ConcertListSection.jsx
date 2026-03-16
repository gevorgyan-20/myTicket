import React from 'react';
import { Button } from "../UI/Button";
import { Card, CardContent } from "../UI/Card";

function ConcertListSection({ concerts = [] }) {
    const filterCategories = [
        { label: "All", active: true },
        { label: "Pop", active: false },
        { label: "Rock", active: false },
        { label: "Jazz & Blues", active: false },
        { label: "Hip-Hop & Rap", active: false },
        { label: "Alternative", active: false },
        { label: "Classical", active: false },
        { label: "Opera", active: false },
        { label: "Country", active: false },
      ];

    return (
            <section className="flex flex-col items-start gap-8 w-full pb-[100px]">
              <div className="flex flex-col w-full items-start gap-6">
                <header className="h-[72px] justify-between px-0 py-2 border-b [border-bottom-style:solid] border-[#1e1e1e] flex items-center w-full">
                  <h2 className="font-font-heather-h4-28-semi-bold font-[number:var(--font-heather-h4-28-semi-bold-font-weight)] text-white text-[length:var(--font-heather-h4-28-semi-bold-font-size)] tracking-[var(--font-heather-h4-28-semi-bold-letter-spacing)] leading-[var(--font-heather-h4-28-semi-bold-line-height)] [font-style:var(--font-heather-h4-28-semi-bold-font-style)]">
                    Concert
                  </h2>
        
                  <Button
                    variant="ghost"
                    className="h-8 px-4 py-[3px] rounded-lg font-font-button-button-b1-16-rregular font-[number:var(--font-button-button-b1-16-rregular-font-weight)] text-white text-[length:var(--font-button-button-b1-16-rregular-font-size)] tracking-[var(--font-button-button-b1-16-rregular-letter-spacing)] leading-[var(--font-button-button-b1-16-rregular-line-height)] [font-style:var(--font-button-button-b1-16-rregular-font-style)]"
                  >
                    See all
                  </Button>
                </header>
        
                <nav className="flex items-center gap-2 w-full flex-wrap">
                  {filterCategories.map((category, index) => (
                    <Button
                      key={index}
                      className={
                        category.active
                          ? "px-4 py-2 rounded-[18px] border border-solid border-[#A62FCA] text-[#D580F2] bg-gradient-to-b from-[#c14fe6]/30 to-transparent hover:bg-gradient-to-b"
                          : "px-4 py-2 rounded-[18px] border border-solid border-[#303030] text-[#B3B3B3] bg-[#242424] hover:bg-[#242424]"
                      }
                    >
                      {category.label}
                    </Button>
                  ))}
                </nav>
              </div>
        
              <div className="flex items-center gap-6 w-full">
                {concerts.map((concert) => (
                  <article
                    key={concert.id}
                    className="flex flex-col w-72 items-center justify-center"
                  >
                    <div
                      className="w-full h-[336px] rounded-[20px] bg-cover bg-[50%_50%]"
                      style={{ backgroundImage: `url(${concert.poster_url})` }}
                    />
        
                    <div className="h-[159px] justify-end gap-2 px-2 py-0 mt-[-79px] flex flex-col items-start w-full">
                      <Card className="flex flex-col items-start justify-end w-full bg-nuetral-800 rounded-2xl overflow-hidden border border-solid border-[#303030] backdrop-blur-[32px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(32px)_brightness(100%)] shadow-bg-blur">
                        <CardContent className="p-0 w-full">
                          {concert.hasCountdown && (
                            <div className="flex items-center justify-between px-4 py-2 w-full bg-error-500 rounded-[16px_16px_0px_0px] overflow-hidden">
                              <div className="inline-flex items-center gap-0.5">
                                <img
                                  className="w-4 h-4"
                                  alt="Outline time"
                                  src="/outline---time---stopwatch.svg"
                                />
                                <span className="font-font-body-b2-12-rregular font-[number:var(--font-body-b2-12-rregular-font-weight)] text-white text-[length:var(--font-body-b2-12-rregular-font-size)] tracking-[var(--font-body-b2-12-rregular-letter-spacing)] leading-[var(--font-body-b2-12-rregular-line-height)] [font-style:var(--font-body-b2-12-rregular-font-style)]">
                                  Time to end
                                </span>
                              </div>
                              <span className="font-font-body-b2-12-rregular font-[number:var(--font-body-b2-12-rregular-font-weight)] text-white text-[length:var(--font-body-b2-12-rregular-font-size)] tracking-[var(--font-body-b2-12-rregular-letter-spacing)] leading-[var(--font-body-b2-12-rregular-line-height)] [font-style:var(--font-body-b2-12-rregular-font-style)]">
                                {concert.countdown}
                              </span>
                            </div>
                          )}
        
                          <div className="gap-4 p-4 flex flex-col items-start w-full">
                            <h3 className="w-60 font-font-body-b13-20-bold font-[number:var(--font-body-b13-20-bold-font-weight)] text-white text-[length:var(--font-body-b13-20-bold-font-size)] tracking-[var(--font-body-b13-20-bold-letter-spacing)] leading-[var(--font-body-b13-20-bold-line-height)] [font-style:var(--font-body-b13-20-bold-font-style)]">
                              {concert.name}
                            </h3>
        
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-start gap-1">
                                <img
                                  className="w-4 h-4"
                                  alt="Outline time"
                                  src="/outline---time---calendar.svg"
                                />
                                <span className="font-font-body-b3-14-rregular font-[number:var(--font-body-b3-14-rregular-font-weight)] text-nuetral-200 text-[length:var(--font-body-b3-14-rregular-font-size)] tracking-[var(--font-body-b3-14-rregular-letter-spacing)] leading-[var(--font-body-b3-14-rregular-line-height)] [font-style:var(--font-body-b3-14-rregular-font-style)]">
                                  {concert.date}
                                </span>
                              </div>
        
                              <div className="inline-flex items-center justify-end gap-1">
                                <img
                                  className="w-4 h-4"
                                  alt="Outline map location"
                                  src="/outline---map---location---map-point.svg"
                                />
                                <span className="font-font-body-b3-14-rregular font-[number:var(--font-body-b3-14-rregular-font-weight)] text-nuetral-200 text-[length:var(--font-body-b3-14-rregular-font-size)] tracking-[var(--font-body-b3-14-rregular-letter-spacing)] leading-[var(--font-body-b3-14-rregular-line-height)] [font-style:var(--font-body-b3-14-rregular-font-style)]">
                                  {concert.location}
                                </span>
                              </div>
                            </div>
        
                            <div className="inline-flex items-center gap-2">
                              <span className="font-font-body-b10-18-bold font-[number:var(--font-body-b10-18-bold-font-weight)] text-tint-400 text-[length:var(--font-body-b10-18-bold-font-size)] tracking-[var(--font-body-b10-18-bold-letter-spacing)] leading-[var(--font-body-b10-18-bold-line-height)] [font-style:var(--font-body-b10-18-bold-font-style)]">
                                from
                              </span>
                              <span className="font-font-body-b10-18-bold font-[number:var(--font-body-b10-18-bold-font-weight)] text-tint-400 text-[length:var(--font-body-b10-18-bold-font-size)] tracking-[var(--font-body-b10-18-bold-letter-spacing)] leading-[var(--font-body-b10-18-bold-line-height)] [font-style:var(--font-body-b10-18-bold-font-style)]">
                                {concert.price}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </article>
                ))}
              </div>
            </section>
    );
}

export default ConcertListSection;