import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TodoPage from './pages/TodoPage';
import { supabase } from './lib/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      navigate('/');
    } else {
      navigate('/auth');
    }
  }, [session, navigate]);

  return (
    <Routes>
      <Route path="/" element={<TodoPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
