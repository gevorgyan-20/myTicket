import React from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getConcertById } from '../../api/ConcertsService';
import useAuthStatus from '../../hooks/useAuthStatus';

export default function ConcertDetailsPage() {
  const { role, isAuthenticated, isLoading: authLoading } = useAuthStatus();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [concert, setConcert] = useState(null);
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
    navigate(`/concerts/${id}/seats`);
  };

  const handleGoBack = () => {
    navigate(adminPath ? `${adminPath}/concerts` : '/concerts');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: concert?.title,
        url: window.location.href,
        text: concert?.description
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  useEffect(() => {
    const fetchConcert = async () => {
      try {
        const res = await getConcertById(id);
        setConcert(res.data);
      } catch (err) {
        console.error("Error fetching concert:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcert();
  }, [id]);

  if (isLoading) {
    return <div className="loading-center">Loading...</div>;
  }

  return (
    <div className="concert-detail-page">
      {/* Hero section */}
      <section className="concert-detail-hero">
        <div
          className="concert-detail-hero-bg"
          style={{ backgroundImage: concert?.poster_url ? `url(${concert.poster_url})` : undefined }}
        />
        <div className="concert-detail-hero-overlay" />
        <div className="container concert-detail-hero-inner">
          <div className="concert-detail-hero-left">
            <h1 className="concert-detail-artist-name">{concert?.title}</h1>
            <p className="concert-detail-tagline">
              {concert?.description || `${concert?.title} – Live`}
            </p>
          </div>
          <div className="concert-detail-hero-right">
            <div className="concert-detail-artist-circle">
              <img src={concert?.poster_url} alt={concert?.title} />
            </div>
            <div className="concert-detail-location-card">
              <span className="concert-detail-location-icon" />
              <span className="concert-detail-location-text">{concert?.location || '—'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="concert-detail-events">
        <div className="container">
          <div className="concert-detail-events-header">
            <h2 className="concert-detail-events-title">All days and times</h2>
            <div className="concert-detail-location-filter">
              <span>{concert?.location || '—'}</span>
              <span className="concert-detail-dropdown-arrow" />
            </div>
          </div>

          <ul className="concert-detail-event-list">
            <li className="concert-detail-event-card">
              <div className="concert-detail-event-info">
                <div className="concert-detail-event-venue">
                  <span className="concert-detail-event-pin" />
                  <span>{concert?.location || '—'}</span>
                </div>
                <div className="concert-detail-event-datetime">
                  {concert?.start_time || '—'}
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
