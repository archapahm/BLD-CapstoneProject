import React from 'react';
import Layout from './layout';

import { Box, Container, Stack, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { useAuthContext } from '@/hooks/useAuthContext';

const Page = () => {

  const { user, authIsReady } = useAuthContext();

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
      </Breadcrumbs>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Welcome {user ? user.displayName : null}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

// Wrap the page with the layout
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Page;
