import axios from 'axios';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const API_URL = 'http://localhost:3030/api/v1';

const AuthService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            return token;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    async register(name, email, password) {
        try {
            const response = await axios.post(`${API_URL}/register`, { name, email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            return token;
        } catch (error) {
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
