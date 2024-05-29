import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Container, CssBaseline, Box, IconButton, Tooltip, ThemeProvider, Button, Popover } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeIcon from '@mui/icons-material/Home';
import Register from './Register';
import Login from './Login';
import SpeedTypingTest from './SpeedTypingTest';
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#4CAF50',
        },
        secondary: {
            main: '#FF5722',
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: 'Calibri, Arial, sans-serif',
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 500,
        },
        body1: {
            fontWeight: 400,
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#4CAF50',
        },
        secondary: {
            main: '#FF5722',
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: 'Calibri, Arial, sans-serif',
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 500,
        },
        body1: {
            fontWeight: 400,
        },
    },
});

const App: React.FC = () => {
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
            setUsername(storedUsername);
        }
    }, []);

    const handleLogin = (token: string, username: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
        setUsername(username);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUsername(null);
    };

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    return (
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
            <CssBaseline />
            <Router>
                <Box position="absolute" top={16} right={16}>
                    <Tooltip title={isDarkTheme ? "Включить светлую тему" : "Включить темную тему"}>
                        <IconButton onClick={toggleTheme} color="inherit">
                            {isDarkTheme ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box position="absolute" top={16} left={16}>
                    <Tooltip title="На главную">
                        <IconButton component={Link} to="/" color="inherit">
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box position="absolute" top={16} right={80}>
                    <MainMenu handleLogout={handleLogout} isAuthenticated={isAuthenticated} username={username} />
                </Box>
                <Container maxWidth="sm">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/" element={<SpeedTypingTest />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
};

const MainMenu: React.FC<{ handleLogout: () => void, isAuthenticated: boolean, username: string | null }> = ({ handleLogout, isAuthenticated, username }) => {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box>
            {location.pathname !== '/register' && !isAuthenticated && (
                <Button variant="contained" color="primary" component={Link} to="/register" style={{ marginRight: '10px' }}>
                    Регистрация
                </Button>
            )}
            {location.pathname !== '/login' && !isAuthenticated && (
                <Button variant="contained" color="secondary" component={Link} to="/login" style={{ marginRight: '10px' }}>
                    Вход
                </Button>
            )}
            {isAuthenticated && username && (
                <Box>
                    <Button variant="contained" color="inherit" onClick={handleClick}>
                        {username}
                    </Button>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Button variant="contained" color="inherit" onClick={handleLogout} style={{ marginTop: '10px' }}>
                            Выход
                        </Button>
                    </Popover>
                </Box>
            )}
        </Box>
    );
};

export default App;