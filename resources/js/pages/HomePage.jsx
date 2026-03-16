import React from "react";
import { useEffect, useState } from 'react';

import { getMovies } from "../api/MoviesService"; 
import { getConcerts } from "../api/ConcertsService"; 
import { getStandups } from "../api/StandupsService"; 

import useAuthStatus from '../hooks/useAuthStatus'; 

import ConcertSearchSection from "../components/ConcertSearchSection/ConcertSearchSection";
import ConcertListSection from "../components/ConcertListSection/ConcertListSection";
import MovieListSection from "../components/MovieListSection/MovieListSection";
import TopSingersSection from "../components/TopSingersSection/TopSingersSection";
import HeroTextSection from "../components/HeroTextSection/HeroTextSection";
import UserReviewsSection from "../components/UserReviewsSection/UserReviewsSection";
import FeaturesHighlightSection from "../components/FeaturesHighlightSection/FeaturesHighlightSection";
import FrequentlyAskedQuestionsSection from "../components/FrequentlyAskedQuestionsSection/FrequentlyAskedQuestionsSection";
// import { SportListSection } from "./sections/SportListSection";

export default function HomePage() {
  const {role} = useAuthStatus(); 
  const adminPath = role === 'admin' ? '/admin' : ''; 

  const [movies, setMovies] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [standups, setStandups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 
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
              <p className="loading-text">Loading amazing events...</p>
          </div>
      );
  }

  return (
    <div className="relative px-[108px] w-full bg-[#0c0c0c] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[840px] pointer-events-none">
        <img
          className="w-full h-full object-cover"
          alt="Group people near"
          src="/images/group-people-near-stage-concert_250224-175-2.svg"
        />
      </div>
      <div className="absolute top-[-165px] left-[calc(50%_-_191px)] w-[382px] h-[382px] bg-[#8e24aa] rounded-full blur-[237px] pointer-events-none" />
      <div className="absolute top-[77px] left-[calc(50%_-_191px)] w-[382px] h-[382px] bg-[#8e24aa] rounded-full blur-[237px] pointer-events-none" />

      {/* Main Content Sections */}
      <div className="relative z-10 flex flex-col w-full">
        <HeroTextSection />
        <ConcertSearchSection />
        <ConcertListSection concerts={concerts} />
        <MovieListSection movies={movies} />
        <TopSingersSection />
        <FeaturesHighlightSection />
        <UserReviewsSection />
        <FrequentlyAskedQuestionsSection />
        {/* <SportListSection /> */}
      </div>
    </div>
  );
}