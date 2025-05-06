import { Button, Grid, TextField } from "@mui/material"
import { use, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const [user,setUser] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate()
   
    function login() {
        const login = {
            "user": user,
            "password": password
        }
        //fetch
    }

    return (
        <>
            <Grid container spacing={4} sx={{backgroundColor:"white", width:"300px", padding:"50px", margin:"0 auto", borderRadius:"5px"}}>
                <Grid size={12}>
                    <TextField variant="outlined" label="Usuário" onChange={(e)=>{setUser(e.target.value)}}/>
                </Grid>
                <Grid size={12}>
                    <TextField variant="filled" label="Senha" onChange={(e)=>{setPassword(e.target.value)}}/>
                </Grid>
                <Grid size={12}>
                    <Button variant="outlined" onClick={login}>Login</Button>
                </Grid>
            </Grid>
        </>
    )
}