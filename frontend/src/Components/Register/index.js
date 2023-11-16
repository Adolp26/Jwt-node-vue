// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Services/AuthContext';

function Register() {
    /**
     * Navegador utilizado para redirecionar o usuário para outra página.
     * @type {function}
     */
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            console.log('Registro realizado com sucesso!')
            navigate('/login'); // Redirecionar para a página de login após o registro
        } catch (error) {
            console.error('Erro durante o registro:', error);
        }
    };

    return (
        <div>
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
                <label>
                    Nome:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Senha:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;