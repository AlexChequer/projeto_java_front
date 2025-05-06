// src/components/Games.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  Pagination,
  CircularProgress
} from '@mui/material';

export default function Games() {
  const [items, setItems]           = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [addingId, setAddingId]     = useState(null);

  const itemsPerPage = 10;  
  const clientId     = localStorage.getItem("clientId");   

  // fetch inicial dos itens
  useEffect(() => {
    fetch('http://localhost:8080/item')
      .then(res => res.json())
      .then(data => {
        setItems(data);
      })
      .catch(err => console.error('Erro ao carregar itens:', err))
      .finally(() => setLoading(false));
  }, []);

  // filtra antes de paginar
  const filtered = items.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / itemsPerPage);

  // reset página ao mudar busca
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page      * itemsPerPage
  );

  const handleAddToCart = async game => {
    setAddingId(game.id);
    try {
      const res = await fetch(
        `http://localhost:8080/cart/${clientId}/items`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: game.id, quantity: 1 })
        }
      );
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || res.statusText);
      }
      const body = await res.json();
      alert(`${game.name} adicionado ao carrinho!\nTotal agora: R$ ${body.total.toFixed(2)}`);
    } catch (e) {
      console.error(e);
      alert(`Erro ao adicionar ${game.name}: ${e.message}`);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2} maxWidth="lg" mx="auto">
      {/* barra de busca */}
      <TextField
        label="Buscar por nome"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: 1,
          '& .MuiInputBase-input':      { color: '#000' },
          '& .MuiInputLabel-root':      { color: '#000' },
          '& .MuiOutlinedInput-notchedOutline':      { borderColor: '#ccc' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999' },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
        }}
      />

      {/* grid 5×2 */}
      <Grid container spacing={4} columns={5}>
        {paginated.map(game => (
          <Grid item xs={1} key={game.id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={game.imageUrl}
                alt={game.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {game.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.description}
                </Typography>
                <Typography variant="subtitle1" color="text.primary">
                  R$ {game.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAddToCart(game)}
                  disabled={addingId === game.id}
                >
                  {addingId === game.id ? 'Adicionando...' : 'Adicionar ao carrinho'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* paginação */}
      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="large"
            sx={{
              '& .MuiPaginationItem-root': { color: '#fff' },
              '& .Mui-selected':           { backgroundColor: '#1976d2', color: '#fff' }
            }}
          />
        </Box>
      )}
    </Box>
  );
}
