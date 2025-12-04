import { useState, useEffect } from 'react';
import { getCurrentUser } from '../api/AuthService';
import { getToken, removeToken } from '../api/apiClient'; 

// Գլոբալ Իրադարձության Անունը (Event Name)
const AUTH_EVENT = 'authChange';

const useAuthStatus = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = async () => {
        const token = getToken();
        setIsLoading(true);

        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await getCurrentUser();
            setUser(response.data); 
        } catch (error) {
            if (error.response && error.response.status === 401) {
                removeToken();
            }
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 1. Սկզբնական ստուգում
        checkAuthStatus(); 

        window.addEventListener(AUTH_EVENT, checkAuthStatus);
        
        // vor RAM um anpetq tex chpahi
        return () => {
            window.removeEventListener(AUTH_EVENT, checkAuthStatus);
        };
    }, []);

    return {
        isAuthenticated: !!user,
        role: user ? user.role : null,
        isLoading: isLoading,
        user: user,
        // AUTH_EVENT-ը դուրս ենք բերում, որպեսզի այլ բաղադրիչներ կարողանան այն օգտագործել
        AUTH_EVENT 
    };
};

export default useAuthStatus;