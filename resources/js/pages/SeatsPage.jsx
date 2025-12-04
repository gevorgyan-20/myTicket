import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSeatsForEvent } from '../api/SeatService';
import { createTicket } from '../api/ticketService';
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

const SeatsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { eventType, eventId } = useParams();
    const { user, isLoading: authLoading, isAuthenticated } = useAuthStatus();

    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);

    const ticketPrice = useMemo(() => EVENT_PRICES[eventType] || EVENT_PRICES.default, [eventType]);
    const totalPrice = useMemo(() => selectedSeats.length * ticketPrice, [selectedSeats, ticketPrice]);
    const singularType = useMemo(() => TYPE_MAP[eventType] || eventType, [eventType]);

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
            <h1 className="title">
                Select Your Seats for {EVENT_NAMES_EN[eventType] || 'Event'} {eventId}
            </h1>

            <SelectionSummary />

            <div className="legend-item-wrapper">
                <div className="legend-item">
                    <span className="legend-color legend-available"></span> Available
                </div>
                <div className="legend-item">
                    <span className="legend-color legend-reserved"></span> Reserved
                </div>
                <div className="legend-item">
                    <span className="legend-color legend-selected" style={{backgroundColor: '#ff4500'}}></span> Selected
                </div>
            </div>

            {message && (
                <div className={`message-box ${error ? 'error-message' : 'success-message'}`} onClick={() => setMessage('')}>
                    {message}
                </div>
            )}

            <div className="main-content-card">
                <div className="screen-display">SCREEN / STAGE</div>
                <div className="rows-wrapper">
                    {Object.keys(seatsByRow).sort((a, b) => a - b).map(row => (
                        <div key={row} className="row-container">
                            <span className="row-label">Row {row}</span>
                            <div className="seats-in-row">
                                {seatsByRow[row].sort((a, b) => a.number - b.number).map(seat => {
                                    const isReserved = seat.status === SeatStatus.RESERVED;
                                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                                    let seatClass = isReserved ? 'seat-reserved' : 'seat-available';
                                    if (isSelected) seatClass = 'seat-selected';
                                    return (
                                        <div
                                            key={seat.id}
                                            className={`seat-tile ${seatClass}`}
                                            onClick={() => handleSeatClick(seat)}
                                            title={`Row ${seat.row}, Seat ${seat.number}`}
                                            style={isSelected ? { backgroundColor: '#ff4500' } : {}}
                                        >
                                            {seat.number}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeatsPage;
