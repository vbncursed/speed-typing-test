import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onLogin: (token: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/auth/login', { username, password });
            const { token } = response.data;
            if (token) {
                localStorage.setItem('token', token);  // Сохранение токена в localStorage
                onLogin(token, username);
                alert('Авторизация успешна!');
                navigate('/'); // Redirect to the main page
            } else {
                setError('Авторизация не удалась: токен не получен');
            }
        } catch (err) {
            setError('Неверное имя пользователя или пароль');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Typography component="h1" variant="h5">
                Вход
            </Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}
            <Button
                type="submit"
                fullWidth
                variant="contained"
				color="secondary"
                sx={{ mt: 3, mb: 2 }}
            >
                Вход
            </Button>
        </Box>
    );
};

export default Login;
