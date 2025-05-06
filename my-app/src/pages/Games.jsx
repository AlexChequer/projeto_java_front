import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import itemService from "../services/itemService";
import categoryService from "../services/categoryService";
import cartService from "../services/cartService";
import { 
    Button, Card, CardActions, CardContent, CardMedia, Grid, Typography, Box,
    Container, CircularProgress, Fab, Badge, Snackbar, Alert
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Games() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    
    const isClient = localStorage.getItem('isAuthenticated') === 'true' && 
                     localStorage.getItem('userType') === 'CLIENT';
    const clientId = localStorage.getItem('clientId') || null;

    useEffect(() => {
        // Fetch all games when component mounts
        const fetchGames = async () => {
            try {
                setLoading(true);
                const data = await itemService.getAllItems();
                
                // Garantir que games é sempre um array
                setGames(Array.isArray(data) ? data : []);
                
                console.log('Games carregados:', data);
            } catch (err) {
                setError('Failed to load games. Please try again later.');
                console.error('Error fetching games:', err);
                setGames([]);  // Initialize as empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
        
        // Fetch cart count if user is logged in as client
        if (isClient && clientId) {
            fetchCartCount();
        }
    }, [isClient, clientId]);
    
    const fetchCartCount = async () => {
        try {
            const cartData = await cartService.getCartByClientId(clientId);
            if (cartData && cartData.items) {
                setCartCount(cartData.items.length);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const handleAddToCart = async (game) => {
        if (!clientId) {
            setSnackbarMessage('Please login to add items to your cart');
            setSnackbarOpen(true);
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        try {
            // Add item to cart using the API
            await cartService.addItemToCart(clientId, { item: game });
            setSnackbarMessage(`${game.name} added to cart!`);
            setSnackbarOpen(true);
            
            // Update cart count
            fetchCartCount();
        } catch (err) {
            console.error('Error adding game to cart:', err);
            setSnackbarMessage('Failed to add game to cart. Please try again.');
            setSnackbarOpen(true);
        }
    };
    
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            {/* Botão do Carrinho Flutuante (só aparece se o cliente estiver logado) */}
            {isClient && (
                <Fab 
                    color="primary" 
                    aria-label="cart"
                    onClick={() => navigate('/cart')}
                    sx={{ 
                        position: 'fixed', 
                        bottom: 80, 
                        right: 20,
                        zIndex: 1000
                    }}
                >
                    <Badge badgeContent={cartCount} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </Fab>
            )}
            
            <Container sx={{ paddingTop: 10, paddingBottom: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        Available Games
                    </Typography>
                    
                    {isClient && (
                        <Button 
                            variant="contained" 
                            color="secondary"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => navigate('/cart')}
                        >
                            View Cart {cartCount > 0 && `(${cartCount})`}
                        </Button>
                    )}
                </Box>
                
                {games.length === 0 ? (
                    <Typography>No games available at the moment.</Typography>
                ) : (
                    <Grid container spacing={4}>
                        {games.map((game) => (
                            <Grid item key={game.id} xs={12} sm={6} md={4}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={game.imageUrl || '/gta.png'} // Fallback to default image
                                        alt={game.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {game.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {game.description || 'No description available'}
                                        </Typography>
                                        <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                                            R${game.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button 
                                            fullWidth
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => handleAddToCart(game)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
            
            {/* Snackbar para notificações */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={3000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarMessage.includes('added') ? "success" : "info"} 
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}