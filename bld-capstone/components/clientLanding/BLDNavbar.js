import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import { useAuthContext } from '@/hooks/useAuthContext';
import { useLogout } from '@/hooks/useLogout';
import { AppBar, Box, ClickAwayListener, IconButton, Toolbar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Divider, Drawer } from '@mui/material';
import Grid from '@mui/material/Grid';
import AnalogClock from 'analog-clock-react';
import BLDOverview from './BLDOverview';
import BLDContact from './BLDContact';
import { useTheme } from '@mui/material/styles';
import Scrollbars from 'react-custom-scrollbars';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import { getProjectByProjectID } from '@/utils/queries';

const drawerWidth = 350;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


export default function MenuAppBar(props) {
    const pageState = props.pageState;

    const theme = useTheme();

    const [iconWidth, setIconWidth] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [project, setProject] = useState(null);

    const menuIconRef = useRef(null);
    const profileIconRef = useRef(null);

    const { logout } = useLogout()

    const { user, authIsReady } = useAuthContext()

    const router = useRouter();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        logout();
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleSignup = () => {
        router.push('/signup');
    };

    const handleChangePassword = () => {
        router.push('/login/passwordChange');
    };

    useEffect(() => {
        if (profileIconRef.current) {
            setIconWidth(profileIconRef.current.offsetWidth);
        }
    }, [user]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const fetchedProject = await getProjectByProjectID(props.topLevelProjectChoice);
                setProject(fetchedProject);
            } catch (error) {
                console.error("Failed to fetch project data:", error);
                // Handle the error appropriately
            }
        };

        if (props.topLevelProjectChoice) {
            fetchProject();
        }
    }, [props.topLevelProjectChoice]);

    // Options for the analog clock
    const options = {
        "useCustomTime": false,
        "width": "250px",
        "border": true,
        "borderColor": "#1e1e1e",
        "baseColor": "#1e1e1e",
        "centerColor": "#121212",
        "centerBorderColor": "#ffffff",
        "handColors": {
            "second": "#ffffff",
            "minute": "#ffffff",
            "hour": "#ffffff"
        }
    };

    return (
        <Box sx={{
            flexGrow: 1
        }}>
            <ClickAwayListener
                mouseEvent="onMouseUp"
                onClickAway={handleDrawerClose}
            >
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            overflowY: 'auto',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <Button
                        onClick={handleDrawerClose}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <DrawerHeader>
                            <ChevronLeftIcon />
                        </DrawerHeader>
                    </Button>
                    <Divider />

                    {/* Analog clock */}
                    <Box sx={{ display: "flex", justifyContent: "center", m: 2 }}>
                        <AnalogClock {...options} />
                    </Box>

                    <Divider />

                    <Scrollbars
                        style={{ width: drawerWidth - 2, height: '100vh' }}
                    >
                        <Box sx={{ m: 2 }}>
                            {user ?
                                <>
                                    <Button
                                        variant="contained"
                                        sx={{ width: "100%", mb: 1 }}
                                        onClick={handleChangePassword}
                                    >Change Password</Button>
                                    <Button
                                        variant="contained"
                                        sx={{ width: "100%", mb: 1 }}
                                        onClick={handleLogout}
                                    >Logout</Button>
                                    <BLDOverview overviewText={project ? project.projectDescription : ""} />
                                    {/* < BLDContact /> */}
                                </>
                                :
                                <>
                                    <Button
                                        variant="contained"
                                        sx={{ width: "100%", mb: 1 }}
                                        onClick={handleLogin}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ width: "100%", mb: 1 }}
                                        onClick={handleSignup}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            }
                        </Box>
                    </Scrollbars>
                </Drawer>
            </ClickAwayListener>
            <AppBar position="static">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box ref={menuIconRef} sx={{ display: "flex", alignItems: "center", width: iconWidth }}>
                        <Box sx={{ mx: 1 }} >
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleDrawerOpen}
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

                    {user ?
                        <Box ref={profileIconRef} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Button
                                size='large'
                                startIcon={<AccountCircle />}
                                color='inherit'
                                onClick={() => router.push('/login/passwordChange')}
                            >
                                {user ? user.displayName : null}
                            </Button>

                            <Button
                                size='large'
                                startIcon={<LogoutIcon />}
                                color='inherit'
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Box>
                        : <Box ref={profileIconRef} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {pageState === 'login' ?
                                <Button
                                    size='large'
                                    startIcon={<HowToRegIcon />}
                                    color='inherit'
                                    onClick={handleSignup}
                                >
                                    Register
                                </Button> :
                                <Button
                                    size='large'
                                    startIcon={<LoginIcon />}
                                    color='inherit'
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            }
                        </Box>}
                </Toolbar>
            </AppBar>
        </Box >
    );
}