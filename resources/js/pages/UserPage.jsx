import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus';
import { logout } from '../api/AuthService';
import { getUserTickets } from '../api/ticketService';
import {
  Ticket,
  User,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Trophy,
  Sparkles,
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
} from 'lucide-react';

const AUTH_EVENT = 'authChange';

const TABS = [
  { id: 'tickets', label: 'Tickets', icon: Ticket },
  { id: 'personal', label: 'Personal info', icon: User },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'notification', label: 'Notification', icon: Bell },
  { id: 'setting', label: 'Setting', icon: Settings },
];

const UserPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStatus();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  const [personalForm, setPersonalForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    state: '',
    city: '',
    dateOfBirth: '',
    phoneCountry: '+1',
    phoneNumber: '',
    zipCode: '',
  });
  const [personalEditing, setPersonalEditing] = useState(false);

  const syncPersonalFormFromUser = () => {
    const parts = (user?.name || '').trim().split(/\s+/);
    setPersonalForm({
      firstName: user?.first_name ?? parts[0] ?? '',
      lastName: user?.last_name ?? (parts.length > 1 ? parts.slice(1).join(' ') : ''),
      email: user?.email ?? '',
      state: user?.state ?? '',
      city: user?.city ?? '',
      dateOfBirth: user?.date_of_birth ?? '',
      phoneCountry: '+1',
      phoneNumber: user?.phone ?? '',
      zipCode: user?.zip_code ?? '',
    });
  };

  useEffect(() => {
    if (user && activeTab === 'personal') syncPersonalFormFromUser();
  }, [user, activeTab]);

  const handlePersonalDiscard = () => {
    syncPersonalFormFromUser();
    setPersonalEditing(false);
  };

  const handlePersonalSave = () => {
    setPersonalEditing(false);
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

  useEffect(() => {
    if (activeTab === 'tickets') {
      setTicketsLoading(true);
      getUserTickets()
        .then((res) => setTickets(Array.isArray(res?.data) ? res.data : []))
        .catch(() => setTickets([]))
        .finally(() => setTicketsLoading(false));
    }
  }, [activeTab]);

  if (isLoading) {
    return <div className="user-page-loading">Loading...</div>;
  }

  return (
    <div className="user-page">
      <aside className={`user-page-sidebar ${sidebarOpen ? 'user-page-sidebar--open' : 'user-page-sidebar--closed'}`}>
        <div className="user-page-sidebar-header">
          <Link to="/" className="user-page-logo">
            <House className="w-6 h-6" />
          </Link>
          <button
            type="button"
            className="user-page-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        <nav className="user-page-nav">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`user-page-nav-item ${activeTab === id ? 'user-page-nav-item--active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <span className="user-page-nav-item-bar" />
              <Icon className="user-page-nav-item-icon" />
              {sidebarOpen && <span className="user-page-nav-item-label">{label}</span>}
            </button>
          ))}
          <button
            type="button"
            className="user-page-nav-item user-page-nav-item--logout"
            onClick={handleLogout}
          >
            <span className="user-page-nav-item-bar" />
            <LogOut className="user-page-nav-item-icon" />
            {sidebarOpen && <span className="user-page-nav-item-label">Log out</span>}
          </button>
        </nav>

        {sidebarOpen && (
          <div className="user-page-upgrade">
            <Trophy className="user-page-upgrade-icon" />
            <h3 className="user-page-upgrade-title">Upgrade your plan</h3>
            <p className="user-page-upgrade-desc">Unlock additional features enhanced capabilities</p>
            <button type="button" className="user-page-upgrade-btn">
              <Sparkles className="w-4 h-4" />
              See plans
            </button>
          </div>
        )}
      </aside>

      <main className="user-page-main">
        {activeTab === 'tickets' && (
          <div className="user-page-tickets">
            {ticketsLoading ? (
              <div className="user-page-tickets-loading">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="user-page-empty">
                <div className="user-page-empty-icon-wrap">
                  <ShoppingCart className="user-page-empty-icon" />
                </div>
                <h2 className="user-page-empty-title">ooops!!!</h2>
                <p className="user-page-empty-text">
                  You haven&apos;t booked any tickets yet. Explore exciting events and secure your spot now!
                </p>
                <Link to="/" className="user-page-empty-btn">
                  Browse Events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="user-page-tickets-list">
                <div className="user-page-tickets-header">
                  <div className="user-page-tickets-tabs">
                    <button type="button" className="user-page-tickets-tab user-page-tickets-tab--active">
                      All ({tickets.length})
                    </button>
                    <button type="button" className="user-page-tickets-tab">Pending</button>
                    <button type="button" className="user-page-tickets-tab">Canceled</button>
                    <button type="button" className="user-page-tickets-tab">Completed</button>
                  </div>
                  <div className="user-page-tickets-sort">
                    Sort by
                    <ChevronRight className="w-4 h-4 rotate-90" style={{ marginLeft: 4 }} />
                  </div>
                </div>
                <ul className="user-page-ticket-cards">
                  {tickets.map((ticket) => (
                    <li key={ticket.id} className="user-page-ticket-card">
                      <input type="checkbox" className="user-page-ticket-checkbox" />
                      <div className="user-page-ticket-body">
                        <h3 className="user-page-ticket-title">{ticket.event_title || 'Event'}</h3>
                        <p className="user-page-ticket-id">#{ticket.order_id || ticket.id}</p>
                        <div className="user-page-ticket-meta">
                          <span className="user-page-ticket-date">
                            {ticket.order_date || ticket.created_at
                              ? new Date(ticket.order_date || ticket.created_at).toLocaleString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </span>
                          <span className="user-page-ticket-total">Total paid ${ticket.total_paid ?? '—'}</span>
                          <span className="user-page-ticket-count">
                            <Ticket className="w-4 h-4" />
                            {ticket.quantity ?? 1} tickets
                          </span>
                          <Link to="#" className="user-page-ticket-details">
                            Ticket Details &gt;
                          </Link>
                        </div>
                      </div>
                      <span className={`user-page-ticket-status user-page-ticket-status--${(ticket.status || 'pending').toLowerCase()}`}>
                        {ticket.status || 'Pending'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="user-page-personal">
            <div className="user-page-personal-header">
              <div className="user-page-personal-avatar">
                {(user?.avatar_url && <img src={user.avatar_url} alt="" />) || (
                  <span className="user-page-personal-avatar-initial">
                    {(personalForm.firstName || user?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="user-page-personal-welcome">
                <h1 className="user-page-personal-greeting">
                  Hey {personalForm.firstName || user?.name || 'there'}!
                </h1>
                <p className="user-page-personal-email">{user?.email || personalForm.email || '—'}</p>
              </div>
              <button
                type="button"
                className="user-page-personal-edit"
                onClick={() => setPersonalEditing(!personalEditing)}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className={`user-page-personal-fields ${!personalEditing ? 'user-page-personal-fields--readonly' : ''}`}>
              <div className="user-page-personal-field">
                <label className="user-page-personal-label">First Name</label>
                <div className="user-page-personal-input-wrap">
                  <User className="user-page-personal-input-icon" />
                  <input
                    type="text"
                    className="user-page-personal-input"
                    value={personalForm.firstName}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="First Name"
                    readOnly={!personalEditing}
                  />
                </div>
              </div>
              <div className="user-page-personal-field">
                <label className="user-page-personal-label">Last Name</label>
                <div className="user-page-personal-input-wrap">
                  <User className="user-page-personal-input-icon" />
                  <input
                    type="text"
                    className="user-page-personal-input"
                    value={personalForm.lastName}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Last Name"
                    readOnly={!personalEditing}
                  />
                </div>
              </div>
              <div className="user-page-personal-field">
                <label className="user-page-personal-label">Email</label>
                <div className="user-page-personal-input-wrap">
                  <Mail className="user-page-personal-input-icon" />
                  <input
                    type="email"
                    className="user-page-personal-input"
                    value={personalForm.email}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Email"
                    readOnly={!personalEditing}
                  />
                </div>
              </div>
              <div className="user-page-personal-field">
                <label className="user-page-personal-label">State</label>
                <div className="user-page-personal-input-wrap">
                  <Globe className="user-page-personal-input-icon" />
                  <select
                    className="user-page-personal-input user-page-personal-select"
                    value={personalForm.state}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, state: e.target.value }))}
                    disabled={!personalEditing}
                  >
                    <option value="">Select state</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                  <ChevronRight className="user-page-personal-select-arrow" />
                </div>
              </div>
              <div className="user-page-personal-field">
                <label className="user-page-personal-label">City</label>
                <div className="user-page-personal-input-wrap">
                  <MapPin className="user-page-personal-input-icon" />
                  <input
                    type="text"
                    className="user-page-personal-input"
                    value={personalForm.city}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, city: e.target.value }))}
                    placeholder="City"
                    readOnly={!personalEditing}
                  />
                </div>
              </div>
              <div className="user-page-personal-field">
                <label className="user-page-personal-label">Date of birth</label>
                <div className="user-page-personal-input-wrap">
                  <Calendar className="user-page-personal-input-icon" />
                  <input
                    type="date"
                    className="user-page-personal-input"
                    value={personalForm.dateOfBirth}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                    readOnly={!personalEditing}
                  />
                </div>
              </div>
              <div className="user-page-personal-field user-page-personal-field--phone">
                <label className="user-page-personal-label">Phone Number</label>
                <div className="user-page-personal-phone">
                  <select
                    className="user-page-personal-phone-country"
                    value={personalForm.phoneCountry}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, phoneCountry: e.target.value }))}
                    disabled={!personalEditing}
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+33">+33</option>
                    <option value="+49">+49</option>
                  </select>
                  <input
                    type="tel"
                    className="user-page-personal-input user-page-personal-phone-input"
                    value={personalForm.phoneNumber}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                    placeholder="Phone number"
                    readOnly={!personalEditing}
                  />
                </div>
              </div>
            </div>

            {personalEditing && (
              <div className="user-page-personal-actions">
                <button type="button" className="user-page-personal-discard" onClick={handlePersonalDiscard}>
                  Discard
                </button>
                <button type="button" className="user-page-personal-save" onClick={handlePersonalSave}>
                  Save changes
                </button>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'payment' || activeTab === 'notification' || activeTab === 'setting') && (
          <div className="user-page-placeholder">
            <p className="user-page-placeholder-text">
              {activeTab === 'payment' && 'Payment methods and billing will be available here.'}
              {activeTab === 'notification' && 'Notification preferences will be available here.'}
              {activeTab === 'setting' && 'Settings will be available here.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserPage;
