// src/services/authService.js
import apiClient from './apiClient';

class AuthService {
    async register(registerData) {
        try {
            const response = await apiClient.post('/auth/register', registerData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.response?.data || error.message || "Registration failed");
        }
    }

    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            const authData = response.data;

            if (authData && authData.accessToken) {
                localStorage.setItem('authToken', authData.accessToken);
                // FIX: Lưu trữ thông tin user nhất quán
                localStorage.setItem('user', JSON.stringify(authData));
            }
            return authData;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.response?.data || error.message || "Login failed");
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error("Error parsing user data from localStorage:", e);
            this.logout();
            return null;
        }
    }
}

export default new AuthService();