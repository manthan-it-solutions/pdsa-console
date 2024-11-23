import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f9',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 'bold', color: '#1976d2' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: '16px', color: '#555' }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={goHome}
        sx={{
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          textTransform: 'none',
        }}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFound;
