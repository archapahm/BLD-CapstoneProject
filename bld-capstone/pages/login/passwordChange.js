import * as React from 'react';
import { useState } from 'react'

import { Box, TextField } from "@mui/material";
import MyApp from "../_app";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import BLDNavbar from '@/components/clientLanding/BLDNavbar';

import { useSignup } from '@/hooks/useSignup'
import { useAuthContext } from '@/hooks/useAuthContext';
import { getAuth } from 'firebase/auth';
import { useRouter } from "next/router";
import { useEffect } from 'react';

export default function PasswordChange(props) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { changePassword, error } = useSignup()
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);

    const auth = getAuth();
    const user = auth.currentUser;

    const handleSubmit = (evt) => {
        evt.preventDefault();

        if (user) {
            changePassword(user, password, confirmPassword)
        }
    }

    const [showNewPassword, setShowNewPassword] = React.useState(false)
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show)

    const [showChangePassword, setShowChangePassword] = React.useState(false)
    const handleClickShowChangePassword = () => setShowChangePassword((show) => !show)

    const handleMouseDownPassword = (event => {
        event.preventDefault();
    })

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user]);

    return (
        <>
            <BLDNavbar />
            <Box
                sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Typography
                        variant="h3"
                        align="center"
                        marginTop={8}
                    >
                        CHANGE PASSWORD
                    </Typography>
                    <Grid>

                        <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showNewPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                endAdornment={
                                    <InputAdornment position="end" >
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowNewPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-confirm-password"
                                type={showChangePassword ? 'text' : 'password'}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowChangePassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showChangePassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <Button
                            type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Confirm Change </Button>
                        {error && <p className="error">{error}</p>}
                    </Grid>
                </Box>

            </Box>
        </>
    )
}