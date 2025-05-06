import { useState, useEffect, createContext } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import Cart from './pages/Cart.jsx'
import Games from './pages/Games.jsx'
import Profile from './pages/Profile.jsx'
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Button, IconButton, Toolbar, Badge, Box, Menu, MenuItem, Typography } from '@mui/material'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'
import cartService from './services/cartService';
import { isAuthenticated, logout } from './services/api';

// Create auth context for global state
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Check if user is logged in on page load
  useEffect(() => {
    const authStatus = isAuthenticated();
    const userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const clientId = localStorage.getItem('clientId');
    
    if (authStatus) {
      setAuthenticated(true);
      setUser({
        id: userType === 'ADMIN' ? localStorage.getItem('adminId') : clientId,
        name: userName,
        email: userEmail,
        role: userType
      });
      
      // Fetch cart count for badge if user is a client
      if (userType === 'CLIENT' && clientId) {
        fetchCartCount(clientId);
      }
    }
  }, [location.pathname]); // Refresh when route changes
  
  // Fetch cart items count for the badge
  const fetchCartCount = async (clientId) => {
    try {
      const cartData = await cartService.getCartByClientId(clientId);
      if (cartData && cartData.items) {
        setCartCount(cartData.items.length);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
  
  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    setCartCount(0);
    navigate('/');
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };
  
  const goToAdmin = () => {
    handleMenuClose();
    navigate('/admin');
  };
  
  // Determine if we should show the navbar
  const hideNavbar = location.pathname === "/register" || location.pathname === "/login" || location.pathname === "/admin";
  
  // User menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {user?.role === 'CLIENT' && <MenuItem onClick={goToProfile}>My Profile</MenuItem>}
      {user?.role === 'ADMIN' && <MenuItem onClick={goToAdmin}>Admin Dashboard</MenuItem>}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated: authenticated, user, setUser, setIsAuthenticated: setAuthenticated }}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/games' element={<Games />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
      
      {!hideNavbar && (
        <AppBar position="fixed" sx={{ backgroundColor: '#202020', top: 'auto', bottom: 0 }}>
          <Toolbar>
            <Button color="inherit" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate("/games")}>
              Games
            </Button>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {authenticated ? (
              <>
                {user?.role === 'CLIENT' && (
                  <IconButton 
                    color="inherit" 
                    onClick={() => navigate("/cart")}
                    sx={{ mr: 2 }}
                  >
                    <Badge badgeContent={cartCount} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {user?.name}
                  </Typography>
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="account"
                    onClick={handleProfileMenuOpen}
                  >
                    <AccountCircle />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box>
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      )}
      
      {renderMenu}
    </AuthContext.Provider>
  )
}

export default App
