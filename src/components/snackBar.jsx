import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ShowSnackBar = ({ open, severity = true, message, onClose }) => {
    let severityVal = severity ? 'success': 'error'
    
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={onClose}
                severity={severityVal}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ShowSnackBar;
