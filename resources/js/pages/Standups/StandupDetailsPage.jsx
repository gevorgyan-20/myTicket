import React from 'react';

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStandupById } from '../../api/StandupsService';
import useAuthStatus from '../../hooks/useAuthStatus';

export default function StandupDetailsPage() {
  const { role, isAuthenticated, isLoading: authLoading } = useAuthStatus();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [standup, setStandup] = useState(null);
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
    navigate(`/standups/${id}/seats`);
  };

  useEffect(() => {
    const fetchStandup = async () => {
      try {
        const res = await getStandupById(id);
        setStandup(res.data);
      } catch (err) {
        console.error("Error fetching standup:", err);
      } finally {
            setIsLoading(false);
      }
    };

    fetchStandup();
  }, [id]);

  if (isLoading) {
      return <div className="loading-center">Loading...</div>;
  }

  return (
    <div className = "event-container">
      <div className="event-details">
        <div className="event-pic">
          <img
            src={standup?.poster_url}
            alt={standup?.title}
            className="event-poster"
          />
        </div>
        <div className="event-body" key = {standup?.id}>
          <div className="desc">
              <h2>
                  <i className="myticket-icon"></i>
                  <span className="title-h2-m main-font-semibold">{standup?.title}</span>
              </h2>
              <p className="event-desc"><span className="main-font-semibold">Description:</span> {standup?.description}</p>
              <p className="event-desc"><span className="main-font-semibold">Comedian:</span> {standup?.comedian}</p>
              <p className="event-desc"><span className="main-font-semibold">Location:</span> {standup?.location}</p>
              <p className="event-desc"><span className="main-font-semibold">Start Time:</span> {standup?.start_time}</p>
              <p className="fs-14"><span className="main-font-semibold">Price:</span> 2000 AMD</p>
          </div>
          <div className = "buttons">
              <button className="btn btn-blue" onClick={handleBookTicket}>
                <i className="ticket-icon"></i>
                <span>Book Ticket</span>
              </button>
              <button onClick={() => navigate(`${adminPath}/standups`)} className="btn btn-gray">
                <i className="left-arrow"></i>
                <span>Go Back</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
