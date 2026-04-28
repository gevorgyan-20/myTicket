import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Film, Music, Mic, Plus, ArrowRight, TrendingUp, Users, Calendar, Edit, Trash2, ExternalLink } from 'lucide-react';
import { getMovies, deleteMovie } from '../../api/MoviesService';
import { getConcerts, deleteConcert } from '../../api/ConcertsService';
import { getStandups, deleteStandup } from '../../api/StandupsService';

const StatCard = ({ label, value, icon, color }) => (
    <div className={`p-6 bg-[#1a1a2e] border border-purple-900/10 rounded-3xl hover:border-purple-600/30 transition-all duration-300 relative overflow-hidden group shadow-2xl shadow-purple-900/5`}>
        <div className={`absolute top-0 right-0 w-32 h-32 ${color}/5 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500`} />
        
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">{label}</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{value}</h3>
            </div>
            <div className={`p-4 rounded-2xl bg-${color}500/10 text-white shadow-lg`}>
                {icon}
            </div>
        </div>
    </div>
);

const EventTable = ({ title, icon, data, type, onDelete }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-purple-900/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600/10 rounded-lg text-purple-400">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <Link to={`/admin/${type}`} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                    {t('admin.dashboard.table.addNew')} <Plus size={14} />
                </Link>
            </div>
            <div className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.dashboard.table.item')}</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">{t('admin.dashboard.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/10">
                        {data.slice(0, 5).map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-16 rounded-lg bg-purple-900/20 overflow-hidden flex-shrink-0 border border-purple-900/20">
                                            {item.poster_url ? (
                                                <img src={item.poster_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-purple-500/50">
                                                    {icon}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-gray-400 mt-1">{item.genre || item.performer || item.comedian}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link 
                                            to={`/admin/${type}/${item.id}`}
                                            className="p-2 text-gray-400 hover:bg-purple-600/20 hover:text-purple-400 rounded-lg transition-all"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button 
                                            onClick={() => onDelete(item.id, type)}
                                            className="p-2 text-gray-400 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && (
                <div className="p-12 text-center text-gray-500 italic">
                    {t('admin.dashboard.table.noItems')}
                </div>
            )}
        </div>
    );
};

export default function AdminDashboardPage() {
    const { t } = useTranslation();
    const [movies, setMovies] = useState([]);
    const [concerts, setConcerts] = useState([]);
    const [standups, setStandups] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchData = async () => {
        try {
            const [m, c, s] = await Promise.all([getMovies(), getConcerts(), getStandups()]);
            setMovies(m.data);
            setConcerts(c.data);
            setStandups(s.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id, type) => {
        if (!window.confirm(t('admin.dashboard.table.confirmDelete', { type: type.slice(0, -1) }))) return;
        
        try {
            if (type === 'movies') await deleteMovie(id);
            else if (type === 'concerts') await deleteConcert(id);
            else if (type === 'standups') await deleteStandup(id);
            
            // Refresh data
            fetchData();
        } catch (err) {
            alert(t('admin.dashboard.table.deleteFailed', { type: type.slice(0, -1) }));
            console.error(err);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="text-purple-500 animate-pulse text-2xl">{t('common.loadingDots')}</div></div>;
    }

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-purple-600">
                    {t('admin.dashboard.admin')} <span className="text-white">{t('admin.dashboard.overview')}</span>
                </h1>
                <p className="text-gray-500 text-lg">{t('admin.dashboard.subtitle')}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label={t('admin.dashboard.stats.totalMovies')} value={movies.length} icon={<Film />} color="from-blue-600 to-cyan-500" />
                <StatCard label={t('admin.dashboard.stats.liveConcerts')} value={concerts.length} icon={<Music />} color="from-purple-600 to-pink-500" />
                <StatCard label={t('admin.dashboard.stats.standupShows')} value={standups.length} icon={<Mic />} color="from-orange-600 to-yellow-500" />
                <StatCard label={t('admin.dashboard.stats.totalUsers')} value="1.2k" icon={<Users />} color="from-teal-600 to-green-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <EventTable title={t('admin.sidebar.movies')} type="movies" icon={<Film size={20} />} data={movies} onDelete={handleDelete} />
                <EventTable title={t('admin.sidebar.concerts')} type="concerts" icon={<Music size={20} />} data={concerts} onDelete={handleDelete} />
                <EventTable title={t('admin.sidebar.standups')} type="standups" icon={<Mic size={20} />} data={standups} onDelete={handleDelete} />
            </div>
        </div>
    );
}


