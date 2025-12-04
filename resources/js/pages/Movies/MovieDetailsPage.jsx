import React from 'react';

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieById } from '../../api/MoviesService'; // Շտկված ներմուծում
import useAuthStatus from '../../hooks/useAuthStatus'; // Շտկված ներմուծում

export default function MovieDetailsPage() {
  const { role, isAuthenticated, isLoading: authLoading } = useAuthStatus();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const adminPath = role === 'admin' ? '/admin' : ''; 
  
  const handleBookTicket = () => {
     if (!isAuthenticated && !authLoading) {
        navigate("/login", { 
            state: { backgroundLocation: location }, 
            replace: true 
        });
        return;
    }
    navigate(`/movies/${id}/seats`);
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await getMovieById(id);
        setMovie(res.data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
            setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) {
      return <div className="loading-center">Loading...</div>;
  }

  return (
    <div className = "event-container">
      <div className="event-details">
        <div className="event-pic">
          <img
            src={movie?.poster_url}
            alt={movie?.title}
            className="event-poster"
          />
        </div>
        <div className="event-body" key = {movie?.id}>
          <div className="desc">
              <h2>
                  <i className="myticket-icon"></i>
                  <span className="title-h2-m main-font-semibold">{movie?.title}</span>
              </h2>
              <p className="event-desc"><span className="main-font-semibold">Description:</span> {movie?.description}</p>
              <p className="event-desc"><span className="main-font-semibold">Genre:</span> {movie?.genre}</p>
              <p className="event-desc"><span className="main-font-semibold">Duration:</span> {movie?.duration} min.</p>
              <p className="event-desc"><span className="main-font-semibold">Location and Time:</span> Moscow Cinema at 21:00 2025-10-{Math.floor(Math.random() * 30) + 1}</p>
              <p className="fs-14"><span className="main-font-semibold">Price:</span> 2500 AMD</p>
          </div>
          <div className = "buttons">
              <button className="btn btn-blue" onClick={handleBookTicket}>
                <i className="ticket-icon"></i>
                <span>Book Ticket</span>
              </button>
              <button onClick={() => navigate(`${adminPath}/movies`)} className="btn btn-gray">
                <i className="left-arrow"></i>
                <span>Go Back</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}