import React from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../components/Layout';

const Unauthorized: React.FC = () => {
  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 64px)', // Adjust height for AppBar
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" gutterBottom>
          You do not have permission to view this page.
        </Typography>
      </Box>
    </Layout>
  );
};

export default Unauthorized;