import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TodoPage from './pages/TodoPage';
import { supabase } from './lib/supabaseClient';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Typography, IconButton, Box, CssBaseline, PaletteMode } from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon, Logout as LogoutIcon } from '@mui/icons-material';
import { Session } from '@supabase/supabase-js';

interface AppProps {
  toggleColorMode: () => void;
  theme: Theme;
}

function App({ toggleColorMode, theme }: AppProps) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {session && (
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={!session ? <AuthPage /> : <TodoPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

function AppWrapper() {
  const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App toggleColorMode={colorMode.toggleColorMode} theme={theme} />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default AppWrapper;