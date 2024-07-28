import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import { useAuthContext } from '@/hooks/useAuthContext';
import { useLogout } from '@/hooks/useLogout';
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';


export default function MenuAppBar() {
    const [iconWidth, setIconWidth] = useState(null);
    const menuIconRef = useRef(null);
    const profileIconRef = useRef(null);

    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const { logout } = useLogout()
    const { user, authIsReady } = useAuthContext()
    const router = useRouter();

    const handleChange = (e) => {
        setAuth(e.target.checked);
    };

    const handleMenu = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        handleClose();
        router.push('/login');
    };

    const handleSignup = () => {
        handleClose();
        router.push('/signup');
    };

    const handleChangePassword = () => {
        handleClose();
        router.push('/login/passwordChange');
    };

    useEffect(() => {
        if (profileIconRef.current) {
            setIconWidth(profileIconRef.current.offsetWidth);
        }
    }, [user]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

                    <Box ref={menuIconRef} sx={{ display: "flex", alignItems: "center", width: iconWidth }}>
                        <Box sx={{ mx: 1 }} >
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <IconButton color="inherit" aria-label="logo" onClick={() => router.push('/')}>
                        <Box
                            component="img"
                            src="/bld-logo.png"
                            sx={{ height: 54 }}
                        />
                    </IconButton>

                    <Box ref={profileIconRef} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ ml: 2 }}>{user ? user.displayName : null}</Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {!user && <MenuItem onClick={handleLogin}>Login</MenuItem>}
                            {!user && <MenuItem onClick={handleSignup}>Signup</MenuItem>}
                            {user && <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>}
                            {user && <MenuItem onClick={logout}>Logout</MenuItem>}
                        </Menu>
                    </Box>

                </Toolbar>
            </AppBar>
        </Box >
    );
}