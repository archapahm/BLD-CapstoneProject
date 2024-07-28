import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSignup } from '@/hooks/useSignup'
import BLDNavbar from '@/components/clientLanding/BLDNavbar';

export default function Signup() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const { signup, error } = useSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, displayName, confirmPassword)
  }

  return (
    <>
      <BLDNavbar pageState='signup' />
      <Container component="main" maxWidth="xs">
        <Typography
          variant="h3"
          align="center"
          marginTop={8}
        >
          SIGN UP
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="displayName"
                label="Display Name"
                name="displayName"
                autoComplete="display-name"
                onChange={(event) => setDisplayName(event.target.value)}
                value={displayName}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirm-password"
                label="Confirm-Password"
                type="password"
                id="confirm-password"
                autoComplete="confirm-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                value={confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {error && <p className="error">{error}</p>}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography variant="body2">
                {"Already have an account? "}
                <Link href="#" variant="body2" onClick={() => { router.push('login') }}>
                  {'Log In'}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}