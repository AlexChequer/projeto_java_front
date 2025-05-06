import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Button, Container, Grid, Typography, 
    Card, CardMedia, CardContent, CardActions,
    CircularProgress, Badge, Fab
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import itemService from '../services/itemService';
import cartService from '../services/cartService';

export default function Home() {
    const navigate = useNavigate();
    const [featuredGames, setFeaturedGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    
    const isClient = localStorage.getItem('isAuthenticated') === 'true' && 
                    localStorage.getItem('userType') === 'CLIENT';
    const clientId = localStorage.getItem('clientId');

    useEffect(() => {
        const fetchFeaturedGames = async () => {
            try {
                setLoading(true);
                const allGames = await itemService.getAllItems();
                setFeaturedGames(Array.isArray(allGames) ? allGames.slice(0, 3) : []);
            } catch (error) {
                console.error('Error fetching featured games:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedGames();
        
        if (isClient && clientId) {
            fetchCartCount();
        }
    }, [clientId, isClient]);
    
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

    return (
        <Box sx={{ 
            paddingTop: 8, 
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(to bottom, #1a1a1a, #303030)',
            position: 'relative'  
        }}>
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

            <Box 
                sx={{ 
                    bgcolor: 'background.paper',
                    pt: 8, 
                    pb: 6,
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/gta.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        gutterBottom
                    >
                        Game Store
                    </Typography>
                    <Typography variant="h5" align="center" paragraph>
                        Discover the best games at the best prices. From action-packed adventures to mind-bending puzzles,
                        we have something for every type of gamer.
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/games')}>
                            Browse Games
                        </Button>
                        {isClient && (
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                size="large"
                                onClick={() => navigate('/cart')}
                                startIcon={<ShoppingCartIcon />}
                            >
                                Go to Cart {cartCount > 0 && `(${cartCount})`}
                            </Button>
                        )}
                        {!isClient && !localStorage.getItem('isAuthenticated') && (
                            <Button variant="outlined" color="primary" size="large" onClick={() => navigate('/register')}>
                                Sign Up
                            </Button>
                        )}
                    </Box>
                </Container>
            </Box>

            <Container sx={{ py: 8 }} maxWidth="lg">
                <Typography variant="h4" component="h2" sx={{ mb: 4, color: 'white' }}>
                    Featured Games
                </Typography>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : featuredGames.length > 0 ? (
                    <Grid container spacing={4}>
                        {featuredGames.map((game) => (
                            <Grid item key={game.id} xs={12} sm={6} md={4}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        bgcolor: '#2a2a2a',
                                        color: 'white',
                                        transition: '0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={game.imageUrl || '/gta.png'}
                                        alt={game.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {game.name}
                                        </Typography>
                                        <Typography>
                                            {game.description && game.description.length > 100 
                                                ? `${game.description.substring(0, 100)}...` 
                                                : game.description || 'No description available'}
                                        </Typography>
                                        <Typography variant="h6" sx={{ mt: 2, color: '#90caf9' }}>
                                            R${game.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={() => navigate('/games')}>
                                            View Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            No featured games available
                        </Typography>
                    </Box>
                )}
                
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={() => navigate('/games')}
                    >
                        View All Games
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
