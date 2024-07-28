import React from 'react';

import { styled } from '@mui/material/styles';
import { AccountCircle } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer'; 
import Menu from '@mui/icons-material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PasswordIcon from '@mui/icons-material/Password';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import NavLinks from '@/components/dashboard/nav-links';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useAuthContext } from '@/hooks/useAuthContext';
import { useLogout } from '@/hooks/useLogout';
import AccountPopover from '@/components/dashboard/account-popover';
import { Breadcrumbs, Button, Popover } from '@mui/material';

import NavBar from "@/components/navbar"

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

const Layout = ({ children }) => {
    // For side navigation
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleMenu = (e) => {
      setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const id = openMenu ? 'simple-popover' : undefined;

    const { logout } = useLogout()
    const { user, authIsReady } = useAuthContext()
    const profileIconRef = useRef(null);
    const [iconWidth, setIconWidth] = useState(null);
    const router = useRouter();
  
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
  
    const handleLogout = (event) => {
      event.preventDefault();
      logout();
      router.push("/login");
    }
  
    useEffect(() => {
      if (profileIconRef.current) {
          setIconWidth(profileIconRef.current.offsetWidth);
      }
    }, [user]);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{flexGrow: 1}}
            >
              <IconButton 
                color="inherit"
                aria-label="logo"
                onClick={() => router.push('/')}
              >
                <Box
                  component="img"
                  src="/bld-logo.png"
                  sx={{ height: 50 }}
                />
              </IconButton>
            </Box>
          
            <Button 
              size='large'
              startIcon={<PasswordIcon />}
              color='inherit'
              onClick={handleChangePassword}
            >
              Change Password
            </Button>

            <Button 
              size='large'
              startIcon={<LogoutIcon />}
              color='inherit'
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <NavLinks />
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
            {/* <Copyright sx={{ pt: 4 }} /> */}
          </Container>

      
        </Box>

      </Box>
    </>
  );
};

export default Layout;
