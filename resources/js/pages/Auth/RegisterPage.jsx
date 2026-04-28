import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { register as registerApi } from "../../api/AuthService";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, CheckCircle, ArrowRight, ChevronDown, Eye, EyeOff } from "lucide-react";

const AUTH_EVENT = 'authChange';

export default function RegisterPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const COUNTRY_CODES = [
      { code: '+374', flag: '🇦🇲', name: t('countries.armenia') },
      { code: '+7', flag: '🇷🇺', name: t('countries.russia') },
      { code: '+1', flag: '🇺🇸', name: t('countries.usa') },
      { code: '+971', flag: '🇦🇪', name: t('countries.uae') },
      { code: '+995', flag: '🇬🇪', name: t('countries.georgia') },
      { code: '+380', flag: '🇺🇦', name: t('countries.ukraine') },
    ];

    const [form, setForm] = useState({
        name: "",
        last_name: "",
        phone: "",
        country_code: "+374",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showCountryList, setShowCountryList] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const selectedCountry = COUNTRY_CODES.find(c => c.code === form.country_code) || COUNTRY_CODES[0];

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.password_confirmation) {
            setError(t('auth.register.mismatch'));
            return;
        }

        if (!agreeTerms) {
            setError(t('auth.register.agreeError') || 'Please agree to terms');
            return;
        }

        try {
            setLoading(true);
            setError("");

            await registerApi(form);

            window.dispatchEvent(new Event(AUTH_EVENT));
            navigate('/login');
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.errors?.email?.[0] ||
                t('auth.register.failed');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white font-mulish flex">
            {/* Left Side - Visual Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-5/12 relative bg-[#121212] items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                </div>
                <div className="relative z-10 text-center space-y-8 p-12">
                    <div className="inline-block p-4 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl mb-6 transition-transform hover:scale-105 duration-500">
                        <span className="text-5xl font-poppins font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tighter">MyTicket</span>
                    </div>
                    <h2 className="text-5xl font-poppins font-bold leading-tight tracking-tight">
                        Your Gateway to <br /> 
                        <span className="text-gray-500 italic">Unforgettable Moments</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-sm mx-auto font-medium">
                        Join our community and get exclusive access to the best events in the city.
                    </p>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-y-auto">
                <div className="lg:hidden absolute top-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px]" />
                <div className="lg:hidden absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px]" />

                <div className="w-full max-w-xl space-y-8 py-12 animate-fadeIn">
                    <div className="text-center lg:text-left space-y-3">
                        <h1 className="font-poppins text-4xl font-bold tracking-tight">{t('auth.register.submit')}</h1>
                        <p className="text-gray-400 font-medium">{t('auth.register.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-3 animate-shake">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Last Name Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('auth.register.name')}</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        name="name"
                                        placeholder={t('auth.register.namePlaceholder')}
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('auth.register.lastName')}</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        name="last_name"
                                        placeholder={t('auth.register.lastNamePlaceholder')}
                                        value={form.last_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone Row */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('auth.register.phone')}</label>
                            <div className="flex gap-3">
                                <div className="relative min-w-[100px]">
                                    <div 
                                        className="h-full bg-white/5 border border-white/10 rounded-2xl px-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all"
                                        onClick={() => setShowCountryList(!showCountryList)}
                                    >
                                        <span className="text-lg mr-2">{selectedCountry.flag}</span>
                                        <span className="text-sm font-bold">{selectedCountry.code}</span>
                                        <ChevronDown size={14} className={`ml-2 transition-transform ${showCountryList ? 'rotate-180' : ''}`} />
                                    </div>
                                    
                                    {showCountryList && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowCountryList(false)} />
                                            <div className="absolute top-full left-0 mt-2 w-64 bg-[#161616] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-scaleIn origin-top-left">
                                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                    {COUNTRY_CODES.map((c, i) => (
                                                        <div 
                                                            key={`${c.code}-${i}`}
                                                            className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-white/5 ${form.country_code === c.code ? 'bg-purple-600/10 text-purple-400' : 'text-gray-400'}`}
                                                            onClick={() => {
                                                                setForm({...form, country_code: c.code});
                                                                setShowCountryList(false);
                                                            }}
                                                        >
                                                            <span className="text-xl">{c.flag}</span>
                                                            <span className="text-sm font-bold flex-1">{c.name}</span>
                                                            <span className="text-xs opacity-50">{c.code}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="relative flex-1 group">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder={t('auth.register.phonePlaceholder')}
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Row */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('auth.register.email')}</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder={t('auth.register.emailPlaceholder')}
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                                />
                            </div>
                        </div>

                        {/* Password Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('auth.register.password')}</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('auth.register.passwordPlaceholder')}
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('auth.register.confirmPassword')}</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        name="password_confirmation"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${agreeTerms ? 'bg-purple-600 border-purple-600' : 'border-white/20 group-hover:border-white/40'}`}>
                                    {agreeTerms && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                                <span className="text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors">{t('auth.register.agreeTerms')}</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {t('auth.register.submit')}
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-gray-400 font-medium text-sm">
                            {t('auth.register.haveAccount')} 
                            <Link to="/login" className="text-purple-400 font-bold ml-2 hover:text-purple-300 transition-colors">
                                {t('auth.register.signIn')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-shake { animation: shake 0.4s ease-in-out; }
            `}} />
        </div>
    );
}