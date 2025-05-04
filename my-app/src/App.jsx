import { useState } from 'react'
import './App.css'
import  Home  from './pages/Home.jsx'
import  Cart  from './pages/Cart.jsx'
import  Games  from './pages/Games.jsx'
import  Profile  from './pages/Profile.jsx'
import { Route, Router, Routes, useNavigate } from 'react-router-dom'
import { AppBar, Button, Toolbar } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
      <Routes>
        <Route path='/' element={<Home></Home>}/>
        <Route path='/games' element={<Games></Games>}/>
        <Route path='/cart' element={<Cart></Cart>}/>
        <Route path='/profile' element={<Profile></Profile>}/>
      </Routes>

      <AppBar>
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
          <Button color="inherit" onClick={() => navigate("/profile")}>
            Profile
          </Button>
        </Toolbar>
      </AppBar>

    </>
  )
}

export default App
