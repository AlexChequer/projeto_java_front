import { useState } from 'react'
import './App.css'
import  Home  from './pages/Home.jsx'
import  Cart  from './pages/Cart.jsx'
import  Games  from './pages/Games.jsx'
import  Profile  from './pages/Profile.jsx'
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Route, Routes, useNavigate } from 'react-router-dom'
import { AppBar, Button, IconButton, Toolbar } from '@mui/material'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  function addToCart(element) {
    setCart([...cart, element])
  }
  console.log(cart)
  return (
    <>
      
      <Routes>
        <Route path='/' element={<Home addToCart={addToCart}></Home>}/>
        <Route path='/games' element={<Games addToCart={addToCart}></Games>}/>
        <Route path='/cart' element={<Cart cart={cart}></Cart>}/>
        <Route path='/profile' element={<Profile></Profile>}/>
        <Route path='/login' element={<Login></Login>}/>
        <Route path='/register' element={<Register></Register>}/>
        <Route path='/admin' element={<Admin></Admin>}/>
      </Routes>
      {window.location.pathname == "/register" || window.location.pathname == "/login" ? null :
        window.location.pathname == "/admin"? 
        <AppBar sx={{ backgroundColor: '#202020' }}>
          <Toolbar>
            <Button color="inherit" onClick={() => navigate("/")}>
              Sair da sessão
            </Button>
          </Toolbar>
        </AppBar>
        
        :
        <AppBar sx={{ backgroundColor: '#202020' }}>
          <Toolbar>
            <Button color="inherit" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate("/cart")}>
              Cart
            </Button>
            <Button color="inherit" onClick={() => navigate("/games")}>
              Games
            </Button>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 , ml:"auto"}}
              onClick={() => navigate("/profile")}
            >
              <AccountCircle/>
            </IconButton>
          </Toolbar>
        </AppBar>
      }

    </>
  )
}

export default App
