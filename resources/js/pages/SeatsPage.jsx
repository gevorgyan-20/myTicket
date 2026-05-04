import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSeatsForEvent, getUserBoughtTicketsCount } from '../api/SeatService';
import { createTicket } from '../api/TicketService';
import { getConcertById } from '../api/ConcertsService';
import { getMovieById } from '../api/MoviesService';
import { getStandupById } from '../api/StandupsService';
import { getShowtimeById } from '../api/ShowtimesService';
import useAuthStatus from '../hooks/useAuthStatus';
import { Calendar, MapPin, ChevronDown, X, Armchair, Ticket, Clock, Star, Eye, ArrowLeft } from 'lucide-react';

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

const ChairIcon = ({ status, isSelected, isLockedByOther }) => {
    let fill = "none";
    let stroke = "#555";
    
    if (status === 'reserved' || isLockedByOther) {
        fill = isLockedByOther ? "rgba(239, 68, 68, 0.4)" : "#333";
        stroke = isLockedByOther ? "#ef4444" : "#444";
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
            {(status === 'reserved' || isLockedByOther) && <path d="M10 12L14 16M14 12L10 16" stroke={isLockedByOther ? "#ef4444" : "#666"} strokeWidth="1" strokeLinecap="round"/>}
        </svg>
    );
};

const SeatTile = ({ seat, isSelected, onClick, isFilteredOut }) => {
    const isReserved = seat.status === 'reserved';
    const isLockedByOther = seat.is_locked_by_other;

    return (
        <div
            className={`seat-icon-wrapper ${isReserved ? 'reserved' : ''} ${isSelected ? 'selected' : ''} ${isFilteredOut ? 'filtered-out' : ''} ${isLockedByOther ? 'locked-by-other' : ''}`}
            onClick={() => !isLockedByOther && onClick(seat)}
        >
            <ChairIcon status={seat.status} isSelected={isSelected} isLockedByOther={isLockedByOther} />
            <span className="seat-number-label">{seat.number}</span>
            {isLockedByOther && <div className="lock-tooltip">Someone is selecting...</div>}
        </div>
    );
};

import VenueSeatPicker from '../components/VenueSeatPicker';

const SeatsPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const { eventType, eventId } = useParams();
    const { user, isLoading: authLoading, isAuthenticated } = useAuthStatus();

    const [eventDetails, setEventDetails] = useState(null);
    const [showtimeDetails, setShowtimeDetails] = useState(null);
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userBoughtCount, setUserBoughtCount] = useState(0);
    const [filters, setFilters] = useState({
        quantity: 1,
        // perks: false,
        frontRows: false,
        priceMax: null
    });
    const [openDropdown, setOpenDropdown] = useState(null);
    const seatMapRef = useRef(null);

    const [lockedByOthers, setLockedByOthers] = useState([]);

    const isSpatial = useMemo(() => seats.some(s => s.is_spatial), [seats]);
    const reservedSeatIds = useMemo(() => seats.filter(s => s.status === 'reserved').map(s => s.id), [seats]);

    const showtimeId = useMemo(() => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get('showtime_id');
    }, [location.search]);

    const activeVenueId = showtimeDetails?.venue_id || eventDetails?.venue_id;

    const ticketPrice = useMemo(() => EVENT_PRICES[eventType] || EVENT_PRICES.default, [eventType]);
    const totalPrice = useMemo(() => {
        if (isSpatial) {
            return selectedSeats.reduce((sum, s) => {
                const sectionPrice = s.section_price != null ? s.section_price : ticketPrice;
                return sum + Number(sectionPrice);
            }, 0);
        }
        return selectedSeats.length * ticketPrice;
    }, [selectedSeats, ticketPrice, isSpatial]);

    const singularType = useMemo(() => TYPE_MAP[eventType] || eventType, [eventType]);

    const maxPriceAvailable = useMemo(() => {
        if (seats.length === 0) return 10000;
        return Math.max(...seats.map(s => Number(s.section_price || ticketPrice)));
    }, [seats, ticketPrice]);

    const enrichedSeats = useMemo(() => {
        return seats.map(seat => {
            const price = Number(seat.section_price || ticketPrice);
            let isFilteredOut = false;

            // Real-time lock check
            const isLockedByOther = lockedByOthers.includes(String(seat.id));

            // Smart Front Row detection
            const rowLabel = String(seat.row).toUpperCase();
            const isFrontRow = ['A', 'B', 'C', '1', '2', '3'].some(r => rowLabel.startsWith(r));
            if (filters.frontRows && !isFrontRow) isFilteredOut = true;

            if (filters.priceMax && price > filters.priceMax) isFilteredOut = true;

            if (filters.quantity > 1 && seat.status === 'available' && !isSpatial) {
                const rowSeats = seats.filter(s => s.row === seat.row).sort((a,b) => a.number - b.number);
                const idx = rowSeats.findIndex(s => s.id === seat.id);
                
                let found = false;
                for (let start = Math.max(0, idx - filters.quantity + 1); start <= idx; start++) {
                    const block = rowSeats.slice(start, start + filters.quantity);
                    if (block.length === filters.quantity && block.every(s => s.status === 'available')) {
                        found = true;
                        break;
                    }
                }
                if (!found) isFilteredOut = true;
            }

            return { 
                ...seat, 
                is_disabled: isFilteredOut,
                is_locked_by_other: isLockedByOther
            };
        });
    }, [seats, filters, ticketPrice, maxPriceAvailable, isSpatial, lockedByOthers]);

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
            const queryParams = new URLSearchParams(location.search);
            const showtimeId = queryParams.get('showtime_id');
            const response = await getSeatsForEvent(eventType, eventId, showtimeId);
            setSeats(response.data);

            if (showtimeId) {
                const countResponse = await getUserBoughtTicketsCount(showtimeId);
                setUserBoughtCount(countResponse.data?.count || 0);

                try {
                    const stResponse = await getShowtimeById(showtimeId);
                    setShowtimeDetails(stResponse.data);
                } catch (err) {
                    console.error("Failed to fetch showtime details", err);
                }
            }
        } catch {
            setError(t('seats.error'));
        } finally {
            setLoading(false);
        }
    };

    // ── Real-time logic ──────────────────────────────────────────────────────
    
    const broadcastSeatLock = async (seatId, isLocked) => {
        try {
            await axios.post(`/api/seats/${isLocked ? 'lock' : 'unlock'}`, {
                eventType,
                eventId,
                seatId: String(seatId),
            });
        } catch (err) {
            console.error("Failed to broadcast seat status", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        if (!eventId || !eventType) return;

        const channelName = `events.${eventType}.${eventId}`;
        const channel = window.Echo.channel(channelName);

        channel
            .listen('.SeatLocked', (e) => {
                console.log('Received SeatLocked:', e);
                setLockedByOthers(prev => {
                    if (prev.includes(String(e.seatId))) return prev;
                    return [...prev, String(e.seatId)];
                });
            })
            .listen('.SeatUnlocked', (e) => {
                console.log('Received SeatUnlocked:', e);
                setLockedByOthers(prev => prev.filter(id => id !== String(e.seatId)));
            })
            .listen('.SeatPurchased', (e) => {
                console.log('Received SeatPurchased:', e);
                setSeats(prev => prev.map(s => 
                    String(s.id) === String(e.seatId) ? { ...s, status: 'reserved' } : s
                ));
                setLockedByOthers(prev => prev.filter(id => id !== String(e.seatId)));
            });

        return () => {
            window.Echo.leaveChannel(channelName);
        };
    }, [eventId, eventType]);

    // ─────────────────────────────────────────────────────────────────────────────

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

    useEffect(() => {
        if (!loading && seatMapRef.current && !isSpatial) {
            const container = seatMapRef.current;
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
            if (scrollWidth > clientWidth) {
                container.scrollLeft = (scrollWidth - clientWidth) / 2;
            }
        }
    }, [loading, isSpatial]);

    const handleSeatClick = (seat) => {
        if (seat.status === SeatStatus.RESERVED || seat.is_locked_by_other) {
            setMessage(seat.is_locked_by_other ? "This seat is being selected by another user" : t('seats.alreadyReserved'));
            return;
        }
        setSelectedSeats(prev => {
            const isAlreadySelected = prev.some(s => s.id === seat.id);
            if (isAlreadySelected) {
                broadcastSeatLock(seat.id, false);
                return prev.filter(s => s.id !== seat.id);
            }
            broadcastSeatLock(seat.id, true);
            return [...prev, seat];
        });
        setMessage('');
    };

    const handleSpatialSelection = (selectedIds) => {
        const selectedObjects = selectedIds.map(id => enrichedSeats.find(s => s.id === id)).filter(Boolean);
        setSelectedSeats(selectedObjects);
    };

    const handleOpenModal = () => {
        if (selectedSeats.length === 0) {
            setMessage(t('seats.selectAtLeastOne'));
            return;
        }
        setIsModalOpen(true);
    };

    const [reserving, setReserving] = useState(false);
    const [reserveError, setReserveError] = useState(null);

    const handleNavigateToCheckout = async () => {
        const queryParams = new URLSearchParams(location.search);
        const currentShowtimeId = queryParams.get('showtime_id') || showtimeId;

        setReserving(true);
        setReserveError(null);

        try {
            const token = localStorage.getItem('authToken');
            const reservePromises = selectedSeats.map(seat => {
                const price = isSpatial && seat.section_price != null
                    ? Number(seat.section_price)
                    : ticketPrice;

                return fetch('/api/tickets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        seat_id: seat.id,
                        showtime_id: currentShowtimeId,
                        price,
                        status: 'reserved',
                        action: 'reserve',
                        buyer_name: null,
                        buyer_email: null,
                    }),
                }).then(async res => {
                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.message || 'Seat reservation failed.');
                    }
                    return res.json();
                });
            });

            const reserved = await Promise.all(reservePromises);

            // Attach the returned ticket IDs to the seat objects so checkout can upgrade them
            const seatsWithTicketIds = selectedSeats.map((seat, i) => ({
                ...seat,
                reservedTicketId: reserved[i]?.id,
            }));

            navigate('/checkout', {
                state: {
                    selectedSeats: seatsWithTicketIds,
                    eventDetails,
                    showtimeId: currentShowtimeId,
                    totalPrice,
                    ticketPrice,
                    isSpatial,
                    reserved_until: reserved[0]?.reserved_until, // pass the expiry back to checkout
                }
            });
        } catch (err) {
            setReserveError(err.message || 'Could not reserve seats. Please try again.');
        } finally {
            setReserving(false);
        }
    };

    const seatsByRow = enrichedSeats.reduce((acc, seat) => {
        (acc[seat.row] = acc[seat.row] || []).push(seat);
        return acc;
    }, {});

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="font-poppins text-lg animate-pulse">{t('common.loading')}</p>
                </div>
            </div>
        );
    }
    if (error) return <div className="error-message">{error}</div>;

    const isButtonDisabled = selectedSeats.length === 0;

    const SelectionSummary = () => (
        <div className="selection-summary-card">
            <div className="summary-details">
                <div className="selected-count">{t('seats.summary.selectedTickets', { count: selectedSeats.length })}</div>
                <div className="selected-seats-list">
                    {t('seats.summary.seats')} {selectedSeats
                        .sort((a, b) => {
                             const rowA = String(a.row);
                             const rowB = String(b.row);
                             return rowA.localeCompare(rowB) || String(a.number).localeCompare(String(b.number));
                        })
                        .map(s => isSpatial ? s.number : `R${s.row}, S${s.number}`)
                        .join(' | ')}
                </div>
            </div>
            <div className="summary-total">{t('seats.summary.totalPrice', { price: totalPrice })}</div>
            <button
                onClick={handleOpenModal}
                disabled={isButtonDisabled}
                className={`confirm-button ${isButtonDisabled ? 'disabled' : ''}`}
            >
                {t('seats.summary.confirmPurchase', { count: selectedSeats.length })}
            </button>
        </div>
    );

    return (
        <div className="seat-page-container font-mulish">
            <div className="event-hero" style={{ 
                backgroundImage: `linear-gradient(rgba(13, 13, 13, 0.4), #0d0d0d), url(${eventDetails?.poster_url || '/images/default-hero.jpg'})` 
            }}>
                <div className="hero-content">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all group text-white w-fit"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">{t('common.goBack')}</span>
                    </button>

                    <h1 className="hero-title">{eventDetails?.title || 'ADELE'}</h1>
                    <div className="hero-meta">
                        <div className="meta-item">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span className="meta-text">{eventDetails?.date || 'Mar 06 - 2025'}</span>
                        </div>
                        <div className="meta-item">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span className="meta-text">{eventDetails?.location || 'Venue'}</span>
                        </div>
                    </div>
                    <div className="hero-selectors">
                        <div className="selector-item">
                            <span className="selector-label">{t('seats.hero.sec')}</span>
                            <span className="selector-value">{isSpatial && selectedSeats.length > 0 ? selectedSeats[0].row : '---'}</span>
                        </div>
                        <div className="selector-divider"></div>
                        <div className="selector-item">
                            <span className="selector-label">{isSpatial ? t('seats.hero.label') : t('seats.hero.row')}</span>
                            <span className="selector-value">{selectedSeats.length > 0 ? (isSpatial ? selectedSeats[0].number : selectedSeats[0].row) : '?'}</span>
                        </div>
                        <div className="selector-divider"></div>
                        <div className="selector-item">
                            <span className="selector-label">{t('seats.hero.seat')}</span>
                            <span className="selector-value">{selectedSeats.length > 0 ? selectedSeats.map(s => s.number).join(', ') : '?'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="seats-main-layout">
                <div className="seats-left-column">
                    <div className="filters-row">
                        <div className={`filter-dropdown-wrap ${openDropdown === 'qty' ? 'open' : ''}`}>
                            <div 
                                className={`filter-pill ${filters.quantity > 1 ? 'active' : ''}`}
                                onClick={() => setOpenDropdown(openDropdown === 'qty' ? null : 'qty')}
                            >
                                {filters.quantity} {t('seats.filters.tickets')} <ChevronDown className="inline-block w-4 h-4 ml-1 opacity-60" />
                            </div>
                            {openDropdown === 'qty' && (
                                <div className="filter-dropdown-menu">
                                    {[1, 2, 3, 4, 5].map(q => (
                                        <div 
                                            key={q} 
                                            className={`dropdown-item ${filters.quantity === q ? 'selected' : ''}`}
                                            onClick={() => { setFilters({...filters, quantity: q}); setOpenDropdown(null); }}
                                        >
                                            {q} {t('seats.filters.tickets')}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* <div 
                            className={`filter-pill ${filters.perks ? 'active' : ''}`}
                            onClick={() => setFilters({...filters, perks: !filters.perks})}
                        >
                            {t('seats.filters.perks')}
                        </div> */}

                        <div 
                            className={`filter-pill ${filters.frontRows ? 'active' : ''}`}
                            onClick={() => setFilters({...filters, frontRows: !filters.frontRows})}
                        >
                            {t('seats.filters.frontRows')}
                        </div>

                        <div className={`filter-dropdown-wrap ${openDropdown === 'price' ? 'open' : ''}`}>
                            <div 
                                className={`filter-pill ${filters.priceMax ? 'active' : ''}`}
                                onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                            >
                                {filters.priceMax ? `${t('seats.filters.upTo')} ${filters.priceMax}֏` : t('seats.filters.price')} <ChevronDown className="inline-block w-4 h-4 ml-1 opacity-60" />
                            </div>
                            {openDropdown === 'price' && (
                                <div className="filter-dropdown-menu">
                                    <div className="dropdown-header">{t('seats.filters.maxPrice')}</div>
                                    <input 
                                        type="range" 
                                        min={Math.min(...seats.map(s => Number(s.section_price || ticketPrice)))} 
                                        max={maxPriceAvailable} 
                                        step={500}
                                        value={filters.priceMax || maxPriceAvailable}
                                        onChange={(e) => setFilters({...filters, priceMax: parseInt(e.target.value)})}
                                        className="price-range-slider"
                                    />
                                    <div className="price-display">{filters.priceMax || maxPriceAvailable}֏</div>
                                    <div 
                                        className="dropdown-item reset"
                                        onClick={() => { setFilters({...filters, priceMax: null}); setOpenDropdown(null); }}
                                    >
                                        {t('seats.filters.anyPrice')}
                                    </div>
                                </div>
                            )}
                        </div>

                        {(filters.quantity > 1 || filters.frontRows || filters.priceMax) && (
                            <div className="filter-pill reset" onClick={() => setFilters({ quantity: 1, frontRows: false, priceMax: null })}>
                                <X className="inline-block w-4 h-4 mr-1" /> {t('seats.filters.clear')}
                            </div>
                        )}
                    </div>

                    {openDropdown && <div className="filter-dropdown-overlay" onClick={() => setOpenDropdown(null)} />}

                    <div className="seat-map-wrapper" ref={seatMapRef}>
                        {isSpatial ? (
                            <div className="spatial-picker-container py-10">
                                <VenueSeatPicker 
                                    venueId={activeVenueId}
                                    showtimeId={showtimeId}
                                    reservedSeatIds={reservedSeatIds}
                                    enrichedSeats={enrichedSeats}
                                    onSelectionChange={handleSpatialSelection}
                                    userBoughtCount={userBoughtCount}
                                    lockedByOthers={lockedByOthers}
                                    onBroadcastLock={broadcastSeatLock}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="stage-curve"></div>
                                
                                {(!activeVenueId || activeVenueId === 1) && (
                                    <div className="venue-design-1">
                                        <div className="design-1-top">
                                            {Object.keys(seatsByRow).filter(r => parseInt(r) <= 4).sort((a,b) => a-b).map(row => (
                                                <div key={row} className="new-row-layout">
                                                    <div className="new-seats-row">
                                                        {seatsByRow[row].sort((a,b) => a.number - b.number).map(seat => (
                                                            <SeatTile 
                                                                key={seat.id} 
                                                                seat={seat} 
                                                                isSelected={selectedSeats.some(s => s.id === seat.id)} 
                                                                onClick={seat.is_disabled ? () => {} : handleSeatClick} 
                                                                isFilteredOut={seat.is_disabled}
                                                            />
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
                                                            <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={seat.is_disabled ? () => {} : handleSeatClick} isFilteredOut={seat.is_disabled} />
                                                        ))}
                                                    </div>
                                                    <div className="block-center">
                                                        {seatsByRow[row].filter(s => s.number > 4 && s.number <= 9).sort((a,b) => a.number - b.number).map(seat => (
                                                            <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={seat.is_disabled ? () => {} : handleSeatClick} isFilteredOut={seat.is_disabled} />
                                                        ))}
                                                    </div>
                                                    <div className="block-side right">
                                                        {seatsByRow[row].filter(s => s.number > 9).sort((a,b) => a.number - b.number).map(seat => (
                                                            <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={seat.is_disabled ? () => {} : handleSeatClick} isFilteredOut={seat.is_disabled} />
                                                        ))}
                                                    </div>
                                                    <span className="new-row-label">{row}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeVenueId === 2 && (
                                    <div className="venue-design-2">
                                        {Object.keys(seatsByRow).sort((a,b) => a-b).map(row => (
                                            <div key={row} className="stadium-row">
                                                <span className="row-id">{row}</span>
                                                <div className="stadium-seats">
                                                    {seatsByRow[row].sort((a,b) => a.number - b.number).map(seat => (
                                                        <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={seat.is_disabled ? () => {} : handleSeatClick} isFilteredOut={seat.is_disabled} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeVenueId === 3 && (
                                    <div className="venue-design-3">
                                        {Object.keys(seatsByRow).sort((a,b) => a-b).map(row => (
                                            <div key={row} className="curved-theatre-row">
                                                <div className="curved-seats">
                                                    {seatsByRow[row].sort((a,b) => a.number - b.number).map(seat => (
                                                        <SeatTile key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={seat.is_disabled ? () => {} : handleSeatClick} isFilteredOut={seat.is_disabled} />
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
                                        <span>{t('seats.legend.unavailable')}</span>
                                    </div>
                                    <div className="legend-item-new">
                                        <ChairIcon isLockedByOther={true} />
                                        <span>Being selected</span>
                                    </div>
                                    <div className="legend-item-new">
                                        <ChairIcon status="available" isSelected={true} />
                                        <span>{t('seats.legend.select')}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="seats-right-column">
                    <div className="booking-summary-sidebar">
                        <div className="summary-header">
                            <Armchair className="w-6 h-6 text-purple-400" />
                            <h2 className="summary-title">{t('seats.sidebar.sectionVip')}</h2>
                        </div>

                        <div className="price-details">
                            <div className="price-row">
                                <span>{t('seats.sidebar.price')}</span>
                                <span className="price-value highlight">{ticketPrice}֏/{t('seats.sidebar.per')}</span>
                            </div>
                            <div className="price-row">
                                <span>{t('seats.sidebar.doubleComfort')}</span>
                                <span>{selectedSeats.length}</span>
                            </div>
                            <div className="price-row total">
                                <span>{t('seats.sidebar.total')}</span>
                                <span className="price-total">{totalPrice}֏</span>
                            </div>
                        </div>

                        <div className="summary-info-list">
                            <div className="info-item">
                                <Armchair className="w-4 h-4 text-purple-400" />
                                <span>{t('seats.hero.row')} {selectedSeats.length > 0 ? selectedSeats[0].row : '-'}</span>
                            </div>
                            <div className="info-item">
                                <Ticket className="w-4 h-4 text-purple-400" />
                                <span>{t('seats.sidebar.ticketsTogether', { count: selectedSeats.length })}</span>
                            </div>
                            <div className="info-item">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                <span>{eventDetails?.date || 'Mar 06 - 2025'}</span>
                            </div>
                            <div className="info-item">
                                <Clock className="w-4 h-4 text-purple-400" />
                                <span>{eventDetails?.time || '20:00 - 12:00 Pm'}</span>
                            </div>
                        </div>

                        <button 
                            className={`continue-button ${selectedSeats.length === 0 ? 'disabled' : ''}`}
                            disabled={selectedSeats.length === 0}
                            onClick={handleOpenModal}
                        >
                            {t('seats.sidebar.continue')}
                        </button>
                    </div>

                    {/* <div className="stage-selected-card">
                        <div className="stage-title">{t('seats.sidebar.stageSelected')}</div>
                        <div className="stage-view-link flex items-center gap-2 mt-1 cursor-pointer hover:text-purple-400 transition-colors">
                            <Eye className="w-4 h-4" />
                            {t('seats.sidebar.clearView')}
                        </div>
                    </div> */}
                </div>
            </div>

            {message && (
                <div className={`message-overlay ${error ? 'error' : 'success'}`} onClick={() => setMessage('')}>
                    <div className="message-content">
                        {message}
                        <button className="close-msg">{t('seats.message.close')}</button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="ticket-info-modal">
                        <div className="modal-header-section">
                            <div className="red-seats-illustration">
                                <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="10" y="20" width="25" height="30" rx="4" fill="#e50914" />
                                    <rect x="40" y="20" width="25" height="30" rx="4" fill="#e50914" />
                                    <rect x="70" y="20" width="25" height="30" rx="4" fill="#e50914" />
                                    <rect x="100" y="20" width="25" height="30" rx="4" fill="#e50914" />
                                    <rect x="130" y="20" width="25" height="30" rx="4" fill="#e50914" />
                                </svg>
                            </div>
                        </div>
                        <div className="modal-body-section">
                            <div className="modal-title-row flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-purple-400" />
                                <h2>{t('seats.modal.ticketInfo')}</h2>
                                <span className="vip-badge-small">{t('seats.modal.vip')}</span>
                            </div>
                            
                            <div className="modal-info-grid">
                                <div className="info-cell">
                                    <Ticket className="w-4 h-4 text-purple-400" />
                                    <span>{t('seats.sidebar.ticketsTogether', { count: selectedSeats.length })}</span>
                                </div>
                                <div className="info-cell">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    <span>{eventDetails?.date || 'Mar 06 - 2025'}</span>
                                </div>
                                <div className="info-cell">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    <span>{eventDetails?.location || 'Venue'}</span>
                                </div>
                                <div className="info-cell">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    <span>{eventDetails?.time || '20:00 - 12:00 Pm'}</span>
                                </div>
                            </div>

                            <div className="modal-receipt-section">
                                <div className="receipt-row strong">
                                    <span>{t('seats.modal.row')}</span>
                                    <span>{selectedSeats.length > 0 ? (isSpatial ? selectedSeats[0].number : selectedSeats[0].row) : '-'}</span>
                                </div>
                                {selectedSeats.map(seat => {
                                    const seatPrice = isSpatial && seat.section_price != null ? Number(seat.section_price) : ticketPrice;
                                    return (
                                        <div key={seat.id} className="receipt-row">
                                            <span>{t('seats.modal.seat', { number: seat.number })}</span>
                                            <span>{seatPrice}֏</span>
                                        </div>
                                    );
                                })}
                                <div className="receipt-divider"></div>
                                <div className="receipt-row strong">
                                    <span>{t('seats.modal.total')}</span>
                                    <span>{totalPrice}֏</span>
                                </div>
                            </div>

                            <div className="modal-actions-row">
                                <button className="change-seat-btn" onClick={() => setIsModalOpen(false)} disabled={reserving}>{t('seats.modal.changeSeat')}</button>
                                <button className="modal-continue-btn" onClick={handleNavigateToCheckout} disabled={reserving}>
                                    {reserving ? '⏳ Reserving…' : t('seats.modal.continue')}
                                </button>
                            </div>
                            {reserveError && (
                                <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: 12, textAlign: 'center' }}>
                                    {reserveError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatsPage;
