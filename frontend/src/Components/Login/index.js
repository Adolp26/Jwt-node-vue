import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Services/AuthContext';
import styles from './login.module.css';


function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/annotations'); // Redirecionar para a página após o login
        } catch (error) {
            console.error('Erro durante o login:', error);
        }
    };

    return (
        <div className={styles['position-container']}>
            <div className={styles['login-container']}>
                <h2 className={styles['login-title']}>Login</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles['login-input']}
                        />
                    </label>
                    <label>
                        Senha:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles['login-input']}
                        />
                    </label>
                    <button type="submit" className={styles['login-button']}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
