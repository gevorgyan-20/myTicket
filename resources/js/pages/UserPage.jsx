import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus';
import { logout, updateProfile } from '../api/AuthService';
import { getUserTickets } from '../api/ticketService';
import { getUserTransactions, requestRefund } from '../api/paymentService';
import { ChevronDown, ChevronUp, Phone } from 'lucide-react';
import {
  Ticket,
  User,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ArrowRight,
  Pencil,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Hash,
  House,
  X,
  Timer,
  Check,
  Banknote,
} from 'lucide-react';

const AUTH_EVENT = 'authChange';

// ── Live countdown for reserved tickets ────────────────────────────────────
const ReservedCountdown = ({ reservedUntil, onExpire }) => {
  const calcSecsLeft = () => Math.max(0, Math.floor((new Date(reservedUntil) - Date.now()) / 1000));
  const [secsLeft, setSecsLeft] = useState(calcSecsLeft);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const s = calcSecsLeft();
      setSecsLeft(s);
      if (s <= 0) {
        clearInterval(timerRef.current);
        if (onExpire) onExpire();
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [reservedUntil, onExpire]);

  if (secsLeft <= 0) return <span className="reserved-countdown expired">{t('user.tickets.expired')}</span>;

  const m = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const s = String(secsLeft % 60).padStart(2, '0');
  return (
    <span className={`reserved-countdown ${secsLeft < 60 ? 'urgent' : ''}`}>
      <Timer className="w-4 h-4 inline-block mr-1" /> {m}:{s} {t('user.tickets.left')}
    </span>
  );
};


const UserPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStatus();
  
  const COUNTRY_CODES = useMemo(() => [
    { code: '+374', flag: '🇦🇲', name: t('countries.armenia') },
    { code: '+7', flag: '🇷🇺', name: t('countries.russia') },
    { code: '+1', flag: '🇺🇸', name: t('countries.usa') },
    { code: '+971', flag: '🇦🇪', name: t('countries.uae') },
    { code: '+995', flag: '🇬🇪', name: t('countries.georgia') },
    { code: '+380', flag: '🇺🇦', name: t('countries.ukraine') },
  ], [t]);

  const TABS = useMemo(() => [
    { id: 'tickets', label: t('user.tabs.tickets'), icon: Ticket },
    { id: 'personal', label: t('user.tabs.personal'), icon: User },
    { id: 'payment', label: t('user.tabs.payment'), icon: CreditCard },
    { id: 'notification', label: t('user.tabs.notification'), icon: Bell },
    { id: 'setting', label: t('user.tabs.setting'), icon: Settings },
  ], [t]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketFilter, setTicketFilter] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Refund state
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [showRefundSelect, setShowRefundSelect] = useState(false);
  const [refundGroup, setRefundGroup] = useState(null);
  const [refundSelected, setRefundSelected] = useState([]);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState(null);

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+374',
    phone: '',
  });
  const [personalEditing, setPersonalEditing] = useState(false);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [personalLoading, setPersonalLoading] = useState(false);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === personalForm.phoneCode) || COUNTRY_CODES[0];

  const syncPersonalFormFromUser = () => {
    const parts = (user?.name || '').trim().split(/\s+/);
    setPersonalForm({
      firstName: user?.name ?? parts[0] ?? '',
      lastName: user?.last_name ?? (parts.length > 1 ? parts.slice(1).join(' ') : ''),
      email: user?.email ?? '',
      phoneCode: user?.phone_code ?? '+374',
      phone: user?.phone ?? '',
    });
  };

  useEffect(() => {
    if (user && activeTab === 'personal') syncPersonalFormFromUser();
  }, [user, activeTab]);

  const handlePersonalDiscard = () => {
    syncPersonalFormFromUser();
    setPersonalEditing(false);
  };

  const handlePersonalSave = async () => {
    try {
      setPersonalLoading(true);
      await updateProfile({
        name: personalForm.firstName,
        last_name: personalForm.lastName,
        email: personalForm.email,
        phone_code: personalForm.phoneCode,
        phone: personalForm.phone,
      });
      
      window.dispatchEvent(new Event(AUTH_EVENT));
      setPersonalEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert(t('user.personal.failed'));
    } finally {
      setPersonalLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.dispatchEvent(new Event(AUTH_EVENT));
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/', { replace: true });
    }
  };

  const fetchTickets = () => {
    setTicketsLoading(true);
    getUserTickets()
      .then((res) => setTickets(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setTickets([]))
      .finally(() => setTicketsLoading(false));
  };

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    }
    if (activeTab === 'payment') {
      setTransactionsLoading(true);
      getUserTransactions()
        .then((res) => setTransactions(Array.isArray(res?.data) ? res.data : []))
        .catch(() => setTransactions([]))
        .finally(() => setTransactionsLoading(false));
    }
  }, [activeTab]);

  const handleOpenRefund = (group) => {
    setRefundGroup(group);
    setRefundError(null);
    setShowRefundConfirm(true);
  };

  const handleRefundConfirmed = () => {
    setShowRefundConfirm(false);
    // Pre-select only non-refunded tickets
    const eligible = (refundGroup?.allTickets || []).filter(t => t.status !== 'refunded');
    setRefundSelected(eligible.map(t => t.id));
    setShowRefundSelect(true);
  };

  const toggleRefundTicket = (id) => {
    setRefundSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllRefund = (eligible) => {
    if (refundSelected.length === eligible.length) {
      setRefundSelected([]);
    } else {
      setRefundSelected(eligible.map(t => t.id));
    }
  };

  const handleSubmitRefund = async () => {
    if (!refundSelected.length) return;
    setRefundLoading(true);
    setRefundError(null);
    try {
      const paymentIntentId = refundGroup?.allTickets?.[0]?.stripe_payment_intent_id;
      const refundAmount = refundGroup?.allTickets
        .filter(t => refundSelected.includes(t.id))
        .reduce((sum, t) => sum + parseFloat(t.price || 0), 0);

      await requestRefund({
        stripe_payment_intent_id: paymentIntentId,
        ticket_ids: refundSelected,
        refund_amount: refundAmount,
      });

      setShowRefundSelect(false);
      setRefundGroup(null);
      // Refresh tickets
      const res = await getUserTickets();
      setTickets(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setRefundError(err?.response?.data?.message || 'Refund failed. Please try again.');
    } finally {
      setRefundLoading(false);
    }
  };

  const groupedTickets = useMemo(() => {
    if (!tickets.length) return [];
    
    const groups = {};
    tickets.forEach(ticket => {
      const date = new Date(ticket.created_at);
      const timestamp = Math.floor(date.getTime() / (120 * 1000));
      const key = `${ticket.showtime_id}_${timestamp}`;
      
      if (!groups[key]) {
        groups[key] = {
          ...ticket,
          displayId: ticket.order_id || ticket.id,
          quantity: 1,
          total_paid: parseFloat(ticket.price || 0),
          allTickets: [ticket]
        };
      } else {
        groups[key].quantity += 1;
        groups[key].total_paid += parseFloat(ticket.price || 0);
        groups[key].allTickets.push(ticket);
      }
    });

    // Derive a meaningful status from all tickets in the group
    Object.values(groups).forEach(group => {
      const all = group.allTickets;
      const refundedCount  = all.filter(t => t.status === 'refunded').length;
      const reservedCount  = all.filter(t => t.status === 'reserved').length;
      const canceledCount  = all.filter(t => t.status === 'canceled').length;

      if (refundedCount === all.length) {
        group.status = 'refunded';
      } else if (refundedCount > 0) {
        group.status = 'partial_refund';
      } else if (canceledCount === all.length) {
        group.status = 'canceled';
      } else if (reservedCount > 0) {
        group.status = 'reserved';
        // Pick the earliest (soonest-expiring) reserved_until across all reserved tickets
        const expiries = all
          .filter(t => t.status === 'reserved' && t.reserved_until)
          .map(t => new Date(t.reserved_until));
        group.reserved_until = expiries.length ? new Date(Math.min(...expiries)).toISOString() : null;
      } else {
        group.status = all[0]?.status || 'buy';
      }
    });

    
    return Object.values(groups).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [tickets]);

  const filteredGroups = useMemo(() => {
    if (ticketFilter === 'all') return groupedTickets;
    return groupedTickets.filter(group => {
      if (ticketFilter === 'pending') return group.status === 'reserved';
      if (ticketFilter === 'canceled') return ['canceled', 'refunded'].includes(group.status);
      if (ticketFilter === 'completed') return ['buy', 'partial_refund'].includes(group.status);
      return true;
    });
  }, [groupedTickets, ticketFilter]);

  const counts = useMemo(() => {
    return {
      all: tickets.length,
      pending: tickets.filter(t => t.status === 'reserved').length,
      canceled: tickets.filter(t => t.status === 'canceled' || t.status === 'refunded').length,
      completed: tickets.filter(t => t.status === 'buy').length,
    };
  }, [tickets]);


  const handleShowDetails = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const handleContinueReservation = (group) => {
    // Reconstruct the checkout state from the reserved ticket data
    const firstTicket = group.allTickets[0];
    const showtimeId  = firstTicket?.showtime_id;
    const isSpatial   = firstTicket?.seat?.is_spatial ?? false;
    const ticketPrice = parseFloat(firstTicket?.price || 0);

    const selectedSeats = group.allTickets
      .filter(t => t.status === 'reserved')
      .map(t => ({
        id: t.seat_id,
        ...(t.seat || {}),
        reservedTicketId: t.id,
        section_price: t.seat?.section_price ?? null,
      }));

    const eventDetails = {
      title:    group.event_title,
      date:     firstTicket?.showtime?.start_time
                  ? new Date(firstTicket.showtime.start_time).toLocaleDateString()
                  : '',
      time:     firstTicket?.showtime?.start_time
                  ? new Date(firstTicket.showtime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '',
      location: firstTicket?.showtime?.venue?.name || '',
      poster_url: firstTicket?.showtime?.showtimeable?.poster_url || '',
    };

    navigate('/checkout', {
      state: {
        selectedSeats,
        eventDetails,
        showtimeId,
        totalPrice: group.total_paid,
        ticketPrice,
        isSpatial,
        reserved_until: group.reserved_until,   // carry over actual expiry
      },
    });
  };

  const [cancelingId, setCancelingId] = useState(null);

  const handleCancelReservation = async (group) => {
    setCancelingId(group.id);
    try {
      const token = localStorage.getItem('authToken');
      const reserved = group.allTickets.filter(t => t.status === 'reserved');

      await Promise.all(
        reserved.map(ticket =>
          fetch(`/api/tickets/${ticket.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          })
        )
      );

      // Refresh ticket list
      const res = await getUserTickets();
      setTickets(Array.isArray(res?.data) ? res.data : []);
    } catch {
      // silently fail — lazy cleanup will handle it on next load
    } finally {
      setCancelingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">{t('common.loadingDots')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-mulish flex flex-col lg:flex-row">
      <SEO title={t('header.profile')} />
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#141414] sticky top-0 z-40">
        <Link to="/" className="text-purple-500 font-poppins font-bold text-xl">MyTicket</Link>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white/5 rounded-lg border border-white/10"
        >
          {sidebarOpen ? <X size={20} /> : <Settings size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 bg-[#141414] border-r border-white/5 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0 lg:w-72 ${sidebarOpen ? 'w-full translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-center py-8 border-b border-white/5">
          <Link to="/" className="font-poppins font-bold text-purple-500 text-2xl transition-all">
            MyTicket
          </Link>
          {/* Close button only for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden mt-4 p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar no-scrollbar-mobile">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${activeTab === id ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300 border border-transparent'}`}
            >
              <Icon size={22} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold text-sm whitespace-nowrap">{label}</span>
              {activeTab === id && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group"
          >
            <LogOut size={22} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold text-sm">{t('user.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pt-6 lg:pt-0">
        {activeTab === 'tickets' && (
          <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto p-6 lg:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h1 className="font-poppins text-3xl font-bold">{t('user.tabs.tickets')}</h1>
              <div className="flex bg-[#161616] p-1 rounded-2xl border border-white/5 overflow-x-auto custom-scrollbar no-scrollbar-mobile">
                <div className="flex min-w-max">
                  {[
                    { id: 'all', label: t('user.tickets.all'), count: counts.all },
                    { id: 'pending', label: t('user.tickets.pending'), count: counts.pending },
                    { id: 'completed', label: t('user.tickets.completed'), count: counts.completed },
                    { id: 'canceled', label: t('user.tickets.canceled'), count: counts.canceled }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setTicketFilter(tab.id)}
                      className={`px-4 md:px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-xs md:text-sm ${ticketFilter === tab.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {tab.label} <span className="ml-1 opacity-50">{tab.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {ticketsLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-gray-500 text-sm font-medium">{t('user.tickets.loading')}</p>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="bg-[#161616] border border-white/5 rounded-[40px] p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                  <ShoppingCart size={40} className="text-gray-600" />
                </div>
                <h2 className="font-poppins text-2xl font-bold mb-3">{t('user.tickets.empty.title')}</h2>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">{t('user.tickets.empty.subtitle')}</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-95">
                  {t('user.tickets.empty.button')}
                  <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredGroups.map(group => (
                  <div 
                    key={group.id}
                    className={`bg-[#161616] border border-white/5 rounded-3xl p-6 transition-all hover:border-purple-500/30 group relative overflow-hidden ${group.status === 'reserved' ? 'border-amber-500/30' : ''}`}
                  >
                    {/* Decorative Background Glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 ${group.status === 'reserved' ? 'bg-amber-500' : 'bg-purple-500'}`} />

                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 relative z-10">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-poppins text-xl font-bold tracking-tight">{group.event_title || t('user.modal.event')}</h3>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            group.status === 'buy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            group.status === 'reserved' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-white/5 text-gray-500 border border-white/10'
                          }`}>
                            {t(`user.tickets.${group.status === 'buy' ? 'completed' : group.status === 'reserved' ? 'pending' : group.status}`)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                            <Hash size={12} className="text-purple-500" />
                            <span className="font-mono">{group.displayId}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-purple-500" />
                            <span>{new Date(group.order_date || group.created_at).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Ticket size={12} className="text-purple-500" />
                            <span className="font-bold text-gray-300">{t('user.tickets.count', { count: group.quantity })}</span>
                          </div>
                          {group.status !== 'reserved' && (
                            <div className="font-bold text-white text-sm ml-auto">
                              ֏{group.total_paid.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
                        {group.status === 'buy' && (
                          <button
                            onClick={() => handleOpenRefund(group)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
                          >
                            {t('user.tickets.refund')}
                          </button>
                        )}
                        <button
                          onClick={() => handleShowDetails(group)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                          {t('user.tickets.details')}
                        </button>
                      </div>
                    </div>

                    {group.status === 'reserved' && group.reserved_until && (
                      <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4">
                        <div className="bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
                          <ReservedCountdown 
                            reservedUntil={group.reserved_until} 
                            onExpire={fetchTickets}
                          />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto ml-auto">
                          <button
                            onClick={() => handleCancelReservation(group)}
                            disabled={cancelingId === group.id}
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold text-gray-400 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                          >
                            {cancelingId === group.id ? '...' : t('user.tickets.cancel')}
                          </button>
                          <button
                            onClick={() => handleContinueReservation(group)}
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all"
                          >
                            {t('user.tickets.payNow')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="max-w-3xl space-y-12 animate-fadeIn max-w-6xl mx-auto p-6 lg:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-8 bg-[#161616] p-8 lg:p-10 rounded-[40px] border border-white/5 relative overflow-hidden text-center sm:text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px]" />
              <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-purple-500 to-blue-500 p-1 shrink-0 relative z-10 mx-auto sm:mx-0">
                <div className="w-full h-full rounded-[38px] bg-[#161616] flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-poppins font-bold text-purple-400">
                      {(personalForm.firstName || user?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 relative z-10">
                <h1 className="font-poppins text-3xl font-bold mb-2">
                  {t('user.personal.greeting', { name: personalForm.firstName || user?.name || t('user.personal.anonymous') })}
                </h1>
                <p className="text-gray-400 text-sm font-medium mb-6">{user?.email || personalForm.email}</p>
                <button
                  onClick={() => setPersonalEditing(!personalEditing)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <Pencil size={16} className="text-purple-400" />
                  {personalEditing ? t('user.personal.discard') : t('user.personal.edit')}
                </button>
              </div>
            </div>

            <div className={`space-y-8 bg-[#161616] p-8 lg:p-10 rounded-[40px] border border-white/5 transition-all ${!personalEditing ? 'opacity-80' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('user.personal.firstName')}</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      value={personalForm.firstName}
                      onChange={(e) => setPersonalForm(p => ({ ...p, firstName: e.target.value }))}
                      readOnly={!personalEditing}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('user.personal.lastName')}</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      value={personalForm.lastName}
                      onChange={(e) => setPersonalForm(p => ({ ...p, lastName: e.target.value }))}
                      readOnly={!personalEditing}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('user.personal.email')}</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="email"
                      value={personalForm.email}
                      onChange={(e) => setPersonalForm(p => ({ ...p, email: e.target.value }))}
                      readOnly={!personalEditing}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('user.personal.phone')}</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative shrink-0">
                      <button 
                        disabled={!personalEditing}
                        onClick={() => setShowPhoneDropdown(!showPhoneDropdown)}
                        className="flex items-center gap-2 w-full sm:w-auto h-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 hover:bg-white/10 transition-all disabled:opacity-50"
                      >
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="font-bold text-sm">{selectedCountry.code}</span>
                        <ChevronDown size={14} className="text-gray-500 ml-auto sm:ml-0" />
                      </button>
                      {showPhoneDropdown && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowPhoneDropdown(false)} />
                          <div className="absolute top-full mt-2 left-0 z-50 bg-[#1A1A1A] border border-white/10 rounded-2xl p-2 w-56 shadow-2xl overflow-hidden max-h-64 overflow-y-auto animate-fadeIn">
                            {COUNTRY_CODES.map(c => (
                              <button
                                key={c.code}
                                onClick={() => {
                                  setPersonalForm(p => ({ ...p, phoneCode: c.code }));
                                  setShowPhoneDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left"
                              >
                                <span className="text-lg">{c.flag}</span>
                                <span className="flex-1 text-sm font-medium">{c.name}</span>
                                <span className="text-xs text-gray-500">{c.code}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="relative flex-1">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="tel"
                        value={personalForm.phone}
                        onChange={(e) => setPersonalForm(p => ({ ...p, phone: e.target.value }))}
                        readOnly={!personalEditing}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {personalEditing && (
                <div className="flex justify-end pt-6 border-t border-white/5">
                  <button 
                    onClick={handlePersonalSave}
                    disabled={personalLoading}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-10 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-95 disabled:opacity-50"
                  >
                    {personalLoading ? t('common.saving') : t('user.personal.save')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {(activeTab === 'payment') && (
          <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto p-6 lg:p-12">
            <h1 className="font-poppins text-3xl font-bold">{t('user.payment.history')}</h1>
            {transactionsLoading ? (
              <div className="flex justify-center py-24"><div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" /></div>
            ) : transactions.length === 0 ? (
              <div className="bg-[#161616] border border-white/5 rounded-[40px] p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                  <CreditCard size={40} className="text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">{t('user.payment.noTransactions')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map(tx => (
                  <div key={tx.id} className="bg-[#161616] border border-white/5 p-6 rounded-3xl flex items-center justify-between transition-all hover:border-white/10 group">
                    <div className="space-y-1">
                      <p className="font-mono text-sm text-purple-400 font-bold">#{tx.stripe_payment_intent_id?.slice(-12)}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">֏{parseFloat(tx.amount).toLocaleString()}</p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${tx.status === 'succeeded' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {t(`user.tickets.${tx.status === 'succeeded' ? 'completed' : tx.status}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === 'notification' || activeTab === 'setting') && (
          <div className="py-24 text-center animate-fadeIn max-w-6xl mx-auto p-6 lg:p-12">
            <div className="w-20 h-20 bg-white/5 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-white/5">
              {activeTab === 'notification' ? <Bell size={32} className="text-gray-600" /> : <Settings size={32} className="text-gray-600" />}
            </div>
            <h2 className="font-poppins text-2xl font-bold mb-2">{t('common.comingSoon')}</h2>
            <p className="text-gray-500 max-w-xs mx-auto font-medium">
              {activeTab === 'notification' ? t('user.tabs.notificationPlaceholder') : t('user.tabs.settingPlaceholder')}
            </p>
          </div>
        )}
      </main>

      {/* ── Ticket Details Modal ── */}
      {showModal && selectedGroup && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowModal(false)}>
          <div className="bg-[#161616] border border-white/10 w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-poppins text-2xl font-bold">{t('user.modal.orderDetails')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-400 font-poppins">{selectedGroup.event_title}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-black">{t('user.modal.date')}</p>
                    <p className="text-sm font-bold">{selectedGroup.showtime?.start_time ? new Date(selectedGroup.showtime.start_time).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-black">{t('user.modal.venue')}</p>
                    <p className="text-sm font-bold truncate">{selectedGroup.showtime?.venue?.name || '—'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('user.modal.tickets')}</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedGroup.allTickets.map(tk => (
                    <div key={tk.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500 mr-2">{t('user.modal.seat')}</span>
                        <span className="font-bold">{tk.seat?.number || '—'}</span>
                        <span className="text-gray-500 mx-2">/</span>
                        <span className="text-gray-500 mr-2">{t('user.modal.row')}</span>
                        <span className="font-bold">{tk.seat?.row || '—'}</span>
                      </div>
                      <span className="font-bold text-emerald-400 text-sm">֏{parseFloat(tk.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <p className="font-poppins text-lg font-bold">{t('user.modal.totalAmount')}</p>
                <p className="text-2xl font-bold text-purple-400 font-poppins">֏{selectedGroup.total_paid.toLocaleString()}</p>
              </div>
            </div>
            <div className="p-8 bg-[#111111] border-t border-white/5 text-center">
              <button onClick={() => setShowModal(false)} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all active:scale-95">{t('user.modal.closeDetails')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Refund Confirmation Modal ── */}
      {showRefundConfirm && refundGroup && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowRefundConfirm(false)}>
          <div className="bg-[#161616] border border-white/10 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Banknote size={32} className="text-red-500" />
              </div>
              <h2 className="font-poppins text-2xl font-bold">{t('user.modal.confirmRefund')}</h2>
              <p className="text-gray-400">
                {t('user.modal.refundPrompt', { event: refundGroup.event_title || t('user.modal.event') })}
              </p>
              <p className="text-xs text-gray-500">{t('user.modal.refundHint')}</p>
            </div>
            <div className="p-8 flex flex-col sm:flex-row gap-3 bg-[#111111] border-t border-white/5">
              <button 
                onClick={() => setShowRefundConfirm(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all active:scale-95"
              >
                {t('common.cancel')}
              </button>
              <button 
                onClick={handleRefundConfirmed}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-900/20 active:scale-95"
              >
                {t('common.continue')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Refund Seat Selection Modal ── */}
      {showRefundSelect && refundGroup && (() => {
        const eligible = refundGroup.allTickets.filter(tk => tk.status !== 'refunded');
        const selectedRefundAmount = refundGroup.allTickets
          .filter(tk => refundSelected.includes(tk.id))
          .reduce((sum, tk) => sum + parseFloat(tk.price || 0), 0);
        return (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowRefundSelect(false)}>
            <div className="bg-[#161616] border border-white/10 w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-poppins text-2xl font-bold">{t('user.modal.selectTickets')}</h2>
                <button onClick={() => setShowRefundSelect(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={24} /></button>
              </div>
              
              <div className="p-8 space-y-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${refundSelected.length === eligible.length ? 'bg-purple-600 border-purple-600' : 'border-white/10 group-hover:border-purple-500/50'}`}>
                    {refundSelected.length === eligible.length && <Check size={14} className="text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={refundSelected.length === eligible.length}
                    onChange={() => handleSelectAllRefund(eligible)}
                  />
                  <span className="font-bold text-sm">{t('user.modal.selectAll', { count: eligible.length })}</span>
                </label>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {eligible.map((tk) => (
                    <label key={tk.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${refundSelected.includes(tk.id) ? 'bg-purple-600/10 border-purple-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${refundSelected.includes(tk.id) ? 'bg-purple-600 border-purple-600' : 'border-white/20'}`}>
                          {refundSelected.includes(tk.id) && <Check size={12} className="text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={refundSelected.includes(tk.id)}
                          onChange={() => toggleRefundTicket(tk.id)}
                        />
                        <span className="text-sm font-bold">
                          {tk.seat?.is_spatial ? tk.seat.label : `${t('user.modal.row')} ${tk.seat?.row}, ${t('user.modal.seat')} ${tk.seat?.number}`}
                        </span>
                      </div>
                      <span className="font-bold text-gray-400 text-sm">֏{parseFloat(tk.price).toLocaleString()}</span>
                    </label>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <p className="font-poppins font-bold text-gray-500">{t('user.modal.refundAmount')}</p>
                  <p className="text-xl font-bold text-white">֏{selectedRefundAmount.toLocaleString()}</p>
                </div>

                {refundError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold">
                    {refundError}
                  </div>
                )}
              </div>

              <div className="p-8 bg-[#111111] border-t border-white/5 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowRefundSelect(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSubmitRefund}
                  disabled={refundLoading || !refundSelected.length}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 active:scale-95"
                >
                  {refundLoading ? t('common.saving') : `${t('user.tickets.refund')} (${refundSelected.length})`}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.4); }
        @media (max-width: 1023px) {
          .no-scrollbar-mobile::-webkit-scrollbar { display: none; }
          .no-scrollbar-mobile { -ms-overflow-style: none; scrollbar-width: none; }
        }
      `}} />
    </div>
  );
};

export default UserPage;
