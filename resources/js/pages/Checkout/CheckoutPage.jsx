import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { createTicket } from '../../api/ticketService';
import { saveTransaction } from '../../api/paymentService';
import useAuthStatus from '../../hooks/useAuthStatus';
import { Ticket, CreditCard, Check, User, Phone, Mail, ShieldCheck, Banknote, X, Timer, MapPin, Calendar } from 'lucide-react';

// Load Stripe outside component to avoid re-creating on each render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

// ─── Inner payment form that lives inside <Elements> ─────────────────────────
const StripePaymentForm = ({ onSuccess, onError, selectedSeats, showtimeId, ticketPrice, isSpatial, totalPrice, user, paymentIntentId }) => {
    const { t } = useTranslation();
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            onError(submitError.message);
            setProcessing(false);
            return;
        }

        // Confirm the PaymentIntent using the Payment Element
        const { error: confirmError } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (confirmError) {
            onError(confirmError.message);
            setProcessing(false);
            return;
        }

        // Payment confirmed — upgrade reserved tickets to 'buy'
        try {
            const purchasePromises = selectedSeats.map(seat => {
                const price = isSpatial && seat.section_price != null
                    ? Number(seat.section_price)
                    : ticketPrice;

                return createTicket({
                    seat_id: seat.id,
                    showtime_id: showtimeId || seat.showtime_id,
                    price,
                    status: 'buy',
                    action: 'buy',            // signals backend to upgrade reservation
                    buyer_name: user?.name || 'Guest',
                    buyer_email: user?.email || 'guest@example.com',
                });
            });

            const results = await Promise.all(purchasePromises);
            const ticketIds = results.map(r => r.data?.id).filter(Boolean);

            // Save transaction record
            if (paymentIntentId) {
                try {
                    await saveTransaction({
                        stripe_payment_intent_id: paymentIntentId,
                        amount: totalPrice,
                        currency: 'amd',
                        ticket_ids: ticketIds,
                        metadata: {
                            seat_ids: selectedSeats.map(s => s.id).join(','),
                            showtime_id: showtimeId,
                        },
                    });
                } catch (txErr) {
                    console.warn('Transaction save failed:', txErr);
                }
            }

            window.dispatchEvent(new Event('authUpdate'));
            onSuccess(user?.email);
        } catch {
            onError(t('checkout.details.failed'));
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="stripe-payment-form">
            <PaymentElement
                options={{
                    layout: 'tabs',
                }}
            />
            <button
                type="submit"
                className="checkout-action-btn"
                disabled={!stripe || processing}
                style={{ marginTop: 24 }}
            >
                {processing ? t('checkout.details.processing') : t('checkout.details.payNow')}
            </button>
        </form>
    );
};

// ─── Main Checkout Page ───────────────────────────────────────────────────────
const CheckoutPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStatus();

    // Data passed from SeatsPage
    const stateData = location.state || {};
    const {
        selectedSeats = [],
        eventDetails = {},
        showtimeId,
        totalPrice = 0,
        ticketPrice = 0,
        isSpatial = false,
        reserved_until = null,   // passed when coming from the tickets page
    } = stateData;

    const [step, setStep] = useState(1); // 1: Tickets, 2: Payment Method, 3: Payment Details, 4: Review
    const [paymentMethod, setPaymentMethod] = useState('card');
    // If reserved_until was passed in, compute remaining seconds from it;
    // otherwise default to a fresh 10-minute hold.
    const computeInitialTime = () => {
        if (reserved_until) {
            const secs = Math.max(0, Math.floor((new Date(reserved_until) - Date.now()) / 1000));
            return secs;
        }
        return 10 * 60;
    };
    const [timeLeft, setTimeLeft] = useState(computeInitialTime);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const [loadingIntent, setLoadingIntent] = useState(false);

    const priceGroups = useMemo(() => {
        const groups = {};
        selectedSeats.forEach(s => {
            const price = isSpatial && s.section_price != null ? Number(s.section_price) : Number(ticketPrice);
            groups[price] = (groups[price] || 0) + 1;
        });
        return groups;
    }, [selectedSeats, isSpatial, ticketPrice]);

    useEffect(() => {
        if (!stateData.selectedSeats || stateData.selectedSeats.length === 0) {
            navigate('/');
        }
    }, [stateData, navigate]);

    const handleCancel = useCallback(async () => {
        try {
            const ticketIds = selectedSeats.map(s => s.reservedTicketId).filter(Boolean);
            if (ticketIds.length > 0) {
                const token = localStorage.getItem('authToken');
                await fetch('/api/tickets/cancel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ ticket_ids: ticketIds }),
                });
            }
        } catch (err) {
            console.error("Failed to cancel tickets", err);
        } finally {
            // Navigate back to the seats page
            const eventType = eventDetails?.type || 'movies';
            const eventId = eventDetails?.id;
            navigate(`/${eventType}/${eventId}/seats?showtime_id=${showtimeId}`);
        }
    }, [selectedSeats, eventDetails, showtimeId, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleCancel();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [handleCancel]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return {
            m1: Math.floor(m / 10).toString(),
            m2: (m % 10).toString(),
            s1: Math.floor(s / 10).toString(),
            s2: (s % 10).toString(),
        };
    };

    const timeParts = formatTime(timeLeft);

    const handleConfirmTickets = () => setStep(2);

    const handleConfirmPaymentMethod = async () => {
        // Create PaymentIntent on the server when user confirms payment method
        setLoadingIntent(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch('/api/payment/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    amount: totalPrice,
                    currency: 'amd',
                    metadata: {
                        seat_ids: selectedSeats.map(s => s.id).join(','),
                        showtime_id: showtimeId,
                    },
                }),
            });

            if (!res.ok) throw new Error('Failed to initialize payment.');
            const data = await res.json();
            setClientSecret(data.client_secret);
            setPaymentIntentId(data.payment_intent_id);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingIntent(false);
        }
    };

    const handleReviewOrder = () => setStep(4);

    const handlePaySuccess = (email) => {
        navigate('/checkout/success', { state: { email: email || user?.email || 'guest@example.com' } });
    };

    const handlePayError = (msg) => setError(msg);

    if (!stateData.selectedSeats || stateData.selectedSeats.length === 0) return null;

    const stripeAppearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#b44dff',
            colorBackground: '#111116',
            colorText: '#ffffff',
            colorDanger: '#ff4d4d',
            fontFamily: 'Inter, sans-serif',
            borderRadius: '8px',
        },
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white font-mulish pt-24 pb-12 px-4 md:px-[5%]">
            {/* Progress Bar */}
            <div className="max-w-7xl mx-auto mb-12 overflow-x-auto">
                <div className="flex items-center justify-center gap-4 md:gap-8 min-w-max pb-4">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all border ${step >= 1 ? 'bg-purple-500/10 border-purple-500/30 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`} onClick={() => step > 1 && setStep(1)}>
                        <Ticket size={18} className={step >= 1 ? 'text-purple-400' : ''} />
                        <span className="text-sm font-semibold whitespace-nowrap">{t('checkout.steps.tickets')}</span>
                    </div>
                    <div className="text-gray-700">
                        <Check size={16} />
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all border ${step >= 2 ? 'bg-purple-500/10 border-purple-500/30 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`} onClick={() => step > 2 && setStep(2)}>
                        <CreditCard size={18} className={step >= 2 ? 'text-purple-400' : ''} />
                        <span className="text-sm font-semibold whitespace-nowrap">{t('checkout.steps.payment')}</span>
                    </div>
                    <div className="text-gray-700">
                        <Check size={16} />
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all border ${step >= 4 ? 'bg-purple-500/10 border-purple-500/30 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                        <ShieldCheck size={18} className={step >= 4 ? 'text-purple-400' : ''} />
                        <span className="text-sm font-semibold whitespace-nowrap">{t('checkout.steps.review')}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
                {/* Left: Event Card Summary */}
                <aside className="order-2 lg:order-1">
                    <div className="bg-[#161616] border border-white/5 rounded-3xl overflow-hidden sticky top-24">
                        <div className="relative h-64 lg:h-96">
                            <img
                                src={eventDetails?.poster_url || '/images/default-hero.jpg'}
                                alt="Event"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
                        </div>
                        <div className="p-6 lg:p-8 -mt-20 relative z-10">
                            <h2 className="font-poppins text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                                {eventDetails?.title || 'Event'}
                            </h2>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-gray-400 text-sm">
                                    <Calendar size={16} className="text-purple-500" />
                                    <span>{eventDetails?.date || 'Date'} • {eventDetails?.time || 'Time'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400 text-sm">
                                    <MapPin size={16} className="text-purple-500" />
                                    <span>{eventDetails?.location || 'Venue'}</span>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">{t('seats.hero.section')}</span>
                                    <span className="font-bold text-purple-400">{isSpatial ? selectedSeats[0]?.section_label || 'A' : 'VIP'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">{t('seats.hero.row')}</span>
                                    <span className="font-bold">{isSpatial ? selectedSeats[0]?.row : '1'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">{t('seats.sidebar.seats')}</span>
                                    <span className="font-bold">{selectedSeats.map(s => s.number).join(', ')}</span>
                                </div>
                                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs">
                                        <Check size={14} />
                                        <span>{t('user.tickets.count', { count: selectedSeats.length })}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 italic">Seated together</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right: Checkout Steps */}
                <main className="order-1 lg:order-2 space-y-6">
                    {/* Timer Banner */}
                    <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl font-mono font-bold">{timeParts.m1}</div>
                            <div className="w-10 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl font-mono font-bold">{timeParts.m2}</div>
                            <span className="text-2xl font-bold animate-pulse text-purple-500">:</span>
                            <div className="w-10 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl font-mono font-bold">{timeParts.s1}</div>
                            <div className="w-10 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl font-mono font-bold">{timeParts.s2}</div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="font-poppins font-bold text-white mb-1 uppercase tracking-wider text-xs">{t('checkout.timer.left')}</h4>
                            <p className="text-gray-400 text-xs">{t('checkout.timer.subtitle')}</p>
                        </div>
                        <button 
                            className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-semibold transition-colors bg-red-500/10 px-4 py-2 rounded-full"
                            onClick={handleCancel}
                        >
                            <X size={16} />
                            {t('checkout.timer.cancel')}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm animate-shake">
                            <ShieldCheck size={18} />
                            {error}
                        </div>
                    )}

                    <div className="bg-[#161616] border border-white/5 rounded-3xl p-6 lg:p-10 shadow-2xl">
                        {/* Step 1: Tickets Review */}
                        {step === 1 && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                    <h3 className="font-poppins text-xl font-bold">{t('checkout.tickets.subtitle')}</h3>
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400 text-sm">{t('checkout.tickets.quantity')}</span>
                                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl font-bold">{selectedSeats.length}</div>
                                    </div>
                                </div>
                                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]" onClick={handleConfirmTickets}>
                                    {t('checkout.tickets.confirm')}
                                </button>
                                <TrustBadges t={t} />
                            </div>
                        )}

                        {/* Step 2: Payment Method */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <h3 className="font-poppins text-xl font-bold">{t('checkout.payment.title')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        className={`group relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                                <CreditCard size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold">{t('checkout.payment.card')}</p>
                                                <p className="text-xs text-gray-500">Fast & Secure</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`group relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'stripe' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                                        onClick={() => setPaymentMethod('stripe')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'stripe' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                                <Banknote size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold">{t('checkout.payment.stripe')}</p>
                                                <p className="text-xs text-gray-500">Direct Checkout</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
                                    onClick={handleConfirmPaymentMethod}
                                    disabled={loadingIntent}
                                >
                                    {loadingIntent ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            {t('common.loading')}
                                        </div>
                                    ) : t('checkout.payment.confirm')}
                                </button>
                                <TrustBadges t={t} />
                            </div>
                        )}

                        {/* Step 3: Payment Details */}
                        {step === 3 && clientSecret && (
                            <div className="space-y-8 animate-fadeIn">
                                <div>
                                    <h3 className="font-poppins text-xl font-bold mb-6">{t('checkout.summary.title')}</h3>
                                    <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                                        {Object.entries(priceGroups).map(([price, count]) => (
                                            <div className="flex justify-between text-sm" key={price}>
                                                <span className="text-gray-400">{t('checkout.summary.ticketPrice')}</span>
                                                <span className="font-medium">{count} × {price}֏</span>
                                            </div>
                                        ))}
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="font-bold text-lg">{t('checkout.summary.totalPrice')}</span>
                                            <span className="text-2xl font-bold text-purple-400 font-poppins">{totalPrice}֏</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-poppins text-xl font-bold mb-6">{t('checkout.details.title')}</h3>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                                            <StripePaymentForm
                                                onSuccess={handlePaySuccess}
                                                onError={handlePayError}
                                                selectedSeats={selectedSeats}
                                                showtimeId={showtimeId}
                                                ticketPrice={ticketPrice}
                                                isSpatial={isSpatial}
                                                totalPrice={totalPrice}
                                                user={user}
                                                paymentIntentId={paymentIntentId}
                                            />
                                        </Elements>
                                    </div>
                                </div>

                                <TrustBadges t={t} />
                            </div>
                        )}

                        {/* Step 4: Review Order */}
                        {step === 4 && (
                            <div className="space-y-8">
                                <h3 className="font-poppins text-xl font-bold mb-6">Review Information</h3>
                                <div className="space-y-4 bg-white/5 rounded-2xl p-6">
                                    <div className="flex items-center gap-4 p-3 border-b border-white/5">
                                        <User size={20} className="text-purple-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Full Name</p>
                                            <p className="font-bold">{user?.name || 'Guest User'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 border-b border-white/5">
                                        <Mail size={20} className="text-purple-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Email Address</p>
                                            <p className="font-bold">{user?.email || 'guest@example.com'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-3">
                                        <Phone size={20} className="text-purple-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Phone Number</p>
                                            <p className="font-bold">{user?.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        className="flex-1 border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-2xl transition-all"
                                        onClick={() => setStep(3)}
                                    >
                                        {t('checkout.review.back')}
                                    </button>
                                </div>
                                <TrustBadges t={t} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

// ─── Reusable trust badges ────────────────────────────────────────────────────
const TrustBadges = ({ t }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} className="text-green-500" />
            </div>
            <div>
                <h5 className="font-bold text-xs uppercase text-white mb-1 tracking-tight">{t('checkout.trust.fanProtect')}</h5>
                <p className="text-[11px] text-gray-500 leading-relaxed">Secure transaction guaranteed.</p>
            </div>
        </div>
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Banknote size={20} className="text-purple-500" />
            </div>
            <div>
                <h5 className="font-bold text-xs uppercase text-white mb-1 tracking-tight">{t('checkout.trust.refundTitle')}</h5>
                <p className="text-[11px] text-gray-500 leading-relaxed">{t('checkout.trust.refundText')}</p>
            </div>
        </div>
    </div>
);

export default CheckoutPage;
