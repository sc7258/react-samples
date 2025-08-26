import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItemButton, ListItemText, ListItemIcon, Avatar, Divider, IconButton } from '@mui/material';
import { supabase } from '../supabaseClient';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | undefined>('');

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email);
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1e1e2d',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <div>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Todo Admin
            </Typography>
          </Toolbar>
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItemButton onClick={() => navigate('/')} sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}>
                <ListItemIcon>
                  <PeopleIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
              {/* Add other navigation items here */}
            </List>
          </Box>
        </div>
        <Box sx={{ marginTop: 'auto' }}>
          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2 }}>{userEmail?.charAt(0).toUpperCase()}</Avatar>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>{userEmail}</Typography>
            <IconButton onClick={handleLogout}>
              <LogoutIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;