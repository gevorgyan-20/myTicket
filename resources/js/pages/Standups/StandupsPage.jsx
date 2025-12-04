import React from 'react';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStandups } from '../../api/StandupsService';
import useAuthStatus from '../../hooks/useAuthStatus';

export default function StandupsPage() {
    const { role } = useAuthStatus();

    const [standups, setStandups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const adminPath = role === 'admin' ? '/admin' : ''; 

  useEffect(() => {
    const fetchStandups = async () => {
      try {
        const res = await getStandups();
        setStandups(res.data);
      } catch (err) {
        console.error("Error fetching concerts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandups();
  }, []);

  if (isLoading) {
    return <div className="loading-center">Loading...</div>;
  }

return (
    <div className="event-container">
      <h3>Standups</h3>
         <div className="event-block">
             {standups.map((standup) => (
             <Link to={`${adminPath}/standups/${standup.id}`} key={standup.id} className="event-card">
                 <img
                    src={standup.poster_url}
                    alt={standup.title}
                    className="event-poster"/>
                 <div className="event-body">
                     <h2 className="event-title main-font-semibold">{standup.title}</h2>
                     <p className="event-desc main-font-semibold">Comedian: {standup.comedian}</p>
                 </div>
             </Link>
             ))}
         </div>
    </div>
);
}
