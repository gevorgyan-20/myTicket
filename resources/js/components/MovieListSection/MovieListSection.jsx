import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "../UI/Button";
import { Link } from 'react-router-dom';
import { Calendar, Film, Timer, ChevronRight } from "lucide-react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function MovieListSection({ movies = [], activeGenre = 'all', onGenreChange }) {
    const { t, i18n } = useTranslation();
    const container = useRef();

    useGSAP(() => {
        gsap.from(".movie-card", {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
        });
    }, { scope: container, dependencies: [activeGenre] });

    const genres = [
        { id: 'all', label: t('movies.categories.all') },
        { id: 'scifi', label: t('movies.categories.scifi') },
        { id: 'action', label: t('movies.categories.action') },
        { id: 'adventure', label: t('movies.categories.adventure') },
        { id: 'comedy', label: t('movies.categories.comedy') },
        { id: 'drama', label: t('movies.categories.drama') },
        { id: 'horror', label: t('movies.categories.horror') },
        { id: 'thriller', label: t('movies.categories.thriller') },
        { id: 'fantasy', label: t('movies.categories.fantasy') },
        { id: 'family', label: t('movies.categories.family') },
        { id: 'animation', label: t('movies.categories.animation') },
    ];

    const availableGenres = React.useMemo(() => {
        const set = new Set(movies.map(m => (m.genre || m.category || '').toLowerCase()));
        return set;
    }, [movies]);

    const displayedMovies = React.useMemo(() => {
        const filtered = activeGenre === 'all' 
            ? movies 
            : movies.filter(m => (m.genre || m.category || '').toLowerCase() === activeGenre.toLowerCase());
        return filtered.slice(0, 4);
    }, [movies, activeGenre]);

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
                        {t('movies.title')}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base max-w-xl">
                        {t('movies.subtitle')}
                    </p>
                </div>
        
                <Link to="/movies">
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
                                    ? "border-purple-500/50 text-purple-400 bg-purple-500/10"
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
                {displayedMovies.map((movie) => (
                    <article
                        key={movie.id}
                        className="movie-card group relative"
                    >
                        <Link to={`/movies/${movie.id}`} className="block">
                            <div className="relative aspect-[2/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                                <img 
                                    src={movie.poster_url || "/images/defaults/movie.png"} 
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                                
                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-10">
                                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                                        <div className="px-1.5 md:px-2 py-0.5 bg-purple-600 rounded-md text-[8px] md:text-[10px] font-bold text-white uppercase">
                                            {movie.genre || 'Movie'}
                                        </div>
                                    </div>
                                    <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                                        {movie.title}
                                    </h3>
                                    
                                    <div className="flex flex-col gap-1 md:gap-2 text-[10px] md:text-xs text-gray-300">
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <Calendar size={12} className="md:w-[14px] md:h-[14px] text-purple-400" />
                                            <span className="line-clamp-1">{formatDateRange(movie.first_show_date, movie.last_show_date)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-xs md:text-lg font-bold text-white">
                                            {formatPriceRange(movie.min_price, movie.max_price)}
                                        </span>
                                        <div className="p-1.5 md:p-2 bg-white/10 group-hover:bg-purple-600 rounded-full text-white transition-colors">
                                            <ChevronRight size={14} className="md:w-[16px] md:h-[16px]" />
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

export default MovieListSection;