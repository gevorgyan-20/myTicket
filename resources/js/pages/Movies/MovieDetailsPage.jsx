import React from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieById } from '../../api/MoviesService';
import useAuthStatus from '../../hooks/useAuthStatus';

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
      navigate("/login");
      return;
    }
    navigate(`/movies/${id}/seats`);
  };

  const handleGoBack = () => {
    navigate(adminPath ? `${adminPath}/movies` : '/movies');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title,
        url: window.location.href,
        text: movie?.description
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const locationDisplay = movie?.location || 'Moscow Cinema';
  const timeDisplay = movie?.start_time || movie?.show_time || '21:00';

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
    <div className="concert-detail-page">
      <section className="concert-detail-hero">
        <div
          className="concert-detail-hero-bg"
          style={{ backgroundImage: movie?.poster_url ? `url(${movie.poster_url})` : undefined }}
        />
        <div className="concert-detail-hero-overlay" />
        <div className="container concert-detail-hero-inner">
          <div className="concert-detail-hero-left">
            <h1 className="concert-detail-artist-name">{movie?.title}</h1>
            <p className="concert-detail-tagline">
              {movie?.description || `${movie?.title} – ${movie?.genre || 'Film'}`}
            </p>
          </div>
          <div className="concert-detail-hero-right">
            <div className="concert-detail-artist-circle">
              <img src={movie?.poster_url} alt={movie?.title} />
            </div>
            <div className="concert-detail-location-card">
              <span className="concert-detail-location-icon" />
              <span className="concert-detail-location-text">{locationDisplay}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="concert-detail-events">
        <div className="container">
          <div className="concert-detail-events-header">
            <h2 className="concert-detail-events-title">All days and times</h2>
            <div className="concert-detail-location-filter">
              <span>{locationDisplay}</span>
              <span className="concert-detail-dropdown-arrow" />
            </div>
          </div>

          <ul className="concert-detail-event-list">
            <li className="concert-detail-event-card">
              <div className="concert-detail-event-info">
                <div className="concert-detail-event-venue">
                  <span className="concert-detail-event-pin" />
                  <span>{locationDisplay}</span>
                </div>
                <div className="concert-detail-event-datetime">
                  {timeDisplay}
                  {movie?.duration != null && ` · ${movie.duration} min`}
                </div>
              </div>
              <div className="concert-detail-event-actions">
                <button
                  type="button"
                  className="concert-detail-btn-icon"
                  onClick={handleShare}
                  title="Share"
                  aria-label="Share"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="concert-detail-btn-icon"
                  title="Add to calendar"
                  aria-label="Add to calendar"
                >
                  <img src="/images/icons/Calendar.svg" alt="" width="20" height="20" />
                </button>
                <button
                  type="button"
                  className="concert-detail-btn-primary"
                  onClick={handleBookTicket}
                >
                  Get Tickets
                </button>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <div className="container concert-detail-footer-actions">
        <button type="button" className="concert-detail-btn-back" onClick={handleGoBack}>
          <span className="left-arrow" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}
