import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVenues } from '../../../api/VenueService';

export default function StandupCreatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        comedian: '',
        start_time: '',
        end_time: '',
        location: '',
        poster_url: '',
        venue_id: '',
    });
    const [venueType, setVenueType] = useState('');
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!venueType) {
            setVenues([]);
            setForm(p => ({ ...p, venue_id: '' }));
            return;
        }
        const fetchVenues = async () => {
            try {
                const res = await getVenues(venueType);
                setVenues(res.data);
                setForm(p => ({ ...p, venue_id: '' }));
            } catch (err) {
                console.error('Failed to load venues:', err);
            }
        };
        fetchVenues();
    }, [venueType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Use the StandupsService API
            const { default: API } = await import('../../../api/apiClient');
            const payload = {
                ...form,
                venue_id: form.venue_id ? parseInt(form.venue_id) : null,
            };
            await API.post('/admin/standups', payload);
            setSuccess('Standup created successfully!');
            setForm({ title: '', description: '', comedian: '', start_time: '', end_time: '', location: '', poster_url: '', venue_id: '' });
            setVenueType('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create standup');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-[#0c0c0c] border border-purple-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors";
    const labelClass = "block text-gray-300 text-sm font-medium mb-2";

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">
                    <span className="text-purple-400">🎤</span> Create New Standup
                </h1>
                <p className="text-gray-400 mb-8">Add a new standup show to the system</p>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">{error}</div>
                )}
                {success && (
                    <div className="bg-green-900/30 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl mb-6">{success}</div>
                )}

                <form onSubmit={handleSubmit} className="bg-[#1a1a2e] border border-purple-900/30 rounded-2xl p-8 space-y-6">
                    <div>
                        <label className={labelClass}>Title <span className="text-red-400">*</span></label>
                        <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="Standup show title" className={inputClass} />
                    </div>

                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Show description" className={inputClass + " resize-none"} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Comedian <span className="text-red-400">*</span></label>
                            <input type="text" name="comedian" value={form.comedian} onChange={handleChange} required placeholder="Comedian name" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Location</label>
                            <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Yerevan" className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Start Time <span className="text-red-400">*</span></label>
                            <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>End Time</label>
                            <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Poster URL</label>
                        <input type="text" name="poster_url" value={form.poster_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
                    </div>

                    {/* Venue Selection */}
                    <div className="border-t border-purple-900/30 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            <span className="text-purple-400">🏛️</span> Venue
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Venue Type</label>
                                <select value={venueType} onChange={(e) => setVenueType(e.target.value)} className={inputClass}>
                                    <option value="">-- Select Type --</option>
                                    <option value="theatre">🎭 Theatre</option>
                                    <option value="stadium">🏟️ Stadium</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Venue</label>
                                <select
                                    name="venue_id"
                                    value={form.venue_id}
                                    onChange={handleChange}
                                    disabled={!venueType}
                                    className={inputClass + ((!venueType) ? ' opacity-50 cursor-not-allowed' : '')}
                                >
                                    <option value="">-- Select Venue --</option>
                                    {venues.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                                {venueType && venues.length === 0 && (
                                    <p className="text-gray-500 text-xs mt-1">No {venueType}s found. <a href="/admin/venues/create" className="text-purple-400 underline">Create one</a></p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Standup'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
