import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TodoPage from './pages/TodoPage';
import { supabase } from './lib/supabaseClient';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';

const theme = createTheme();

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Todo App
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Routes>
          <Route path="/" element={!session ? <AuthPage /> : <TodoPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </Container>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default AppWrapper;
