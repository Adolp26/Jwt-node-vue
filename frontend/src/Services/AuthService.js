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

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userId', userId);
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
            const token = sessionStorage.getItem('token');

            if (!token) {
                console.error('Token não encontrado no armazenamento local');
                return;
            }
            await axios.post(`${API_URL}/logout`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            sessionStorage.removeItem('token');
        } catch (error) {
            console.error('Erro durante o logout:', error.response.data.error || 'Erro desconhecido');
            throw error.response.data;
        }
    },

    register: async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/register`, { name, email, password });
            const { token } = response.data;
            sessionStorage.setItem('token', token);
            return token;
        } catch (error) {
            console.error('Erro durante o registro:', error.response.data.error || 'Erro desconhecido');
            throw error.response.data;
        }
    },

    getCurrentUser: () => {
        const token = sessionStorage.getItem('token');
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
