
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';
import { useLogout } from '@/hooks/useLogout';
import { Router, useRouter } from 'next/router';

const Page = () => {
  const { logout } = useLogout();
  const router = useRouter();

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    console.log("Go to login page from access message");
    router.push("/login");
  }

  return (
  <>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              mb: 3,
              textAlign: 'center'
            }}
          >
            <img
              alt="Under development"
              src="../assets/errors/error-404.png"
              style={{
                display: 'inline-block',
                maxWidth: '100%',
                width: 400
              }}
            />
          </Box>
          <Typography
            align="center"
            sx={{ mb: 3 }}
            variant="h3"
          >
            Access Pending
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            variant="body1"
          >
            You currently do not have access to this
        feature. Please wait for the administrator to grant you access.
          </Typography>
          <Button
            startIcon={(
              <SvgIcon fontSize="small">
                <ArrowLeftIcon />
              </SvgIcon>
            )}
            sx={{ mt: 3 }}
            variant="contained"
            onClick={handleLogout}
          >
            Go back to login
          </Button>
        </Box>
      </Container>
    </Box>
  </>
  );
}

export default Page;
