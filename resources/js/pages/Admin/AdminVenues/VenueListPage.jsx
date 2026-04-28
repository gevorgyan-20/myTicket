import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getVenues, deleteVenue } from '../../../api/VenueService';
import { Eye, Layout, Trash2, Building2, Landmark, MapPin, Armchair, Plus } from 'lucide-react';

export default function VenueListPage() {
    const { t } = useTranslation();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const fetchVenues = async () => {
        try {
            const res = await getVenues();
            setVenues(res.data);
        } catch (err) {
            setError(t('admin.common.failLoad'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVenues(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.dashboard.table.confirmDelete', { type: t('admin.venues.type').toLowerCase() }))) return;
        setDeletingId(id);
        setError('');
        try {
            await deleteVenue(id);
            setVenues(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            const msg = err.response?.data?.message || t('admin.dashboard.table.deleteFailed');
            setError(msg);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <div className="text-purple-400 text-xl animate-pulse">{t('common.loading')}...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Landmark className="text-purple-400 w-8 h-8" /> {t('admin.venues.title')}
                        </h1>
                        <p className="text-gray-400 mt-1">{t('admin.venues.details')}</p>
                    </div>
                    <Link
                        to="/admin/venues/create"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-900/30 hover:shadow-purple-800/50 flex items-center gap-2"
                    >
                        <Plus size={20} /> {t('admin.venues.create')}
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {venues.length === 0 ? (
                    <div className="text-center py-20">
                        <Building2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">{t('admin.venues.noVenues')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues.map(venue => (
                            <div
                                key={venue.id}
                                className="bg-[#1a1a2e] border border-purple-900/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-3xl text-purple-400">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-900/40 text-purple-300 border border-purple-700/40">
                                        {t('admin.venues.type')}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                    {venue.name}
                                </h3>

                                {venue.address && (
                                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-purple-400" /> {venue.address}
                                    </p>
                                )}
                                {venue.capacity && (
                                    <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                                        <Armchair className="w-4 h-4 text-purple-400" /> {venue.capacity.toLocaleString()} {t('admin.dashboard.table.seats')}
                                    </p>
                                )}

                                <div className="w-full flex gap-2 justify-between items-center mt-auto pt-4 border-t border-purple-900/20">
                                    <Link
                                        to={`/admin/venues/${venue.id}`}
                                        className="h-[42px] w-[calc((100%-16px)/3)] flex-1 p-2 flex items-center justify-center gap-2 px-4 py-2 bg-purple-900/30 text-purple-300 rounded-lg hover:bg-purple-800/50 transition-all text-sm font-medium"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/admin/venues/${venue.id}/layout`}
                                        title={t('admin.venues.editLayout')}
                                        className="h-[42px] w-[calc((100%-16px)/3)] flex-1 p-2 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-lg hover:bg-purple-600/30 transition-all"
                                    >
                                        <Layout size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(venue.id)}
                                        disabled={deletingId === venue.id}
                                        title={t('admin.common.delete')}
                                        className="h-[42px] w-[calc((100%-16px)/3)] flex-1 p-2 flex items-center justify-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-800/40 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
