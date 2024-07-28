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
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer'; 
import Menu from '@mui/icons-material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import NavLinks from '@/components/dashboard/nav-links';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useAuthContext } from '@/hooks/useAuthContext';
import { useLogout } from '@/hooks/useLogout';
import AccountPopover from '@/components/dashboard/account-popover';
import { Button, Popover } from '@mui/material';

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

const Layout = ({children}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <NavBar />
    </>
  );
}

// const Layout = ({ children }) => {
//     // For side navigation
//     const [open, setOpen] = React.useState(true);
//     const toggleDrawer = () => {
//         setOpen(!open);
//     };
    
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const openMenu = Boolean(anchorEl);
//     const handleMenu = (e) => {
//       setAnchorEl(e.currentTarget);
//     };
//     const handleClose = () => {
//       setAnchorEl(null);
//     };
//     const id = openMenu ? 'simple-popover' : undefined;

//     const { logout } = useLogout()
//     const { user, authIsReady } = useAuthContext()
//     const profileIconRef = useRef(null);
//     const [iconWidth, setIconWidth] = useState(null);
//     const router = useRouter();
  
//     const handleLogin = () => {
//       handleClose();
//       router.push('/login');
//     };
  
//     const handleSignup = () => {
//       handleClose();
//       router.push('/signup');
//     };
  
//     const handleChangePassword = () => {
//       handleClose();
//       router.push('/login/passwordChange');
//     };
  
    
  
//     useEffect(() => {
//       if (profileIconRef.current) {
//           setIconWidth(profileIconRef.current.offsetWidth);
//       }
//     }, [user]);

//     return (
//         <Box sx={{ display: 'flex' }}>
//         <AppBar position="absolute" open={open}>
//           <Toolbar
//             sx={{
//               pr: '24px', // keep right padding when drawer closed
//             }}
//           >
//             <IconButton
//               edge="start"
//               color="inherit"
//               aria-label="open drawer"
//               onClick={toggleDrawer}
//               sx={{
//                 marginRight: '36px',
//                 ...(open && { display: 'none' }),
//               }}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Typography
//               component="h1"
//               variant="h6"
//               color="inherit"
//               noWrap
//               sx={{ flexGrow: 1 }}
//             >
//               Dashboard
//             </Typography>
//             {/* <IconButton color="inherit">
//               <Badge badgeContent={4} color="secondary">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton> */}

//             {/* <Button aria-describedby={id} variant="contained" onClick={handleMenu}>
//               Open Popover
//             </Button>
//             <Popover 
//               id={id}
//               open={openMenu}
//               anchorEl={anchorEl}
//               onClose={handleClose}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'left',
//               }}
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'left',
//               }}
//             >
//               The content of the Popover.
//             </Popover> */}
            
            


//             {/* {/* <Typography sx={{ ml: 2 }}>{user ? user.displayName : null}</Typography> */}
//             {/* <IconButton
//                 size="large"
//                 // aria-label="account of current user"
//                 // aria-controls="menu-appbar"
//                 aria-describedby={id}
//                 variant="contained"
//                 // aria-haspopup="true"
//                 onClick={handleMenu}
//                 // color="inherit"
//             >
//                 <AccountCircle />
//             </IconButton>
//             <Menu
//                 id={id}
//                 open={openPopover}
//                 anchorEl={anchorEl}
//                 onClose={handleClose}
//                 anchorOrigin={{
//                   vertical: 'bottom',
//                   horizontal: 'left',
//                 }}
//                 transformOrigin={{
//                   vertical: 'top',
//                   horizontal: 'left',
//                 }}
//             >
//                 {!user && <MenuItem onClick={handleLogin}>Login</MenuItem>}
//                 {!user && <MenuItem onClick={handleSignup}>Signup</MenuItem>}
//                 {user && <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>}
//                 {user && <MenuItem onClick={logout}>Logout</MenuItem>}
//             </Menu> */}
//           </Toolbar>
//         </AppBar>

//         {/* <div>
//       <Button
//         id="basic-button"
//         aria-controls={openMenu ? 'basic-menu' : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? 'true' : undefined}
//         onClick={handleMenu}
//       >
//         Dashboard
//       </Button>
//       <Menu
//         id="basic-menu"
//         anchorEl={anchorEl}
//         open={openMenu}
//         onClose={handleClose}
//         MenuListProps={{
//           'aria-labelledby': 'basic-button',
//         }}
//       >
//         <MenuItem onClick={handleClose}>Profile</MenuItem>
//         <MenuItem onClick={handleClose}>My account</MenuItem>
//         <MenuItem onClick={handleClose}>Logout</MenuItem>
//       </Menu>
//     </div> */}

//         <Drawer variant="permanent" open={open}>
//           <Toolbar
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'flex-end',
//               px: [1],
//             }}
//           >
//             <IconButton onClick={toggleDrawer}>
//               <ChevronLeftIcon />
//             </IconButton>
//           </Toolbar>
//           <Divider />
//           <List component="nav">
//             <NavLinks />
//           </List>
//         </Drawer>
//         <Box
//           component="main"
//           sx={{
//             backgroundColor: (theme) =>
//               theme.palette.mode === 'light'
//                 ? theme.palette.grey[100]
//                 : theme.palette.grey[900],
//             flexGrow: 1,
//             height: '100vh',
//             overflow: 'auto',
//           }}
//         >
//           <Toolbar />
//           <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//             <Grid container spacing={3}>

//                   {children}

//             </Grid>
//             <Copyright sx={{ pt: 4 }} />
//           </Container>
//         </Box>
//       </Box>
        
//     );
// };

export default Layout;
