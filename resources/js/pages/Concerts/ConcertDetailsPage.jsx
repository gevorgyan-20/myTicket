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
    <div className = "event-container">
      <div className="event-details">
        <div className="event-pic">
          <img
            src={concert?.poster_url}
            alt={concert?.title}
            className="event-poster"
          />
        </div>
        <div className="event-body" key = {concert?.id}>
          <div className="desc">
              <h2>
                  <i className="myticket-icon"></i>
                  <span className="title-h2-m main-font-semibold">{concert?.title}</span>
              </h2>
              <p className="event-desc"><span className="main-font-semibold">Description:</span> {concert?.description}</p>
              <p className="event-desc"><span className="main-font-semibold">Comedian:</span> {concert?.comedian}</p>
              <p className="event-desc"><span className="main-font-semibold">Location:</span> {concert?.location}</p>
              <p className="event-desc"><span className="main-font-semibold">Start Time:</span> {concert?.start_time}</p>
              <p className="fs-14"><span className="main-font-semibold">Price:</span> 5000 AMD</p>
          </div>
          <div className = "buttons">
              <button className="btn btn-blue" onClick={handleBookTicket}>
                <i className="ticket-icon"></i>
                <span>Book Ticket</span>
              </button>
              <button onClick={() => navigate(`${adminPath}/concerts`)} className="btn btn-gray">
                <i className="left-arrow"></i>
                <span>Go Back</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
