import axios from 'axios';

// Busca a URL do .env ou do window.APP_CONFIG (conforme discutimos antes)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL,
});

// Interceptor: Adiciona o token em TODA requisição automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor: Lida com erro 401 (token expirado) globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se o erro for 401 e NÃO for na rota de login
        if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);