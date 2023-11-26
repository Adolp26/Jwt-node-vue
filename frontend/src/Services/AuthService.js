import axios from 'axios';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';


const AuthService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token } = response.data;
            const decodedToken = jwt_decode(token);

            const userId = decodedToken._id; // Utilizando o _id como userId

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            console.log(userId)
            console.log(token)

            return token;
        } catch (error) {
            console.error('Erro no login:', error.response.data.error || 'Erro desconhecido');
            throw error.response.data;
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/logout`);
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Erro durante o logout:', error.response.data.error || 'Erro desconhecido');
            throw error.response.data;
        }
    },

    register: async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/register`, { name, email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            return token;
        } catch (error) {
            console.error('Erro durante o registro:', error.response.data.error || 'Erro desconhecido');
            throw error.response.data;
        }
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                return decodedToken;
            } catch (error) {
                console.error('Erro ao decodificar token:', error.message);
                return null;
            }
        }
        return null;
    },
};

export default AuthService;
