import React from 'react';
import { Typography, Paper } from '@mui/material';
import { useAuthContext } from '@/hooks/useAuthContext';


export default function BLDWelcomeMessage() {
    // Getting user and authIsReady from the authentication context
    const { user, authIsReady } = useAuthContext();

    return (
        <>
            {/* Welcome message */}
            <Paper sx={{ px: 3, py: 4 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>Hey {user ? user.displayName : null},</Typography>
                <Typography>
                    Welcome to your Project Dashboard, where you can seamlessly manage your mood boards and stay updated on project statuses. Explore and organize your creative journey effortlessly.
                    {/* Any personalized messages here */}
                </Typography>
            </Paper>
        </>
    )
}