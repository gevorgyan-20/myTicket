import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { login as loginApi, getCurrentUser } from "../../api/AuthService";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const AUTH_EVENT = 'authChange';

export default function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await loginApi(form);

            window.dispatchEvent(new Event(AUTH_EVENT));

            try {
                const userRes = await getCurrentUser();
                if (userRes.data.role === 'admin') {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } catch (userErr) {
                navigate("/");
            }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.errors?.email?.[0] ||
                t('auth.login.failed');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white font-mulish flex">
            {/* Left Side - Visual Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative bg-[#121212] items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                </div>
                <div className="relative z-10 text-center space-y-8 p-12">
                    <div className="inline-block p-4 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl mb-6">
                        <span className="text-5xl font-poppins font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tighter">MyTicket</span>
                    </div>
                    <h2 className="text-5xl font-poppins font-bold leading-tight tracking-tight">
                        Experience the <br /> 
                        <span className="text-gray-500 italic">Magic of Live Events</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto font-medium">
                        Secure your seats for the most exclusive concerts, movies, and stand-up shows in the city.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-hidden">
                {/* Mobile Glows */}
                <div className="lg:hidden absolute top-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px]" />
                <div className="lg:hidden absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px]" />

                <div className="w-full max-w-md space-y-10 animate-fadeIn">
                    <div className="text-center lg:text-left space-y-3">
                        <h1 className="font-poppins text-4xl font-bold tracking-tight">{t('auth.login.submit')}</h1>
                        <p className="text-gray-400 font-medium">{t('auth.login.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-3 animate-shake">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{t('auth.login.email')}</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder={t('auth.login.emailPlaceholder')}
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500 focus:bg-white/10 transition-all outline-none text-sm font-semibold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t('auth.login.password')}</label>
                                <a href="#" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">{t('auth.login.forgotPassword')}</a>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('auth.login.passwordPlaceholder')}
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

                        <div className="flex items-center gap-3 ml-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${rememberMe ? 'bg-purple-600 border-purple-600' : 'border-white/20 group-hover:border-white/40'}`}>
                                    {rememberMe && <ArrowRight size={12} className="text-white rotate-45" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors">{t('auth.login.rememberMe')}</span>
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
                                    {t('auth.login.submit')}
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 text-center">
                        <p className="text-gray-400 font-medium text-sm">
                            {t('auth.login.noAccount')} 
                            <Link to="/register" className="text-purple-400 font-bold ml-2 hover:text-purple-300 transition-colors">
                                {t('auth.login.createAccount')}
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
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-shake { animation: shake 0.4s ease-in-out; }
            `}} />
        </div>
    );
}