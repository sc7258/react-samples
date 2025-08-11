import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Avatar } from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // No need to alert, the onAuthStateChange will handle navigation
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Signed up successfully! Please check your email for verification.');
      }
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ minWidth: 275, mt: 4 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h4">
              {isLogin ? 'Login' : 'Sign Up'}
            </Typography>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAuth(); }} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
              <Button
                fullWidth
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Need to create an account?' : 'Already have an account?'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AuthPage;