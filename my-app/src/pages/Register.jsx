import { Button, Grid, TextField } from "@mui/material"
import { use, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Register() {
    const [user,setUser] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate()
   
    function registerUser() {
        const register = {
            "user": user,
            "password": password
        }
        //fetch
    }

    return (
        <>
            <Grid container spacing={4} sx={{backgroundColor:"white", width:"300px", padding:"50px", margin:"0 auto", borderRadius:"5px"}}>
                <Grid size={12}>
                    <TextField variant="outlined" label="User" onChange={(e)=>{setUser(e.target.value)}}/>
                </Grid>
                <Grid size={12}>
                    <TextField variant="filled" label="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
                </Grid>
                <Grid size={12}>
                    <Button variant="outlined" onClick={registerUser}>Register</Button>
                </Grid>
            </Grid>
        </>
    )
}