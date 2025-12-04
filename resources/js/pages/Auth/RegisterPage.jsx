import React from 'react';

import { useState } from "react";
import { register as registerApi } from "../../api/AuthService";
import { useNavigate, useLocation, Link } from "react-router-dom";

const AUTH_EVENT = 'authChange'; 

export default function RegisterPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

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

            // Notify all components listening to auth status change (e.g., Header)
            window.dispatchEvent(new Event(AUTH_EVENT));

            const backgroundLocation = location.state?.backgroundLocation || '/'; 
            
            navigate('/login', {
                state: {
                    backgroundLocation: backgroundLocation
                }
            });
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
        <div className="modal-overlay" onClick={() => navigate(-1)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                
                <button className="close-btn" onClick={() => navigate(-1)}>×</button>
                <h2 className = 'title-h2-m main-font-semibold'>Sign Up / Register</h2>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit}>

                    <input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                    />

                    <input
                        name="password_confirmation"
                        type="password"
                        placeholder="Repeat password"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? <div className="loading-center">Register...</div> : <div className="loading-center">Register</div>}
                    </button>
                </form>

                <div className="modal-footer">
                    <p>Already have an account?</p>
                    <Link to="/login" state={{ backgroundLocation: location }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}