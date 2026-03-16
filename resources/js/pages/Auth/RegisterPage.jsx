import React, { useState } from "react";
import { register as registerApi } from "../../api/AuthService";
import { useNavigate, Link } from "react-router-dom";

const AUTH_EVENT = 'authChange';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        last_name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
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

        if (form.password !== form.password_confirmation) {
            setError("Passwords do not match");
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
                "Registration failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-glow auth-bg-glow--1"></div>
            <div className="auth-bg-glow auth-bg-glow--2"></div>

            <div className="auth-page-content">
                <h1 className="auth-logo">MyTicket</h1>
                <p className="auth-subtitle">Please enter your phone number to login</p>

                {error && <div className="auth-error-box">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-row-2">
                        <div className="auth-input-group">
                            <label className="auth-input-label">Name</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    name="name"
                                    placeholder="First name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-input-label">Last name</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    name="last_name"
                                    placeholder="Last name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <div className="auth-phone-row">
                            <div className="auth-country-code">
                                <span className="auth-flag">🇺🇸</span>
                                <span className="auth-code">+1</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                            <div className="auth-phone-input-wrapper">
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-input-label">Email</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M22 7l-10 7L2 7" />
                                </svg>
                            </span>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-input-label">Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="auth-options-row">
                        <label className="auth-checkbox-label">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                            />
                            <span className="auth-checkmark"></span>
                        </label>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? "Sign up..." : "Sign up"}
                    </button>
                </form>

                <div className="auth-switch-link">
                    <span>Have a MyTicket account? </span>
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}