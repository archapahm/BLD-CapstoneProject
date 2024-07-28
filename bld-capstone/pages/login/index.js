import * as React from 'react';
import LoginForm from '@/components/loginform';
import Box from '@mui/material/Box';
import BLDNavbar from '@/components/clientLanding/BLDNavbar';

export default function Login() {

    return (
        <Box sx={{}}>
            <BLDNavbar pageState='login' />
            <Box sx={{ mt: 6 }}>
                <LoginForm />
            </Box>
        </Box>
    )
}