import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from "react-router-dom"
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const carouselItems = [
  { img: 'https://source.unsplash.com/random/800x400?ecommerce,1', label: 'New Arrivals' },
  { img: 'https://source.unsplash.com/random/800x400?ecommerce,2', label: 'Summer Sale' },
  { img: 'https://source.unsplash.com/random/800x400?ecommerce,3', label: 'Trending Now' }
];

const products = [
  { id: 1, name: 'Product 1', image: 'https://source.unsplash.com/random/240x240?product,1', price: '$29.99' },
  { id: 2, name: 'Product 2', image: 'https://source.unsplash.com/random/240x240?product,2', price: '$49.99' },
  { id: 3, name: 'Product 3', image: 'https://source.unsplash.com/random/240x240?product,3', price: '$39.99' },
  { id: 4, name: 'Product 4', image: 'https://source.unsplash.com/random/240x240?product,4', price: '$59.99' }
];

export default function Home() {

  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Carousel */}
      <Box sx={{ mb: 6 }}>
        <Carousel
          showArrows
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
        >
          {carouselItems.map((item) => (
            <div key={item.label}>
              <img src={item.img} alt={item.label} style={{ borderRadius: '8px' }} />
              <p className="legend">{item.label}</p>
            </div>
          ))}
        </Carousel>
      </Box>

      {/* Products */}
      <Typography variant="h4" component="h2" gutterBottom>
        Featured Products
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{ height: 240 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" onClick={() => {navigate("/asd")}}>
                  Buy Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
