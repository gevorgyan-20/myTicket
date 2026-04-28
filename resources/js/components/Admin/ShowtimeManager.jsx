import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Calendar, Clock, Landmark, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { getShowtimes, createShowtime, updateShowtime, deleteShowtime } from '../../api/ShowtimesService';
import { getVenues, getVenueSections } from '../../api/VenueService';

const ShowtimeManager = ({ eventId, eventType, basePrice, allowStanding }) => {
    const { t, i18n } = useTranslation();
    const [showtimes, setShowtimes] = useState([]);
    const [venues, setVenues] = useState([]);
    const [sections, setSections] = useState([]);   
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [newShowtime, setNewShowtime] = useState({
        venue_id: '',
        start_time: '',
        end_time: '',
        price: '',
    });

    const [sectionPrices, setSectionPrices] = useState({});
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchShowtimes();
        fetchVenues();
    }, [eventId, eventType]);

    const fetchShowtimes = async () => {
        try {
            const res = await getShowtimes(eventId, eventType);
            setShowtimes(res.data);
        } catch (err) {
            console.error('Failed to fetch showtimes:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVenues = async () => {
        try {
            const res = await getVenues();
            setVenues(res.data);
        } catch (err) {
            console.error('Failed to fetch venues:', err);
        }
    };

    useEffect(() => {
        if (!newShowtime.venue_id) {
            setSections([]);
            setSectionPrices({});
            return;
        }
        const loadSections = async () => {
            try {
                const res = await getVenueSections(newShowtime.venue_id);
                const secs = res.data;
                setSections(secs);
                const initPrices = {};
                secs.forEach(s => { initPrices[s.id] = ''; });
                setSectionPrices(initPrices);
            } catch (err) {
                console.error('Failed to load sections:', err);
                setSections([]);
            }
        };
        loadSections();
    }, [newShowtime.venue_id]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');

        const missingPrice = sections.some(s => {
            const isStanding = s.is_standing;
            const isRequired = !isStanding || allowStanding;
            return isRequired && (sectionPrices[s.id] === '' || sectionPrices[s.id] === undefined);
        });

        if (missingPrice) {
            setError(t('admin.showtimes.validatePrices'));
            return;
        }

        const section_prices = sections.map(s => ({
            venue_section_id: s.id,
            price: parseFloat(sectionPrices[s.id]) || 0,
        }));

        try {
            await createShowtime({
                ...newShowtime,
                event_id: eventId,
                event_type: eventType,
                section_prices,
            });
            setNewShowtime({ venue_id: '', start_time: '', end_time: '', price: '' });
            setSections([]);
            setSectionPrices({});
            fetchShowtimes();
        } catch (err) {
            setError(err.response?.data?.message || t('admin.common.failLoad'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.showtimes.confirmDelete'))) return;
        try {
            await deleteShowtime(id);
            fetchShowtimes();
        } catch (err) {
            console.error('Failed to delete showtime:', err);
        }
    };

    const formatDate = (dateStr) => {
        const locale = i18n.language === 'hy' ? 'hy-AM' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';
        return new Date(dateStr).toLocaleString(locale);
    };

    const inputCls = 'w-full bg-[#0c0c0c] border border-purple-900/40 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors';
    const labelCls = 'text-xs text-gray-400 uppercase tracking-wider';

    if (loading) return <div className="text-purple-400">{t('admin.showtimes.loading')}</div>;

    return (
        <div className="space-y-6 bg-[#1a1a2e] p-6 rounded-2xl border border-purple-900/30">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="text-purple-400" /> {t('admin.showtimes.manage')}
            </h3>

            {error && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                {showtimes.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">{t('admin.showtimes.noSessions')}</p>
                ) : (
                    showtimes.map((st) => {
                        const isExpanded = expandedId === st.id;
                        return (
                            <div
                                key={st.id}
                                className="bg-[#0c0c0c] border border-purple-900/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all"
                            >
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-white">
                                            <Clock size={16} className="text-purple-400" />
                                            <span>{formatDate(st.start_time)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Landmark size={14} />
                                            <span>{st.venue?.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {st.section_prices?.length > 0 && (
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : st.id)}
                                                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 px-2 py-1 rounded-lg border border-purple-900/30 hover:border-purple-500/40 transition-colors"
                                            >
                                                <Tag size={12} /> {t('admin.showtimes.prices')}
                                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(st.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && st.section_prices?.length > 0 && (
                                    <div className="px-4 pb-4 border-t border-purple-900/20 pt-3">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t('admin.showtimes.sectionPrices')}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {st.section_prices.map((sp) => (
                                                <span
                                                    key={sp.venue_section_id}
                                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        background: sp.venue_section?.color
                                                            ? sp.venue_section.color + '22'
                                                            : 'rgba(124,58,237,0.15)',
                                                        border: `1px solid ${sp.venue_section?.color ?? '#7C3AED'}55`,
                                                        color: sp.venue_section?.color ?? '#a78bfa',
                                                    }}
                                                >
                                                    <span
                                                        className="w-2 h-2 rounded-full inline-block"
                                                        style={{ background: sp.venue_section?.color ?? '#7C3AED' }}
                                                    />
                                                    {sp.venue_section?.label ?? `Section ${sp.venue_section_id}`}
                                                    <span className="text-white font-semibold ml-1">{sp.price} ֏</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <form onSubmit={handleCreate} className="pt-4 border-t border-purple-900/20 space-y-4">
                <h4 className="text-sm font-semibold text-white">{t('admin.showtimes.addNew')}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className={labelCls}>{t('admin.fields.venue')} <span className="text-red-400">*</span></label>
                        <select
                            required
                            value={newShowtime.venue_id}
                            onChange={(e) => setNewShowtime({ ...newShowtime, venue_id: e.target.value })}
                            className={inputCls}
                        >
                            <option value="">{t('admin.showtimes.chooseVenue')}</option>
                            {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className={labelCls}>{t('admin.showtimes.startTime')} <span className="text-red-400">*</span></label>
                        <input
                            required
                            type="datetime-local"
                            value={newShowtime.start_time}
                            onChange={(e) => setNewShowtime({ ...newShowtime, start_time: e.target.value })}
                            className={inputCls}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={labelCls}>{t('admin.showtimes.endTime')}</label>
                        <input
                            type="datetime-local"
                            value={newShowtime.end_time}
                            onChange={(e) => setNewShowtime({ ...newShowtime, end_time: e.target.value })}
                            className={inputCls}
                        />
                    </div>
                </div>

                {sections.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                            <Tag size={14} className="text-purple-400" />
                            <span className="text-sm font-semibold text-white">{t('admin.showtimes.sectionPrices')}</span>
                            <span className="text-xs text-gray-500">{t('admin.showtimes.requiredEverySection')}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {sections.map((sec) => (
                                <div
                                    key={sec.id}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl border border-purple-900/20 bg-[#0d0d1a]"
                                    style={{ borderColor: sec.color + '44' }}
                                >
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ background: sec.color }}
                                    />
                                    <span className="text-gray-300 text-sm flex-1 truncate">{sec.label}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <input
                                            required={!sec.is_standing || allowStanding}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0"
                                            value={sectionPrices[sec.id] ?? ''}
                                            onChange={(e) =>
                                                setSectionPrices(prev => ({ ...prev, [sec.id]: e.target.value }))
                                            }
                                            className="w-24 bg-[#0c0c0c] border border-purple-900/40 rounded-lg px-2 py-1 text-white text-sm text-right focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                        <span className="text-gray-500 text-xs">֏</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {newShowtime.venue_id && sections.length === 0 && (
                    <p className="text-yellow-500/70 text-xs italic">
                        {t('admin.showtimes.noSectionsAlert')}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!newShowtime.venue_id || sections.length === 0}
                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> {t('admin.showtimes.addSession')}
                </button>
            </form>
        </div>
    );
};

export default ShowtimeManager;
