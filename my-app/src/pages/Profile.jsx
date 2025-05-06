import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import clientService from "../services/clientService";
import orderService from "../services/orderService";
import { 
    Box, Button, Typography, Container, CircularProgress, 
    Paper, Avatar, Divider, Grid, Card, CardContent, 
    Tabs, Tab, Alert, List, ListItem, ListItemText
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [client, setClient] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const [orderSuccess, setOrderSuccess] = useState(false);
    
    const clientId = localStorage.getItem('clientId');
    
    useEffect(() => {
        // Check for successful order from location state
        if (location.state?.orderSuccess) {
            setOrderSuccess(true);
        }
        
        // Redirect to login if not logged in
        if (!clientId) {
            navigate('/login', { state: { redirect: '/profile' } });
            return;
        }
        
        fetchUserData();
    }, [clientId, navigate, location.state]);
    
    const fetchUserData = async () => {
        try {
            setLoading(true);
            
            // Fetch client data
            const clientData = await clientService.getClientById(clientId);
            setClient(clientData);
            
            // Fetch order history
            const orderData = await orderService.getOrdersByClientId(clientId);
            setOrders(orderData);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to load user data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    
    const handleLogout = () => {
        // Clear user session data
        localStorage.removeItem('clientId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };
    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        <Container sx={{ paddingTop: 10, paddingBottom: 5 }}>
            {orderSuccess && (
                <Alert 
                    severity="success" 
                    sx={{ mb: 3 }}
                    onClose={() => setOrderSuccess(false)}
                >
                    Your order has been placed successfully!
                </Alert>
            )}
            
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                        <AccountCircleIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h5">{client?.name || 'User'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {client?.email || 'email@example.com'}
                        </Typography>
                    </Box>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        sx={{ ml: 'auto' }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab label="Account Details" />
                            <Tab label="Order History" />
                        </Tabs>
                    </Box>
                    
                    {/* Account Details Tab */}
                    <Box role="tabpanel" hidden={tabValue !== 0} sx={{ pt: 3 }}>
                        {tabValue === 0 && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>Personal Information</Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                                    <Typography variant="body1">{client?.name}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                                    <Typography variant="body1">{client?.email}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" color="text.secondary">Account Type</Typography>
                                                    <Typography variant="body1">{client?.role || 'Customer'}</Typography>
                                                </Grid>
                                            </Grid>
                                            
                                            <Button 
                                                variant="contained" 
                                                color="primary"
                                                sx={{ mt: 3 }}
                                                onClick={() => navigate('/games')}
                                            >
                                                Browse Games
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                    
                    {/* Order History Tab */}
                    <Box role="tabpanel" hidden={tabValue !== 1} sx={{ pt: 3 }}>
                        {tabValue === 1 && (
                            <>
                                {orders.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 5 }}>
                                        <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                                        <Typography variant="h6" sx={{ mt: 2 }}>
                                            No orders yet
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Your order history will appear here when you make your first purchase.
                                        </Typography>
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            sx={{ mt: 2 }}
                                            onClick={() => navigate('/games')}
                                        >
                                            Browse Games
                                        </Button>
                                    </Box>
                                ) : (
                                    <Grid container spacing={3}>
                                        {orders.map((order) => (
                                            <Grid item xs={12} key={order.id}>
                                                <Card sx={{ mb: 2 }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                            <Typography variant="h6">Order #{order.id}</Typography>
                                                            <Typography variant="body2" color="primary">
                                                                Status: {order.status || 'Processing'}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        <Divider sx={{ mb: 2 }} />
                                                        
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Order Date
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {formatDate(order.paymentDate)}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Total
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    R${order.total?.toFixed(2) || '0.00'}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        
                                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                                                            Items
                                                        </Typography>
                                                        
                                                        <List dense>
                                                            {order.items?.map((item) => (
                                                                <ListItem key={item.id}>
                                                                    <ListItemText 
                                                                        primary={item.name} 
                                                                        secondary={`R$${item.price?.toFixed(2) || '0.00'}`} 
                                                                    />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}