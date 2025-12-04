import React from 'react';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovies } from '../../api/MoviesService';
import useAuthStatus from '../../hooks/useAuthStatus';

export default function MoviesPage() {
    const { role } = useAuthStatus();

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const adminPath = role === 'admin' ? '/admin' : ''; 

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await getMovies();
        setMovies(res.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return <div className="loading-center">Loading...</div>;
  }

return (
    <div className="event-container">
      <h3>Movies</h3>
         <div className="event-block">
             {movies.map((movie) => (
             <Link to={`${adminPath}/movies/${movie.id}`} key={movie.id} className="event-card">
                 <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="event-poster"/>
                 <div className="event-body">
                     <h2 className="event-title main-font-semibold">{movie.title}</h2>
                     <p className="event-desc main-font-semibold">Genre: {movie.genre}</p>
                 </div>
             </Link>
             ))}
         </div>
    </div>
);
}

