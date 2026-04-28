import React from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getStandupById } from '../../api/StandupsService';
import useAuthStatus from '../../hooks/useAuthStatus';
import { MapPin, ArrowLeft, Calendar } from 'lucide-react';

export default function StandupDetailsPage() {
  const { t, i18n } = useTranslation();
  const { role, isAuthenticated, isLoading: authLoading } = useAuthStatus();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [standup, setStandup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showtimes, setShowtimes] = useState([]);
  
  const adminPath = location.pathname.startsWith('/admin') ? '/admin' : null;

  const handleBookTicket = (showtimeId) => {    
    if (!isAuthenticated && !authLoading) {
      navigate("/login");
      return;
    }
    navigate(`/standups/${id}/seats?showtime_id=${showtimeId}`);
  };

  const handleGoBack = () => {
    navigate(adminPath ? `${adminPath}/standups` : '/standups');
  };

  useEffect(() => {
    const fetchStandupData = async () => {
      try {
        const res = await getStandupById(id);
        setStandup(res.data);

        // Fetch showtimes
        const stRes = await fetch(`/api/showtimes?event_id=${id}&event_type=standup`);
        const stData = await stRes.json();
        setShowtimes(stData);
      } catch (err) {
        console.error("Error fetching standup data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandupData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="font-poppins text-lg animate-pulse">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateStr) => {
    const locale = i18n.language === 'hy' ? 'hy-AM' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';
    return new Date(dateStr).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
  };

  const formatPriceRange = (min, max) => {
    if (min == null && max == null) return t('common.tba');
    if (min === max) return `${min}֏`;
    return `${min} - ${max}֏`;
  };

  return (
    <div className="relative w-full bg-[#0D0D0D] min-h-screen font-mulish text-white">
      {/* Hero section with dynamic background */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-110"
          style={{ backgroundImage: `url(${standup?.poster_url || "/images/defaults/standup.png"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        
        {/* Navigation / Back Button */}
        <div className="absolute top-24 md:top-32 left-4 md:left-[108px] z-30">
          <button 
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">{t('common.goBack')}</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-[108px] pb-12 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest">
                  {t('standups.title')}
                </span>
                <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                  <MapPin size={14} className="text-purple-400" />
                  <span>{standup?.location || '—'}</span>
                </div>
              </div>
              <h1 className="font-poppins text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
                {standup?.comedian || standup?.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-lg max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
                {standup?.description || `${standup?.title || standup?.comedian} – A night of laughter and entertainment.`}
              </p>
            </div>
            
            <div className="hidden md:block w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500 flex-shrink-0">
              <img 
                src={standup?.poster_url || "/images/defaults/standup.png"} 
                alt={standup?.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Showtimes */}
      <section className="relative z-20 px-4 md:px-[108px] -mt-6">
        <div className="max-w-7xl mx-auto bg-[#1A1A1A]/80 backdrop-blur-xl rounded-3xl p-6 md:p-12 border border-white/5 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
            <div>
              <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-2">
                {t('common.availableSessions')}
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Grab your tickets before they sell out!
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
              <Calendar size={18} className="text-purple-400" />
              <span className="text-sm font-medium">Limited Availability</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {showtimes.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-gray-500 italic">{t('common.noSessions')}</p>
              </div>
            ) : (
              showtimes.map((st) => (
                <div 
                  key={st.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <MapPin size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Venue</span>
                        <span className="font-bold md:text-lg">{st.venue?.name || standup?.location || '—'}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date & Time</span>
                      <span className="font-semibold text-gray-200">
                        {formatDateTime(st.start_time)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 text-right">Price from</span>
                      <span className="text-xl md:text-2xl font-black text-white">
                        {formatPriceRange(st.min_price, st.max_price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/20 active:scale-95 transition-all text-sm uppercase tracking-wide whitespace-nowrap"
                      onClick={() => handleBookTicket(st.id)}
                    >
                      {t('common.pickSeats')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
}
