import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, X, ArrowLeft, Trash2 } from 'lucide-react';
import { getMovieById, updateMovie, deleteMovie } from '../../../api/MoviesService';
import { getVenues } from '../../../api/VenueService';
import ShowtimeManager from '../../../components/Admin/ShowtimeManager';

export default function MovieEditPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        genre: '',
        duration: '',
        release_date: '',
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
        const fetchData = async () => {
            try {
                const res = await getMovieById(id);
                const movie = res.data;
                
                setForm({
                    title: movie.title || '',
                    description: movie.description || '',
                    genre: movie.genre || '',
                    duration: movie.duration || '',
                    release_date: movie.release_date ? movie.release_date.split('T')[0] : '',
                    venue_id: movie.venue_id || '',
                    price: movie.price || '',
                    allow_standing: !!movie.allow_standing,
                });
                
                if (movie.poster_url) {
                    setExistingPoster(movie.poster_url);
                }
            } catch (err) {
                setError(t('admin.common.failLoad'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
            formData.append('genre', form.genre);
            formData.append('duration', form.duration);
            formData.append('release_date', form.release_date);
            if (form.venue_id) formData.append('venue_id', form.venue_id);
            if (form.price) formData.append('price', form.price);
            formData.append('allow_standing', form.allow_standing ? 1 : 0);
            if (poster) {
                formData.append('poster', poster);
            } else if (shouldRemoveExistingPoster) {
                formData.append('remove_poster', 'true');
            }

            await updateMovie(id, formData);
            setSuccess(t('admin.common.successUpdate', { type: t('admin.movies.type') }));
            
            if (posterPreview) {
                setExistingPoster(null); 
            }
            
            setTimeout(() => navigate('/admin'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || t('admin.common.failLoad'));
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(t('admin.common.confirmDelete', { type: t('admin.movies.type') }))) return;
        
        setDeleting(true);
        try {
            await deleteMovie(id);
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
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <div className="text-purple-400 text-xl animate-pulse">{t('common.loading')}...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} /> {t('admin.common.back')}
                    </button>
                    
                    <button 
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
                    >
                        <Trash2 size={20} /> {deleting ? t('admin.common.deleting') : t('admin.movies.delete')}
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">
                    <span className="text-purple-400">✏️</span> {t('admin.movies.edit')}
                </h1>
                <p className="text-gray-400 mb-8">{t('admin.common.updateDetails')}</p>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">{error}</div>
                )}
                {success && (
                    <div className="bg-green-900/30 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl mb-6">{success}</div>
                )}

                <form onSubmit={handleSubmit} className="bg-[#1a1a2e] border border-purple-900/30 rounded-2xl p-8 space-y-6">
                    {/* Poster Section */}
                    <div 
                        className={`relative w-full h-64 border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                            isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-purple-900/40 bg-[#0c0c0c] hover:border-purple-500/60'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {(posterPreview || existingPoster) ? (
                            <>
                                <img src={posterPreview || existingPoster} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        type="button" 
                                        onClick={removePoster}
                                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                <div className="p-4 rounded-full bg-purple-900/20 group-hover:bg-purple-900/40 transition-colors">
                                    <Upload className="w-8 h-8 text-purple-400" />
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-gray-300 font-medium">{t('admin.common.dragDrop')}</p>
                                    <p className="text-gray-500 text-sm">{t('admin.common.newImageReplace')}</p>
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
                            <label className={labelClass}>{t('admin.fields.genre')} <span className="text-red-400">*</span></label>
                            <select 
                                name="genre" 
                                value={form.genre} 
                                onChange={handleChange} 
                                required 
                                className={inputClass}
                            >
                                <option value="">{t('admin.fields.selectGenre')}</option>
                                <option value="scifi">{t('movies.categories.scifi')}</option>
                                <option value="action">{t('movies.categories.action')}</option>
                                <option value="adventure">{t('movies.categories.adventure')}</option>
                                <option value="comedy">{t('movies.categories.comedy')}</option>
                                <option value="drama">{t('movies.categories.drama')}</option>
                                <option value="horror">{t('movies.categories.horror')}</option>
                                <option value="thriller">{t('movies.categories.thriller')}</option>
                                <option value="fantasy">{t('movies.categories.fantasy')}</option>
                                <option value="family">{t('movies.categories.family')}</option>
                                <option value="animation">{t('movies.categories.animation')}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>{t('admin.fields.description')}</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows="3" className={inputClass + " resize-none"} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>{t('admin.fields.duration')} <span className="text-red-400">*</span></label>
                            <input type="number" name="duration" value={form.duration} onChange={handleChange} required min="1" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>{t('admin.fields.releaseDate')}</label>
                            <input type="date" name="release_date" value={form.release_date} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>{t('admin.fields.basePrice')}</label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} min="0" placeholder={t('admin.fields.pricePlaceholder')} className={inputClass} />
                    </div>

                    {/* Venue Selection */}
                    <div className="border-t border-purple-900/30 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            <span className="text-purple-400">🏛️</span> {t('admin.fields.venue')}
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className={labelClass}>{t('admin.fields.venue')}</label>
                                <select
                                    name="venue_id"
                                    value={form.venue_id}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="">{t('admin.fields.selectVenue')}</option>
                                    {venues.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-50"
                        >
                            {saving ? t('admin.common.saving') : t('admin.common.save')}
                        </button>
                    </div>
                </form>

                {/* Showtime Management Section */}
                <div className="mt-12">
                    <ShowtimeManager eventId={id} eventType="movie" basePrice={form.price} allowStanding={form.allow_standing} />
                </div>
            </div>
        </div>
    );
}
