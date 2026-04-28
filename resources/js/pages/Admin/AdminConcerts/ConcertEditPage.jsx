import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, X, ArrowLeft, Trash2 } from 'lucide-react';
import { getConcertById, updateConcert, deleteConcert } from '../../../api/ConcertsService';
import { getVenues } from '../../../api/VenueService';
import ShowtimeManager from '../../../components/Admin/ShowtimeManager';

export default function ConcertEditPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        performer: '',
        genre: '',
        start_time: '',
        end_time: '',
        location: '',
        venue_id: '',
        price: '',
        allow_standing: true,
    });
    
    const [poster, setPoster] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [existingPoster, setExistingPoster] = useState(null);
    const [shouldRemoveExistingPoster, setShouldRemoveExistingPoster] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [venues, setVenues] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchConcert = async () => {
            try {
                const res = await getConcertById(id);
                const concert = res.data;
                
                setForm({
                    title: concert.title || '',
                    description: concert.description || '',
                    performer: concert.performer || '',
                    genre: concert.genre || '',
                    start_time: concert.start_time ? concert.start_time.substring(0, 16) : '',
                    end_time: concert.end_time ? concert.end_time.substring(0, 16) : '',
                    location: concert.location || '',
                    venue_id: concert.venue_id || '',
                    price: concert.price || '',
                    allow_standing: !!concert.allow_standing,
                });
                
                if (concert.poster_url) {
                    setExistingPoster(concert.poster_url);
                }
            } catch (err) {
                setError(t('admin.common.failLoad'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchConcert();
    }, [id, t]);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await getVenues();
                setVenues(res.data);
            } catch (err) {
                console.error('Failed to load venues:', err);
            }
        };
        fetchVenues();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPoster(file);
            setPosterPreview(URL.createObjectURL(file));
            setShouldRemoveExistingPoster(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setPoster(file);
            setPosterPreview(URL.createObjectURL(file));
            setShouldRemoveExistingPoster(false);
        }
    };

    const removePoster = () => {
        setPoster(null);
        setPosterPreview(null);
        setExistingPoster(null);
        setShouldRemoveExistingPoster(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('performer', form.performer);
            formData.append('genre', form.genre);
            formData.append('start_time', form.start_time);
            if (form.end_time) formData.append('end_time', form.end_time);
            formData.append('location', form.location);
            if (form.venue_id) formData.append('venue_id', form.venue_id);
            if (form.price) formData.append('price', form.price);
            formData.append('allow_standing', form.allow_standing ? 1 : 0);
            if (poster) {
                formData.append('poster', poster);
            } else if (shouldRemoveExistingPoster) {
                formData.append('remove_poster', 'true');
            }

            await updateConcert(id, formData);
            setSuccess(t('admin.common.successUpdate', { type: t('admin.concerts.type') }));
            setTimeout(() => navigate('/admin'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || t('admin.common.failLoad'));
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(t('admin.common.confirmDelete', { type: t('admin.concerts.type') }))) return;
        setDeleting(true);
        try {
            await deleteConcert(id);
            navigate('/admin');
        } catch (err) {
            setError(t('admin.dashboard.table.deleteFailed'));
            console.error(err);
            setDeleting(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-[#0c0c0c] border border-purple-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors";
    const labelClass = "block text-gray-300 text-sm font-medium mb-2";

    if (loading) {
        return <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center"><div className="text-purple-400 text-xl animate-pulse">{t('common.loading')}...</div></div>;
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20} /> {t('admin.common.back')}</button>
                    <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"><Trash2 size={20} /> {deleting ? t('admin.common.deleting') : t('admin.concerts.delete')}</button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2"><span className="text-purple-400">✏️</span> {t('admin.concerts.edit')}</h1>
                <p className="text-gray-400 mb-8">{t('admin.common.updateDetails')}</p>

                {error && <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">{error}</div>}
                {success && <div className="bg-green-900/30 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl mb-6">{success}</div>}

                <form onSubmit={handleSubmit} className="bg-[#1a1a2e] border border-purple-900/30 rounded-2xl p-8 space-y-6">
                    <div 
                        className={`relative w-full h-64 border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 flex flex-col items-center justify-center gap-3 ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-purple-900/40 bg-[#0c0c0c] hover:border-purple-500/60'}`}
                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    >
                        {(posterPreview || existingPoster) ? (
                            <>
                                <img src={posterPreview || existingPoster} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={removePoster} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"><X className="w-6 h-6" /></button>
                                </div>
                            </>
                        ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                <div className="p-4 rounded-full bg-purple-900/20 group-hover:bg-purple-900/40 transition-colors"><Upload className="w-8 h-8 text-purple-400" /></div>
                                <div className="text-center mt-2">
                                    <p className="text-gray-300 font-medium">{t('admin.common.dragDrop')}</p>
                                    <p className="text-gray-500 text-sm">{t('admin.common.imageHint')}</p>
                                </div>
                            </label>
                        )}
                    </div>

                    {/* Allow Standing Checkbox */}
                    <div className="flex items-center gap-3 bg-[#0c0c0c] border border-purple-900/40 rounded-xl px-4 py-3">
                        <input
                            type="checkbox"
                            id="allow_standing"
                            name="allow_standing"
                            checked={form.allow_standing}
                            onChange={(e) => setForm(prev => ({ ...prev, allow_standing: e.target.checked }))}
                            className="w-5 h-5 rounded border-purple-900/40 bg-[#0c0c0c] text-purple-600 focus:ring-purple-500 transition-all cursor-pointer"
                        />
                        <label htmlFor="allow_standing" className="text-gray-300 text-sm font-medium cursor-pointer">
                            {t('admin.fields.allowStanding')}
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>{t('admin.fields.title')} <span className="text-red-400">*</span></label>
                            <input type="text" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>{t('admin.fields.performer')} <span className="text-red-400">*</span></label>
                            <input type="text" name="performer" value={form.performer} onChange={handleChange} required className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>{t('admin.fields.description')}</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows="3" className={inputClass + " resize-none"} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>{t('admin.fields.genre')} <span className="text-red-400">*</span></label>
                            <select 
                                name="genre" 
                                value={form.genre} 
                                onChange={handleChange} 
                                required 
                                className={inputClass}
                            >
                                <option value="">{t('admin.fields.selectGenre')}</option>
                                <option value="pop">{t('concerts.categories.pop')}</option>
                                <option value="rock">{t('concerts.categories.rock')}</option>
                                <option value="jazz">{t('concerts.categories.jazz')}</option>
                                <option value="hiphop">{t('concerts.categories.hiphop')}</option>
                                <option value="alternative">{t('concerts.categories.alternative')}</option>
                                <option value="classical">{t('concerts.categories.classical')}</option>
                                <option value="opera">{t('concerts.categories.opera')}</option>
                                <option value="country">{t('concerts.categories.country')}</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>{t('admin.dashboard.table.location')}</label>
                            <input type="text" name="location" value={form.location} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className={labelClass}>{t('admin.showtimes.startTime')} <span className="text-red-400">*</span></label>
                            <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClass}>{t('admin.showtimes.endTime')}</label>
                            <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>{t('admin.fields.basePrice')}</label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} min="0" placeholder={t('admin.fields.pricePlaceholder')} className={inputClass} />
                    </div>

                    <div className="border-t border-purple-900/30 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4"><span className="text-purple-400">🏛️</span> {t('admin.fields.venue')}</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className={labelClass}>{t('admin.fields.venue')}</label>
                                <select name="venue_id" value={form.venue_id} onChange={handleChange} className={inputClass}>
                                    <option value="">{t('admin.fields.selectVenue')}</option>
                                    {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-50">{saving ? t('admin.common.saving') : t('admin.common.save')}</button>
                    </div>
                </form>

                <div className="mt-12">
                    <ShowtimeManager eventId={id} eventType="concert" basePrice={form.price} allowStanding={form.allow_standing} />
                </div>
            </div>
        </div>
    );
}
