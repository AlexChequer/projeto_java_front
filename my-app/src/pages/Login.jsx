import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../services/api";
import { 
    Box, Button, TextField, Typography, Container, 
    Paper, Avatar, CircularProgress, Alert,
    FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("CLIENT");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const isAuthenticated = await login(email, password, userType);
            
            if (isAuthenticated) {
                if (userType === "ADMIN") {
                    navigate('/admin');
                } else {
                    const redirect = location.state?.redirect || '/';
                    navigate(redirect);
                }
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            console.error('Login error:', err);
            setError("Failed to login. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ 
                marginTop: 8, 
                padding: 4,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center'
            }}>
                <Avatar sx={{ margin: 1, backgroundColor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="user-type-label">Login as</InputLabel>
                        <Select
                            labelId="user-type-label"
                            id="user-type"
                            value={userType}
                            label="Login as"
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <MenuItem value="CLIENT">Client</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Login"}
                    </Button>
                    
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/register')}
                    >
                        Don't have an account? Sign up
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}