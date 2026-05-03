import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "../UI/Button";
import { Card, CardContent } from "../UI/Card";
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Timer, ChevronRight } from "lucide-react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function ConcertListSection({ concerts = [], activeGenre = 'all', onGenreChange }) {
    const { t, i18n } = useTranslation();
    const container = useRef();

    useGSAP(() => {
        gsap.from(".event-card", {
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
        });
    }, { scope: container, dependencies: [activeGenre] });

    // ... (keep the same helper functions: genres, availableGenres, displayedConcerts, formatDate, formatDateRange, formatPriceRange)

    const genres = [
        { id: 'all', label: t('concerts.categories.all') },
        { id: 'pop', label: t('concerts.categories.pop') },
        { id: 'rock', label: t('concerts.categories.rock') },
        { id: 'jazz', label: t('concerts.categories.jazz') },
        { id: 'hiphop', label: t('concerts.categories.hiphop') },
        { id: 'alternative', label: t('concerts.categories.alternative') },
        { id: 'classical', label: t('concerts.categories.classical') },
        { id: 'opera', label: t('concerts.categories.opera') },
        { id: 'country', label: t('concerts.categories.country') },
    ];

    const availableGenres = React.useMemo(() => {
        const set = new Set(concerts.map(c => (c.genre || c.category || '').toLowerCase()));
        return set;
    }, [concerts]);

    const displayedConcerts = React.useMemo(() => {
        const filtered = activeGenre === 'all' 
            ? concerts 
            : concerts.filter(c => (c.genre || c.category || '').toLowerCase() === activeGenre.toLowerCase());
        return filtered.slice(0, 4);
    }, [concerts, activeGenre]);

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        const locale = i18n.language === 'hy' ? 'hy-AM' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';
        return d.toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
        });
    };

    const formatDateRange = (start, end) => {
        if (!start) return t('common.comingSoon');
        if (!end || start === end) return formatDate(start);
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const formatPriceRange = (min, max) => {
        if (min == null && max == null) return t('common.tba');
        if (min === max) return `${min}֏`;
        return `${min} - ${max}֏`;
    };

    return (
        <section ref={container} className="flex flex-col gap-8 w-full py-12 md:py-24 border-t border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {t('concerts.title')}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base max-w-xl">
                        {t('concerts.subtitle')}
                    </p>
                </div>
        
                <Link to="/concerts">
                    <Button
                      variant="outline"
                      className="group border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 text-white rounded-full px-6 py-2 transition-all flex items-center gap-2"
                    >
                      {t('common.seeAll')}
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                {genres.map((genre) => {
                    const isAvailable = genre.id === 'all' || availableGenres.has(genre.id.toLowerCase());
                    return (
                        <button
                            key={genre.id}
                            disabled={!isAvailable}
                            onClick={() => onGenreChange?.(genre.id)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                                activeGenre === genre.id
                                    ? "border-purple-500/50 text-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                                    : isAvailable 
                                        ? "border-white/5 text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white"
                                        : "border-transparent text-gray-700 bg-transparent cursor-not-allowed opacity-30"
                            }`}
                        >
                            {genre.label}
                        </button>
                    );
                })}
            </div>
        
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full">
                {displayedConcerts.map((concert) => (
                    <article
                        key={concert.id}
                        className="event-card group relative"
                    >
                        <Link to={`/concerts/${concert.id}`} className="block">
                            <div className="relative aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                                <img 
                                    src={concert.poster_url || "/images/defaults/concert.png"} 
                                    alt={concert.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                
                                {concert.hasCountdown && (
                                    <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex items-center justify-between px-2 md:px-3 py-1 bg-red-500/90 backdrop-blur-md rounded-full text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest z-10 shadow-lg">
                                        <div className="flex items-center gap-1">
                                            <Timer size={12} className="md:w-[14px] md:h-[14px] animate-pulse" />
                                            <span className="hidden xs:inline">{t('concerts.timeToEnd')}</span>
                                        </div>
                                        <span>{concert.countdown}</span>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 z-10">
                                    <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                        {concert.performer || concert.title || concert.name}
                                    </h3>
                                    
                                    <div className="flex flex-col gap-1 text-[10px] md:text-xs text-gray-300">
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <Calendar size={12} className="md:w-[14px] md:h-[14px] text-purple-400" />
                                            <span className="line-clamp-1">{formatDateRange(concert.first_show_date, concert.last_show_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <MapPin size={12} className="md:w-[14px] md:h-[14px] text-purple-400" />
                                            <span className="line-clamp-1">{concert.location}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-xs md:text-lg font-bold text-white">
                                            {formatPriceRange(concert.min_price, concert.max_price)}
                                        </span>
                                        <div className="hidden sm:block px-3 py-1 bg-white/10 group-hover:bg-purple-600 rounded-lg text-[10px] font-bold text-white transition-colors">
                                            {t('common.getTicket')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ConcertListSection;