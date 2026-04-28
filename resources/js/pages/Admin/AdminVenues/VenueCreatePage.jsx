import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createVenue } from '../../../api/VenueService';

export default function VenueCreatePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        type: 'theatre',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = { ...form };
            const res = await createVenue(payload);
            const newVenueId = res.data.venue.id;
            // Redirect to layout editor immediately after creation
            navigate(`/admin/venues/${newVenueId}/layout`);
        } catch (err) {
            setError(err.response?.data?.message || t('admin.common.failLoad'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">
                    <span className="text-purple-400">+</span> {t('admin.venues.create')}
                </h1>
                <p className="text-gray-400 mb-8">{t('admin.venues.details')}</p>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-[#1a1a2e] border border-purple-900/30 rounded-2xl p-8 space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            {t('admin.dashboard.table.item')} <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder={t('admin.venues.namePlaceholder')}
                            className="w-full px-4 py-3 bg-[#0c0c0c] border border-purple-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            {t('admin.dashboard.table.location')} <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                            placeholder={t('admin.venues.addressPlaceholder')}
                            className="w-full px-4 py-3 bg-[#0c0c0c] border border-purple-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('admin.common.saving') : t('admin.common.create')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/venues')}
                            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                        >
                            {t('profile.edit.discard')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
