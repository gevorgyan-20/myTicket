import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSeatsForEvent } from '../api/SeatService';
import { createTicket } from '../api/ticketService';
import { getConcertById } from '../api/ConcertsService';
import { getMovieById } from '../api/MoviesService';
import { getStandupById } from '../api/StandupsService';
import useAuthStatus from '../hooks/useAuthStatus';

const SeatStatus = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
};

const EVENT_PRICES = {
    movies: 2500,
    concerts: 5000,
    standups: 2000,
    default: 1500,
};

const TYPE_MAP = {
    movies: 'movie',
    concerts: 'concert',
    standups: 'standup',
};

const EVENT_NAMES_EN = {
    movies: 'Movies',
    concerts: 'Concerts',
    standups: 'Standups',
};

const ChairIcon = ({ status, isSelected }) => {
    let fill = "none";
    let stroke = "#555";
    
    if (status === 'reserved') {
        fill = "#333";
        stroke = "#444";
    } else if (isSelected) {
        fill = "#b44dff";
        stroke = "#b44dff";
    } else {
        stroke = "#888";
    }

    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg" className="chair-svg">
            <path d="M5 11V15C5 16.1046 5.89543 17 7 17H17C18.1046 17 19 16.1046 19 15V11" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M19 11H5C4.44772 11 4 10.5523 4 10V9C4 7.89543 4.89543 7 6 7H18C19.1046 7 20 7.89543 20 9V10C20 10.5523 19.5523 11 19 11Z" fill={fill === "none" ? "transparent" : fill} stroke={stroke} strokeWidth="1.5"/>
            <path d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 17V19" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M18 17V19" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
            {status === 'reserved' && <path d="M10 12L14 16M14 12L10 16" stroke="#666" strokeWidth="1" strokeLinecap="round"/>}
        </svg>
    );
};

const SeatTile = ({ seat, isSelected, onClick }) => {
    const isReserved = seat.status === 'reserved';
    return (
        <div
            className={`seat-icon-wrapper ${isReserved ? 'reserved' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick(seat)}
        >
            <ChairIcon status={seat.status} isSelected={isSelected} />
            <span className="seat-number-label">{seat.number}</span>
        </div>
    );
};

const SeatsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { eventType, eventId } = useParams();
    const { user, isLoading: authLoading, isAuthenticated } = useAuthStatus();

    const [eventDetails, setEventDetails] = useState(null);
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);

    const ticketPrice = useMemo(() => EVENT_PRICES[eventType] || EVENT_PRICES.default, [eventType]);
    const totalPrice = useMemo(() => selectedSeats.length * ticketPrice, [selectedSeats, ticketPrice]);
    const singularType = useMemo(() => TYPE_MAP[eventType] || eventType, [eventType]);

    const fetchEventDetails = async () => {
        try {
            let response;
            if (eventType === 'concerts') response = await getConcertById(eventId);
            else if (eventType === 'movies') response = await getMovieById(eventId);
            else if (eventType === 'standups') response = await getStandupById(eventId);
            
            if (response?.data) {
                setEventDetails(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch event details", err);
        }
    };

    const fetchSeats = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getSeatsForEvent(eventType, eventId);
            setSeats(response.data);
        } catch {
            setError('Failed to load seats.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventDetails();
    }, [eventType, eventId]);

    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated) fetchSeats();
            else {
                setSeats([]);
                setLoading(false);
                setError(null);
            }
        }
    }, [eventType, eventId, authLoading, isAuthenticated]);

    const handleSeatClick = (seat) => {
        if (seat.status === SeatStatus.RESERVED) {
            setMessage('This seat is already reserved.');
            return;
        }
        setSelectedSeats(prev => {
            const isAlreadySelected = prev.some(s => s.id === seat.id);
            if (isAlreadySelected) return prev.filter(s => s.id !== seat.id);
            return [...prev, seat];
        });
        setMessage('');
    };

    const handleConfirmPurchase = async () => {
        if (selectedSeats.length === 0) {
            setMessage('Please select at least one seat.');
            return;
        }
        setLoading(true);
        setError(null);
        const purchasePromises = selectedSeats.map(seat => {
            const ticketData = {
                seat_id: seat.id,
                price: ticketPrice,
                status: 'purchased',
                ticketable_id: parseInt(eventId),
                ticketable_type: singularType,
                buyer_name: user?.name || 'Guest',
                buyer_email: user?.email || 'guest@example.com'
            };
            return createTicket(ticketData);
        });

        try {
            await Promise.all(purchasePromises);
            setMessage(`Congratulations! You successfully purchased ${selectedSeats.length} tickets for a total of ${totalPrice}֏.`);
            setSelectedSeats([]);
            await fetchSeats();
            window.dispatchEvent(new Event('authUpdate'));
        } catch {
            setError('Purchase failed. Please try again.');
            setSelectedSeats([]);
            await fetchSeats();
        } finally {
            setLoading(false);
        }
    };

    const seatsByRow = seats.reduce((acc, seat) => {
        (acc[seat.row] = acc[seat.row] || []).push(seat);
        return acc;
    }, {});

    if (authLoading || loading) return <div className="loading-center">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const isButtonDisabled = selectedSeats.length === 0;

    const SelectionSummary = () => (
        <div className="selection-summary-card">
            <div className="summary-details">
                <div className="selected-count">Selected Tickets: {selectedSeats.length}</div>
                <div className="selected-seats-list">
                    Seats: {selectedSeats
                        .sort((a, b) => a.row.localeCompare(b.row) || a.number - b.number)
                        .map(s => `R${s.row}, S${s.number}`)
                        .join(' | ')}
                </div>
            </div>
            <div className="summary-total">Total Price: {totalPrice}֏</div>
            <button
                onClick={handleConfirmPurchase}
                disabled={isButtonDisabled}
                className={`confirm-button ${isButtonDisabled ? 'disabled' : ''}`}
            >
                Confirm Purchase ({selectedSeats.length})
            </button>
        </div>
    );

    return (
        <div className="seat-page-container">
            <div className="event-hero" style={{ 
                backgroundImage: `linear-gradient(rgba(13, 13, 13, 0.6), #0d0d0d), url(${eventDetails?.poster_url || '/images/default-hero.jpg'})` 
            }}>
                <div className="hero-content">
                    <h1 className="hero-title">{eventDetails?.title || 'ADELE'}</h1>
                    <div className="hero-meta">
                        <div className="meta-item">
                            <span className="meta-icon">📅</span>
                            <span className="meta-text">{eventDetails?.date || 'Mar 06 - 2025'}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-icon">📍</span>
                            <span className="meta-text">{eventDetails?.location || 'Venue'}</span>
                        </div>
                    </div>
                    <div className="hero-selectors">
                        <div className="selector-item">
                            <span className="selector-label">SEC</span>
                            <span className="selector-value">VIP</span>
                        </div>
                        <div className="selector-divider"></div>
                        <div className="selector-item">
                            <span className="selector-label">ROW</span>
                            <span className="selector-value">{selectedSeats.length > 0 ? selectedSeats[0].row : '?'}</span>
                        </div>
                        <div className="selector-divider"></div>
                        <div className="selector-item">
                            <span className="selector-label">SEAT</span>
                            <span className="selector-value">{selectedSeats.length > 0 ? selectedSeats.map(s => s.number).join(', ') : '?'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="seats-main-layout">
                <div className="seats-left-column">
                    <div className="filters-row">
                        <div className="filter-pill active">2 tickets ▾</div>
                        <div className="filter-pill">Perks ▾</div>
                        <div className="filter-pill">Front rows ▾</div>
                        <div className="filter-pill">Price ▾</div>
                    </div>

                    <div className="seat-map-wrapper">
                        <div className="stage-curve"></div>
                        
                        {(!eventDetails?.venue_id || eventDetails?.venue_id === 1) && (
                            <div className="venue-design-1">
                                <div className="design-1-top">
                                    {Object.keys(seatsByRow).filter(r => parseInt(r) <= 4).sort((a,b) => a-b).map(row => (
                                        <div key={row} className="new-row-layout">
                                            <div className="new-seats-row">
                                                {seatsByRow[row].sort((a,b) => a.number - b.number).map(seat => (
                                                    <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={handleSeatClick} />
                                                ))}
                                            </div>
                                            <span className="new-row-label">{row}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="design-1-bottom">
                                    {Object.keys(seatsByRow).filter(r => parseInt(r) > 4).sort((a,b) => a-b).map(row => (
                                        <div key={row} className="design-1-complex-row">
                                            <div className="block-side left">
                                                {seatsByRow[row].filter(s => s.number <= 4).sort((a,b) => a.number - b.number).map(seat => (
                                                    <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={handleSeatClick} />
                                                ))}
                                            </div>
                                            <div className="block-center">
                                                {seatsByRow[row].filter(s => s.number > 4 && s.number <= 9).sort((a,b) => a.number - b.number).map(seat => (
                                                    <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={handleSeatClick} />
                                                ))}
                                            </div>
                                            <div className="block-side right">
                                                {seatsByRow[row].filter(s => s.number > 9).sort((a,b) => a.number - b.number).map(seat => (
                                                    <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={handleSeatClick} />
                                                ))}
                                            </div>
                                            <span className="new-row-label">{row}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {eventDetails?.venue_id === 2 && (
                            <div className="venue-design-2">
                                {Object.keys(seatsByRow).sort((a,b) => a-b).map(row => (
                                    <div key={row} className="stadium-row">
                                        <span className="row-id">{row}</span>
                                        <div className="stadium-seats">
                                            {seatsByRow[row].sort((a,b) => a.number - b.number).map(seat => (
                                                <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={handleSeatClick} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {eventDetails?.venue_id === 3 && (
                            <div className="venue-design-3">
                                {Object.keys(seatsByRow).sort((a,b) => a-b).map(row => (
                                    <div key={row} className="curved-theatre-row">
                                        <div className="curved-seats">
                                            {seatsByRow[row].sort((a,b) => a.number - b.number).map(seat => (
                                                <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={handleSeatClick} />
                                            ))}
                                        </div>
                                        <span className="row-id">{row}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="legend-new">
                            <div className="legend-item-new">
                                <ChairIcon status="reserved" />
                                <span>UnAvailable</span>
                            </div>
                            <div className="legend-item-new">
                                <ChairIcon status="available" isSelected={true} />
                                <span>Select</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="seats-right-column">
                    <div className="booking-summary-sidebar">
                        <div className="summary-header">
                            <span className="summary-icon">🛋️</span>
                            <h2 className="summary-title">Section VIP</h2>
                        </div>

                        <div className="price-details">
                            <div className="price-row">
                                <span>price</span>
                                <span className="price-value highlight">{ticketPrice}$/per</span>
                            </div>
                            <div className="price-row">
                                <span>Double Comfort</span>
                                <span>{selectedSeats.length}</span>
                            </div>
                            <div className="price-row total">
                                <span>Total</span>
                                <span className="price-total">{totalPrice}$</span>
                            </div>
                        </div>

                        <div className="summary-info-list">
                            <div className="info-item">
                                <span className="info-icon">🪑</span>
                                <span>Row {selectedSeats.length > 0 ? selectedSeats[0].row : '-'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">🎟️</span>
                                <span>{selectedSeats.length} tickets together</span>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">📅</span>
                                <span>{eventDetails?.date || 'Mar 06 - 2025'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">⏰</span>
                                <span>{eventDetails?.time || '20:00 - 12:00 Pm'}</span>
                            </div>
                        </div>

                        <button 
                            className={`continue-button ${selectedSeats.length === 0 ? 'disabled' : ''}`}
                            disabled={selectedSeats.length === 0}
                            onClick={handleConfirmPurchase}
                        >
                            Continue
                        </button>
                    </div>

                    <div className="stage-selected-card">
                        <div className="stage-title">Stage selected</div>
                        <div className="stage-rating">4.7 Great</div>
                        <div className="stage-view-link">👁️ Clear View</div>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`message-overlay ${error ? 'error' : 'success'}`} onClick={() => setMessage('')}>
                    <div className="message-content">
                        {message}
                        <button className="close-msg">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatsPage;
