import axios from 'axios';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api/v1';

const AuthService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            return token;
        } catch (error) {
            console.error('Erro no login:', error.response);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    register: async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/register`, { name, email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            return token;
        } catch (error) {
            console.error('Erro durante o registro:', error.response);
            throw error;
        }
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwt_decode(token);
            return decodedToken;
        }
        return null;
    },
};

export default AuthService;
