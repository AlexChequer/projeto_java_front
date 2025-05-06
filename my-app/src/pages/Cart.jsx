import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import orderService from "../services/orderService";
import { 
    Box, Container, Typography, Button, List, ListItem, 
    ListItemText, IconButton, Divider, CircularProgress, 
    Card, CardContent, CardMedia, Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const clientId = localStorage.getItem('clientId');
    
    useEffect(() => {
        if (!clientId) {
            navigate('/login', { state: { redirect: '/cart' } });
            return;
        }
        
        fetchCart();
    }, [clientId, navigate]);
    
    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await cartService.getCartByClientId(clientId);
            setCart(data);
        } catch (err) {
            setError('Failed to load cart. Please try again later.');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleIncreaseQuantity = async (cartItem) => {
        try {
            await cartService.updateItemInCart(clientId, cartItem.item.id, { 
                quantity: cartItem.quantity + 1 
            });
            fetchCart(); 
        } catch (err) {
            console.error('Error updating item quantity:', err);
            alert('Failed to update quantity. Please try again.');
        }
    };
    
    const handleDecreaseQuantity = async (cartItem) => {
        if (cartItem.quantity <= 1) {
            handleRemoveItem(cartItem.item.id);
            return;
        }
        
        try {
            await cartService.updateItemInCart(clientId, cartItem.item.id, { 
                quantity: cartItem.quantity - 1 
            });
            fetchCart(); 
        } catch (err) {
            console.error('Error updating item quantity:', err);
            alert('Failed to update quantity. Please try again.');
        }
    };
    
    const handleRemoveItem = async (itemId) => {
        try {
            await cartService.removeItemFromCart(clientId, itemId);
            fetchCart(); 
        } catch (err) {
            console.error('Error removing item from cart:', err);
            alert('Failed to remove item. Please try again.');
        }
    };
    
    const handleCheckout = async () => {
        try {
            setLoading(true);
            const order = await orderService.checkout(clientId);
            
            navigate('/profile', { state: { orderSuccess: true, order } });
        } catch (err) {
            console.error('Error during checkout:', err);
            setError('Checkout failed. Please try again later.');
        } finally {
            setLoading(false);
        }
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
        <Container sx={{ paddingTop: 10, paddingBottom: 5 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Your Cart
            </Typography>
            
            {!cart || !cart.items || cart.items.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 5 }}>
                    <Typography variant="h6" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => navigate('/games')}
                        sx={{ mt: 2 }}
                    >
                        Browse Games
                    </Button>
                </Box>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {cart.items.map((cartItem) => (
                            <Grid item xs={12} key={cartItem.item.id}>
                                <Card sx={{ display: 'flex', mb: 2 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 150 }}
                                        image={cartItem.item.imageUrl || '/gta.png'}
                                        alt={cartItem.item.name}
                                    />
                                    <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <Typography component="h5" variant="h5">
                                                {cartItem.item.name}
                                            </Typography>
                                            <IconButton 
                                                edge="end" 
                                                aria-label="delete"
                                                onClick={() => handleRemoveItem(cartItem.item.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                        
                                        <Typography variant="subtitle1" color="text.secondary" component="p">
                                            R${cartItem.item.price.toFixed(2)}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                            <IconButton onClick={() => handleDecreaseQuantity(cartItem)}>
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography sx={{ mx: 2 }}>
                                                {cartItem.quantity}
                                            </Typography>
                                            <IconButton onClick={() => handleIncreaseQuantity(cartItem)}>
                                                <AddIcon />
                                            </IconButton>
                                            
                                            <Typography variant="h6" sx={{ ml: 'auto' }}>
                                                R${cartItem.subtotal.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">Total:</Typography>
                        <Typography variant="h5">R${cart.total.toFixed(2)}</Typography>
                    </Box>
                    
                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        size="large"
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </Button>
                </>
            )}
        </Container>
    );
}