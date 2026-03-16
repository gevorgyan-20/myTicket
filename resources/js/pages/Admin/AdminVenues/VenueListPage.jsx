import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVenues, deleteVenue } from '../../../api/VenueService';

export default function VenueListPage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const fetchVenues = async () => {
        try {
            const res = await getVenues();
            setVenues(res.data);
        } catch (err) {
            setError('Failed to load venues');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVenues(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this venue?')) return;
        setDeletingId(id);
        try {
            await deleteVenue(id);
            setVenues(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            alert('Failed to delete venue');
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <div className="text-purple-400 text-xl animate-pulse">Loading venues...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            <span className="text-purple-400">🏛️</span> Venue Management
                        </h1>
                        <p className="text-gray-400 mt-1">Manage theatres and stadiums</p>
                    </div>
                    <Link
                        to="/admin/venues/create"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-900/30 hover:shadow-purple-800/50"
                    >
                        + Add Venue
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {venues.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏟️</div>
                        <p className="text-gray-400 text-lg">No venues yet. Create your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues.map(venue => (
                            <div
                                key={venue.id}
                                className="bg-[#1a1a2e] border border-purple-900/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-3xl">
                                        {venue.type === 'theatre' ? '🎭' : '🏟️'}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                        venue.type === 'theatre'
                                            ? 'bg-purple-900/40 text-purple-300 border border-purple-700/40'
                                            : 'bg-blue-900/40 text-blue-300 border border-blue-700/40'
                                    }`}>
                                        {venue.type}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                    {venue.name}
                                </h3>

                                {venue.address && (
                                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                                        <span>📍</span> {venue.address}
                                    </p>
                                )}
                                {venue.capacity && (
                                    <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
                                        <span>💺</span> {venue.capacity.toLocaleString()} seats
                                    </p>
                                )}

                                <div className="flex gap-3 mt-auto pt-4 border-t border-purple-900/20">
                                    <Link
                                        to={`/admin/venues/${venue.id}`}
                                        className="flex-1 text-center px-4 py-2 bg-purple-900/30 text-purple-300 rounded-lg hover:bg-purple-800/50 transition-colors text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(venue.id)}
                                        disabled={deletingId === venue.id}
                                        className="flex-1 px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-800/40 transition-colors text-sm font-medium disabled:opacity-50"
                                    >
                                        {deletingId === venue.id ? 'Deleting...' : 'Delete'}
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
