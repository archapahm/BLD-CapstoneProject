import { useLogin } from '@/hooks/useLogin';
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, TextField, Container, Button, Link, IconButton, Alert } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import LinearProgress from '@mui/material/LinearProgress';
import { getAuth } from 'firebase/auth';
import { userAgent } from 'next/server';
import { useLogout } from '@/hooks/useLogout';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { error, login } = useLogin();
    const { user, authIsReady } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const logout = useLogout();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    }

    const handleSignup = () => {
        router.push('/signup');
    };

    useEffect(() => {
        // Reset the user and authIsReady when redirected to login page
        logout;
    },[])

    if (user) {
        router.push("/");
    } else {
        return (
            <Container component='form' noValidate onSubmit={handleSubmit} maxWidth="xs">
                <Typography
                    variant='h3'
                    align="center"
                >
                    LOGIN
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    InputProps={{
                        endAdornment:
                            <IconButton onClick={handleClickShowPassword}>
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                    }}
                >

                </TextField >

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    SIGN IN
                </Button>
                <Typography variant="body2">
                    {"Don't have an account? "}
                    <Link href="#" variant="body2" onClick={handleSignup}>
                        {'Sign Up'}
                    </Link>
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
            </Container >
        );
    }
};