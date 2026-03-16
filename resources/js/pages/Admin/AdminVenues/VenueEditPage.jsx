import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVenueById, updateVenue } from '../../../api/VenueService';

export default function VenueEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        type: 'theatre',
        address: '',
        capacity: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await getVenueById(id);
                const v = res.data;
                setForm({
                    name: v.name || '',
                    type: v.type || 'theatre',
                    address: v.address || '',
                    capacity: v.capacity ? String(v.capacity) : '',
                });
            } catch (err) {
                setError('Failed to load venue');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVenue();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                ...form,
                capacity: form.capacity ? parseInt(form.capacity) : null,
            };
            await updateVenue(id, payload);
            navigate('/admin/venues');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update venue');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <div className="text-purple-400 text-xl animate-pulse">Loading venue...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">
                    <span className="text-purple-400">✏️</span> Edit Venue
                </h1>
                <p className="text-gray-400 mb-8">Update venue details</p>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-[#1a1a2e] border border-purple-900/30 rounded-2xl p-8 space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Venue Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-[#0c0c0c] border border-purple-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Venue Type <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setForm(p => ({ ...p, type: 'theatre' }))}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                                    form.type === 'theatre'
                                        ? 'border-purple-500 bg-purple-900/30 text-purple-300 shadow-lg shadow-purple-900/20'
                                        : 'border-purple-900/30 bg-[#0c0c0c] text-gray-400 hover:border-purple-700/50'
                                }`}
                            >
                                <div className="text-3xl mb-2">🎭</div>
                                <div className="font-semibold">Theatre</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm(p => ({ ...p, type: 'stadium' }))}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                                    form.type === 'stadium'
                                        ? 'border-blue-500 bg-blue-900/30 text-blue-300 shadow-lg shadow-blue-900/20'
                                        : 'border-purple-900/30 bg-[#0c0c0c] text-gray-400 hover:border-blue-700/50'
                                }`}
                            >
                                <div className="text-3xl mb-2">🏟️</div>
                                <div className="font-semibold">Stadium</div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0c0c0c] border border-purple-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Capacity (seats)</label>
                        <input
                            type="number"
                            name="capacity"
                            value={form.capacity}
                            onChange={handleChange}
                            min="1"
                            className="w-full px-4 py-3 bg-[#0c0c0c] border border-purple-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/venues')}
                            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
