// src/config/index.js
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080';
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/api';

export const API_URL = `${API_HOST}${API_BASE_PATH}`;