import React from "react";
import { useEffect, useState } from 'react';

import { getMovies } from "../api/MoviesService"; 
import { getConcerts } from "../api/ConcertsService"; 
import { getStandups } from "../api/StandupsService"; 

import useAuthStatus from '../hooks/useAuthStatus'; 

import ConcertSearchSection from "../components/ConcertSearchSection/ConcertSearchSection";
import ConcertListSection from "../components/ConcertListSection/ConcertListSection";
import MovieListSection from "../components/MovieListSection/MovieListSection";
import StandupListSection from "../components/StandupListSection/StandupListSection";
import TopSingersSection from "../components/TopSingersSection/TopSingersSection";
import HeroTextSection from "../components/HeroTextSection/HeroTextSection";
import UserReviewsSection from "../components/UserReviewsSection/UserReviewsSection";
import FeaturesHighlightSection from "../components/FeaturesHighlightSection/FeaturesHighlightSection";
import FrequentlyAskedQuestionsSection from "../components/FrequentlyAskedQuestionsSection/FrequentlyAskedQuestionsSection";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const {role} = useAuthStatus(); 
  const adminPath = role === 'admin' ? '/admin' : ''; 

  const [movies, setMovies] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [standups, setStandups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchFilters, setSearchFilters] = useState({ query: '', location: '', date: '' });
  
  const [concertGenre, setConcertGenre] = useState('all');
  const [standupGenre, setStandupGenre] = useState('all');
  const [movieGenre, setMovieGenre] = useState('all');

  const { t } = useTranslation();

  useGSAP(() => {
    if (isLoading) return;

    const sections = gsap.utils.toArray('.section-reveal');
    const isMobile = window.innerWidth < 768;

    sections.forEach((section) => {
      gsap.from(section, {
        y: isMobile ? 30 : 50,
        opacity: 0,
        duration: isMobile ? 0.8 : 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: isMobile ? "top 92%" : "top 85%",
          toggleActions: "play none none none"
        }
      });
    });
  }, { dependencies: [isLoading] });

  const filteredEvents = React.useMemo(() => {
    const searchFilterFn = (item) => {
        const matchesQuery = !searchFilters.query || 
            (item.title || item.performer || item.name || item.comedian || "").toLowerCase().includes(searchFilters.query.toLowerCase());
        const matchesLoc = !searchFilters.location || 
            (item.location || "").toLowerCase().includes(searchFilters.location.toLowerCase());
        
        let matchesDate = true;
        if (searchFilters.date) {
            const searchDate = new Date(searchFilters.date).setHours(0,0,0,0);
            const start = item.first_show_date ? new Date(item.first_show_date).setHours(0,0,0,0) : null;
            const end = item.last_show_date ? new Date(item.last_show_date).setHours(0,0,0,0) : null;
            
            if (start && end) {
                matchesDate = searchDate >= start && searchDate <= end;
            } else if (start) {
                matchesDate = searchDate === start;
            }
        }

        return matchesQuery && matchesLoc && matchesDate;
    };

    // Filter by search criteria but NOT by genre (sections will handle genre filtering)
    const searchFiltered = {
        concerts: (activeCategory === 'all' || activeCategory === 'concerts') ? concerts.filter(searchFilterFn) : [],
        standups: (activeCategory === 'all' || activeCategory === 'standups') ? standups.filter(searchFilterFn) : [],
        movies: (activeCategory === 'all' || activeCategory === 'movies') ? movies.filter(searchFilterFn) : []
    };

    return searchFiltered;
  }, [movies, concerts, standups, activeCategory, searchFilters]);
 
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const [moviesRes, concertsRes, standupsRes] = await Promise.all([
          getMovies(),
          getConcerts(),
          getStandups(),
        ]);

            setMovies(moviesRes.data);
            setConcerts(concertsRes.data);
            setStandups(standupsRes.data);

        } catch (err) {
            console.error("Error fetching homepage events:", err);
        } finally {
            setIsLoading(false);
        }
      };
  
      fetchAllEvents();
    }, []); 

  if (isLoading) {
      return (
          <div className="loading-center">
              <div className="loading-spinner"></div>
              <p className="loading-text">{t('hero.loading')}</p>
          </div>
      );
  }

  return (
    <div className="relative w-full bg-[#0c0c0c] overflow-hidden min-h-screen">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-[120vh] pointer-events-none opacity-50">
        <img
          className="w-full h-full object-cover mix-blend-screen animate-pulse"
          alt="Atmospheric background"
          src="/images/group-people-near-stage-concert_250224-175-2.svg"
        />
      </div>
      
      {/* Modern Gradient Blobs */}
      <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px] animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute top-1/2 left-[-100px] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000 pointer-events-none" />

      {/* Main Content Sections */}
      <div className="relative z-10 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="section-reveal">
          <HeroTextSection />
        </div>

        <div className="section-reveal">
          <ConcertSearchSection 
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onSearch={setSearchFilters}
          />
        </div>
        
        {filteredEvents.concerts.length > 0 && (
          <div className="section-reveal">
            <ConcertListSection 
                concerts={filteredEvents.concerts} 
                activeGenre={concertGenre}
                onGenreChange={setConcertGenre}
            />
          </div>
        )}
        
        {filteredEvents.standups.length > 0 && (
          <div className="section-reveal">
            <StandupListSection 
                standups={filteredEvents.standups} 
                activeGenre={standupGenre}
                onGenreChange={setStandupGenre}
            />
          </div>
        )}
        
        {filteredEvents.movies.length > 0 && (
          <div className="section-reveal">
            <MovieListSection 
                movies={filteredEvents.movies} 
                activeGenre={movieGenre}
                onGenreChange={setMovieGenre}
            />
          </div>
        )}

        {filteredEvents.concerts.length === 0 && filteredEvents.standups.length === 0 && filteredEvents.movies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-xl font-semibold">No results found for your search.</p>
                <button 
                    onClick={() => { setSearchFilters({query:'', location:'', date:''}); setActiveCategory('all'); }}
                    className="mt-4 text-[#C14FE6] hover:underline"
                >
                    Clear all filters
                </button>
            </div>
        )}

        <div className="section-reveal">
          <TopSingersSection />
        </div>

        <div className="section-reveal">
          <FeaturesHighlightSection />
        </div>

        <div className="section-reveal">
          <UserReviewsSection />
        </div>

        <div className="section-reveal">
          <FrequentlyAskedQuestionsSection />
        </div>
      </div>

      <style jsx>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
}