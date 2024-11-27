import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from '../services/authServieces';
import axios from 'axios'; // For making external API requests

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To capture the current URL path
  const [shouldRenderContent, setShouldRenderContent] = useState(false); // State to control content rendering

  // Function to navigate to the homepage
  const goHome = () => {
    navigate('/'); // Redirect to home page
  };

  // Function to log the 404 event to the API
  const log404Error = async () => {
    try {
      const fromPath = location.state?.from || 'unknown path';
      console.log('fromPath: ', fromPath);

      const unique_id = `http://192.168.0.122:3000${fromPath}`
      console.log('unique_id: ', unique_id);
    

      // Get client's geolocation data using an external API (ip-api)
      const geoResponse = await axios.get('http://ip-api.com/json/');
      const geoData = geoResponse.data;

      if (geoData.status === 'success') {
        // Extract required details from the geolocation response
        const { lat, lon, city, regionName, country } = geoData;

        // Log the 404 error to your API with geolocation details
        const res = await apiCall({
          endpoint: 'api/log-404',
          method: 'POST',
          payload: {
            url: fromPath, // Sending the current URL path
            latitude: lat,
            longitude: lon,
            city: city,
            state: regionName,
            country: country,
          },
        });

        if (res?.success) {
          const redirectUrl = res.orgUrl; // Assuming the server returns the original URL
         
          if (redirectUrl) {
            console.log('redirectUrl: ', redirectUrl);
const type_url =res.url_type

if(type_url==="feedback"){

        // Append the id (unique_id) to the redirect URL as a query parameter
            const url = new URL(redirectUrl); // Use the URL constructor for safety
            console.log('url: ', url);
            url.searchParams.append('id', res.unique_id);
           
            // Redirect the user to the updated URL
            window.location.href = url.toString();
            return; // Ensure no further execution after redirection


          }

          else{
            window.location.href = redirectUrl
            return; // Ensure no further execution after redirection
          }
    
          }
          console.log('404 log successfully sent to the server.');
        } else {
          console.error('Failed to log the 404 error:', res?.message);
        }
      } else {
        console.error('Failed to retrieve geolocation data:', geoData.message);
      }
    } catch (error) {
      console.error('Error logging 404 or retrieving geolocation:', error.message);
    }

    // Allow content rendering if redirection is not triggered
    // setShouldRenderContent(true);
  };

  // Call the log404Error function when the component mounts
  useEffect(() => {
    log404Error();
  }, []);

  // If redirection hasn't been triggered, render the 404 content
  if (!shouldRenderContent) {
    return null; // Render nothing while waiting for redirection or API call
  }

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
      <Typography
        variant="h1"
        sx={{ fontSize: '8rem', fontWeight: 'bold', color: '#1976d2' }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{ marginBottom: '16px', color: '#555' }}
      >
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
