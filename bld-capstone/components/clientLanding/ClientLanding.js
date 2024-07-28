// Importing necessary modules
import React, { useState } from 'react';
import { Typography, Container, Grid } from '@mui/material';

// Importing custom components
import BLDWelcomeMessage from './BLDWelcomeMessage';
import BLDNavbar from './BLDNavbar';
import BLDProjectStatus from './BLDProjectStatus';
import BLDProjectDisplayNew from './BLDProjectDisplay/BLDProjectDisplay';

// Defining the main component
export default function ClientLanding() {
    const [topLevelProjectChoice, setTopLevelProjectChoice] = useState(null);
    // Rendering the component

    return (
        <>
            <BLDNavbar pageState='clientLanding' topLevelProjectChoice={topLevelProjectChoice} />
            <Container
                maxWidth="xxl"
                sx={{ paddingTop: 3 }}
            >
                {/* Heading */}
                <Typography variant="h4" sx={{ mb: 6 }}>Project Dashboard</Typography>
                <Grid container spacing={3}>
                    {/* Right Panel */}
                    <Grid item xs={8}>
                        {/* Welcome Message */}
                        <BLDWelcomeMessage />
                    </Grid>
                    <Grid item xs={4}>
                        {/* Project Status */}
                        <BLDProjectStatus topLevelProjectChoice={topLevelProjectChoice} />
                    </Grid>
                    <Grid item xs={12}>
                        {/* Project Display */}
                        <BLDProjectDisplayNew setTopLevelProjectChoice={setTopLevelProjectChoice} />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}