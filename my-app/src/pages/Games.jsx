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
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);

    const itemsPerPage = 6;
    const clientId = localStorage.getItem("clientId");

    useEffect(() => {
        fetch('http://localhost:8080/item')
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error('Erro ao carregar itens:', err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = items.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const pageCount = Math.ceil(filtered.length / itemsPerPage);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const paginated = filtered.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
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
            alert(`Erro ao adicionar ${game.name}: ${e}`);
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
            <Box sx={{ position: 'sticky', top: 0, zIndex: 10, mb: 2 }}>
                <TextField
                    label="Buscar por nome"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 1,
                        '& .MuiInputBase-input': { color: '#000' },
                        '& .MuiInputLabel-root': { color: '#000' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999' },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                    }}
                />
            </Box>
            <Grid container spacing={7} columns={5}>
                {paginated.map(game => (
                    <Grid item xs={1} key={game.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                image={game.imageUrl}
                                alt={game.name}
                                sx={{
                                    width: '100%',
                                    height: 180,
                                    objectFit: 'cover',
                                    objectPosition: 'center'
                                }}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                                    {game.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        maxWidth: '30ch',
                                        whiteSpace: 'normal',
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-word',
                                        textAlign: 'center',
                                        mx: 'auto'
                                    }}
                                >
                                    {game.description}
                                </Typography>
                                <Typography variant="subtitle1" color="text.primary" sx={{ textAlign: 'center' }}>
                                    R$ {game.price.toFixed(2)}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
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
            {pageCount > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': { color: '#fff' },
                            '& .Mui-selected': { backgroundColor: '#1976d2', color: '#fff' }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}
