import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getVenueById, updateVenue } from '../../../api/VenueService';

export default function VenueEditPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        type: 'theatre',
        address: '',
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
                });
            } catch (err) {
                setError(t('admin.common.failLoad'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVenue();
    }, [id, t]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = { ...form };
            await updateVenue(id, payload);
            navigate('/admin/venues');
        } catch (err) {
            setError(err.response?.data?.message || t('admin.common.failLoad'));
            console.error(err);
        } finally {
            setSaving(false);
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
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">
                    <span className="text-purple-400">✏️</span> {t('admin.venues.edit')}
                </h1>
                <p className="text-gray-400 mb-8">{t('admin.common.updateDetails')}</p>

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

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? t('admin.common.saving') : t('admin.common.save')}
                        </button>
                        
                        <Link
                            to={`/admin/venues/${id}/layout`}
                            className="flex-1 min-w-[200px] text-center px-6 py-3 bg-purple-900/40 text-purple-300 border border-purple-700/30 rounded-xl font-semibold hover:bg-purple-800/60 transition-all"
                        >
                            ✏️ {t('admin.venues.editLayout')}
                        </Link>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/venues')}
                            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                        >
                            {t('admin.common.back')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
