import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Services/AuthContext';
import styles from './login.module.css';


function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const success = await login(email, password);
            if (success) {
                setTimeout(() => {
                    navigate('/annotations'); // Redirecionar para a página após o login
                }, 1000); // Aguardar 2 segundos antes de redirecionar
            } else {
                setError('Email ou senha incorretos');
            }
        } catch (error) {
            console.error('Erro durante o login:', error);
            setError('Ocorreu um erro durante o login');
        }
    };

    return (
        <div className={styles['position-container']}>
            <div className={styles['login-container']}>
                <h2 className={styles['login-title']}>Login</h2>
                {error && <p className={styles['error-message']}>{error}</p>}
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
                <button onClick={() => navigate('/register')} className={styles['login-register-button']}>
                    Não é cadastrado? clique aqui
                </button>
            </div>
        </div>
    );
}

export default Login;
