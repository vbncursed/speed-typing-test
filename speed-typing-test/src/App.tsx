import React, { useState, useEffect } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { createTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import SpeedTypingTest from "./SpeedTypingTest";
import Register from "./Register";
import Profile from "./Profile";
import Login from "./Login";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Container,
  CssBaseline,
  Box,
  IconButton,
  Tooltip,
  ThemeProvider,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F6F6F6", // Новый цвет фона для светлой темы
      paper: "#FFFFFF", // Цвет для элементов
    },
    primary: {
      main: "#FFCB74", // Новый основной цвет
    },
    secondary: {
      main: "#2F2F2F", // Новый вторичный цвет
    },
    text: {
      primary: "#111111", // Цвет текста
      secondary: "#2F2F2F", // Вторичный цвет текста
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "Calibri, Arial, sans-serif",
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
    mode: "dark",
    background: {
      default: "#111111", // Новый цвет фона для темной темы
      paper: "#2F2F2F", // Цвет для элементов
    },
    primary: {
      main: "#FFCB74", // Новый основной цвет
    },
    secondary: {
      main: "#F6F6F6", // Новый вторичный цвет
    },
    text: {
      primary: "#F6F6F6", // Цвет текста
      secondary: "#FFCB74", // Вторичный цвет текста
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "Calibri, Arial, sans-serif",
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
    const root = document.documentElement;
    if (isDarkTheme) {
      root.style.setProperty("--background-color", "#111111");
      root.style.setProperty("--text-color", "#F6F6F6");
    } else {
      root.style.setProperty("--background-color", "#F6F6F6");
      root.style.setProperty("--text-color", "#111111");
    }
  }, [isDarkTheme]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (token: string, username: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    delete axios.defaults.headers.common["Authorization"];
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
          <Tooltip
            title={
              isDarkTheme ? "Включить светлую тему" : "Включить темную тему"
            }
          >
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
          <MainMenu
            handleLogout={handleLogout}
            isAuthenticated={isAuthenticated}
            username={username}
          />
        </Box>
        <Container maxWidth="sm">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={<SpeedTypingTest />} />
            <Route path="/profile" element={<Profile username={username} />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

const MainMenu: React.FC<{
  handleLogout: () => void;
  isAuthenticated: boolean;
  username: string | null;
}> = ({ handleLogout, isAuthenticated, username }) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      {location.pathname !== "/register" && !isAuthenticated && (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/register"
          style={{ marginRight: "10px" }}
        >
          Регистрация
        </Button>
      )}
      {location.pathname !== "/login" && !isAuthenticated && (
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/login"
          style={{ marginRight: "10px" }}
        >
          Вход
        </Button>
      )}
      {isAuthenticated && username && (
        <Box>
          <Button variant="contained" color="inherit" onClick={handleClick}>
            {username}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            MenuListProps={{
              sx: {
                minWidth: anchorEl ? anchorEl.clientWidth : undefined,
              },
            }}
          >
            <MenuItem component={Link} to="/profile" onClick={handleClose}>
              Профиль
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              Выход
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default App;
