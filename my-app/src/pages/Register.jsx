import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clientService from "../services/clientService";
import { 
    Box, Button, TextField, Typography, Container, 
    Paper, Avatar, CircularProgress, Alert
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        setLoading(true);
        setError("");
        
        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };
            
            const newUser = await clientService.registerClient(userData);
            
            localStorage.setItem('clientId', newUser.id);
            localStorage.setItem('userName', newUser.name);
            localStorage.setItem('userRole', newUser.role || 'CLIENT');
            
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            setError("Registration failed. Please try again.");
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
                    <PersonAddIcon />
                </Avatar>
                
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 3, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={formData.name}
                        onChange={handleChange}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Register"}
                    </Button>
                    
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/login')}
                    >
                        Already have an account? Sign in
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}