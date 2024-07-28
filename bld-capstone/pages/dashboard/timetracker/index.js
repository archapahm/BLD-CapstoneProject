import { useEffect } from 'react';
import Layout from '../layout';
import Link from 'next/link';
import { useState } from 'react';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { List } from '@mui/material';
import TimeTracker from '@/components/timeTracker';
import { Box, Container, Stack, Typography } from '@mui/material';

const Page = () => {

    const [entries, setEntries] = useState([]);

    const entryCards = entries.map((entry, i) => <ListItem key={i} className="time-entry">{entry.formatedTimeCounted}</ListItem>)

    const eventHandler = (data) => {
        setEntries(data)
    }

    return (
        <>
            <Breadcrumbs 
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" />}
            >
                <Link 
                    underline="hover" 
                    color="inherit" 
                    href="/dashboard"
                    style={{textDecoration: 'none', color: 'inherit'}}
                >
                    Dashboard
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/dashboard/timetracker"
                    style={{textDecoration: 'none', color: 'inherit'}}
                >
                    Time Tracker
                </Link>
            </Breadcrumbs>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3
                }}
            >
                <Container maxWidth="xl">
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <Stack spacing={1}>
                            <Typography variant="h4">
                                Time Tracker
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack>
                        <TimeTracker onEntriesChange = {eventHandler}></TimeTracker>
                        <List>
                            {entryCards}
                        </List>
                    </Stack>  
                </Container>
            </Box>
        </>
    )
}

// Wrap the page with the layout
Page.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
  };
  
  export default Page;