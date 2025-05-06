import { Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material"
import Text from "../components/Text"

export default function Profile() {
    
    return (
        <>
            <Text text={'Meus jogos'}/>
            <Grid container spacing={4}>
                
                <Grid size={20}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width:"300px"}}>
                    {/* <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.name}
                        sx={{ height: 240 }}
                    /> */}
                    <CardContent>
                        <Typography variant="h6" component="h3">
                        nome
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                
            </Grid>
            
            <b><p>fazer um fetch e mostrar os jogos</p></b>
        </>
    )
}