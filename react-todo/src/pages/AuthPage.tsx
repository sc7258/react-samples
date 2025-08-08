import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        alert('Logged in successfully!');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Signed up successfully! Please check your email for verification.');
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>{isLogin ? 'Login' : 'Sign Up'}</button>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to create an account?' : 'Already have an account?'}
      </button>
    </div>
  );
};

export default AuthPage;
