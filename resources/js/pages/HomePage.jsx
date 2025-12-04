import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getMovies } from "../api/MoviesService"; 
import { getConcerts } from "../api/ConcertsService"; 
import { getStandups } from "../api/StandupsService"; 

import useAuthStatus from '../hooks/useAuthStatus'; 

function HomePage() {
    const {role} = useAuthStatus(); 
    const adminPath = role === 'admin' ? '/admin' : ''; 

    const [movies, setMovies] = useState([]);
    const [concerts, setConcerts] = useState([]);
    const [standups, setStandups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const fetchAllEvents = async () => {
        try {
            // Սկսել բոլոր երեք կանչերը զուգահեռ
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
        return <div className="loading-center">Loading...</div>;
    }

    return (
        <div className="home-page-container">
            
            {/* 2. ABOUT US PREVIEW - Տեղեկություն մեր մասին */}
            <section className="about-preview-section">
                <h2 className = 'title-h2-m'>Who We Are</h2>
                <div className="about-content">
                    <p>
                        MyTicket.am is the leading platform for purchasing tickets to the most anticipated events across Armenia. 
                        We offer a fast, secure, and user-friendly experience, ensuring you never miss out on your favorite shows.
                    </p>
                    <p>
                        We cover everything from blockbuster movies to grand orchestral concerts and intimate standup performances. 
                    </p>
                    <Link to="/about" className="link-more-info">Read More About Us</Link>
                </div>
            </section>
            
            <h2 className="section-heading">Featured Events</h2>
            
            <div className="event-container">
                <h3>Movies</h3>
                <div className="event-block">
                    {movies.slice(0, 3).map((movie) => (
                    <Link to={`${adminPath}/movies/${movie.id}`} key={movie.id} className="event-card">
                        <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="event-poster"
                        />
                        <div className="event-body">
                            <h2 className="event-title">{movie.title}</h2>
                        </div>
                    </Link>
                    ))}
                </div>
                <Link to={`${adminPath}/movies`}>
                    <h3 className = 'flex'>
                        <span>See upcoming Events</span>
                        <i className="right-arrow"></i>
                    </h3>
                </Link>
            </div>

            <div className="event-container">
                <h3>Concerts</h3>
                <div className="event-block">
                    {concerts.slice(0, 3).map((concert) => (
                    <Link to={`${adminPath}/concerts/${concert.id}`} key={concert.id} className="event-card">
                        <img
                            src={concert.poster_url}
                            alt={concert.title}
                            className="event-poster"
                        />
                        <div className="event-body">
                            <h2 className="event-title">{concert.title}</h2>
                        </div>
                    </Link>
                    ))}
                </div>
                <Link to={`${adminPath}/concerts`}>
                    <h3 className = 'flex'>
                        <span>See upcoming Events</span>
                        <i className="right-arrow"></i>
                    </h3>
                </Link>
            </div>

            <div className="event-container">
                <h3>Standups</h3>
                <div className="event-block">
                    {standups.slice(0, 3).map((standup) => (
                    <Link to={`${adminPath}/standups/${standup.id}`} key={standup.id} className="event-card">
                        <img
                            src={standup.poster_url}
                            alt={standup.title}
                            className="event-poster"
                        />
                        <div className="event-body">
                            <h2 className="event-title">{standup.title}</h2>
                        </div>
                    </Link>
                    ))}
                </div>
                <Link to={`${adminPath}/standups`}>
                    <h3 className = 'flex'>
                        <span>See upcoming Events</span>
                        <i className="right-arrow"></i>
                    </h3>
                </Link>
            </div>

        </div>
    );
}

export default HomePage;