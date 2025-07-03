import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng từ localStorage:", error);
            authService.logout();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const authData = await authService.login(credentials);
            const { accessToken } = authData;
            if (accessToken) {
                setUser(authData);
            }
            return authData;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const register = async (userData) => {
        await authService.register(userData);
    };

    const updateUser = (updatedUserData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...updatedUserData
        }));
        
        // Update localStorage
        const currentStoredUser = authService.getCurrentUser();
        if (currentStoredUser) {
            const updatedStoredUser = {
                ...currentStoredUser,
                ...updatedUserData
            };
            localStorage.setItem('user', JSON.stringify(updatedStoredUser));
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            isAuthenticated: !!user, 
            login, 
            logout, 
            register,
            updateUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};