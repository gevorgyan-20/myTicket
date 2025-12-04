import React, { useState } from "react";
import { login as loginApi } from "../../api/AuthService";
import { useNavigate, useLocation, Link } from "react-router-dom";

const AUTH_EVENT = 'authChange'; 

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
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

        try {
            setLoading(true);
            setError("");

            await loginApi(form);

            window.dispatchEvent(new Event(AUTH_EVENT));

            navigate(-1) 
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.errors?.email?.[0] ||
                "Sign in failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={() => navigate(-1)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                
                <button className="close-btn" onClick={() => navigate(-1)}>×</button>
                <h2 className = 'title-h2-m main-font-semibold'>Log in / Sign In</h2>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit}>
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

                    <button type="submit" disabled={loading}>
                        {loading ? <div className="loading-center">Log In...</div> : <div className="loading-center">Log In</div>}
                    </button>
                </form>

                <div className="modal-footer">
                    <p>Dont have an account?</p>
                    <Link to="/register" state={{ backgroundLocation: location }}>
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}