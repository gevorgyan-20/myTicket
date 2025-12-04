import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus'; 
import { logout } from '../api/AuthService'; 
import { getUserTickets } from '../api/ticketService';

const AUTH_EVENT = 'authChange'; 

const UserPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { isAuthenticated, user, isLoading } = useAuthStatus();

    const handleLogout = async () => {
        try {
            await logout();

            window.dispatchEvent(new Event(AUTH_EVENT));

            navigate("/", { replace: true }); 
        } catch (error) {
            console.error("Logout failed:", error);
            navigate("/", { replace: true }); 
        }
    };

    if (isLoading) {
        return <div className="loading-center">Loading...</div>;
    }
    
    return (
        <div className="user-profile-container">
            <div className="profile-card">
                <h1 className="profile-title">
                   <i className="profile-icon"></i>
                   <span>My Profile</span>
                </h1>

                <div className="details-section">
                    <h2 className="section-title">Account Details</h2>
                    
                    <div className="detail-row">
                        <span className="detail-label">Name:</span> <span>{user.name || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Email:</span> <span>{user.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Role:</span> <span>{user.role || 'user'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Account Created:</span> <span>{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="tickets-section">
                    <h2 className="section-title">My Booked Tickets</h2>
                    
                    <div className="no-tickets-message">
                        You currently have no booked tickets.
                    </div>
                </div>

                <div className="logout-area">
                    <button 
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UserPage;