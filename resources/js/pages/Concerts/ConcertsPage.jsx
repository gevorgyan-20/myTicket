import React from 'react';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConcerts } from '../../api/ConcertsService';
import useAuthStatus from '../../hooks/useAuthStatus';

export default function ConcertsPage() {
    const { role } = useAuthStatus();

    const [concerts, setConcerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const adminPath = role === 'admin' ? '/admin' : ''; 

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const res = await getConcerts();
        setConcerts(res.data);
      } catch (err) {
        console.error("Error fetching concerts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  if (isLoading) {
    return <div className="loading-center">Loading...</div>;
  }

return (
    <div className="event-container">
      <h3>Concerts</h3>
         <div className="event-block">
             {concerts.map((concert) => (
             <Link to={`${adminPath}/concerts/${concert.id}`} key={concert.id} className="event-card">
                 <img
                    src={concert.poster_url}
                    alt={concert.title}
                    className="event-poster"/>
                 <div className="event-body">
                     <h2 className="event-title main-font-semibold">{concert.title}</h2>
                     <p className="event-desc main-font-semibold">Performer: {concert.performer}</p>
                 </div>
             </Link>
             ))}
         </div>
    </div>
);
}

