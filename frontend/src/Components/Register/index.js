// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Services/AuthContext';

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Limpar o estado de erro antes de tentar o registro novamente
            setError(null);

            // Verificar se os campos obrigatórios estão preenchidos
            if (!name || !email || !password) {
                setError('Todos os campos são obrigatórios');
                return;
            }

            // Chamar a função de registro
            await register(name, email, password);

            console.log('Registro realizado com sucesso!');
            navigate('/login');
        } catch (error) {
            console.error('Erro durante o registro:', error);

            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Erro durante o registro. Por favor, tente novamente.');
            }
        }
    };

    return (
        <div>
            <h2>Registro</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
}

export default Register;
