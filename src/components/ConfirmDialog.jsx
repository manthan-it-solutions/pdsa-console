import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ open, setOpen, title, description, onConfirm, onCancel }) {
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm(); // Call the dynamic confirm action
    handleClose(); // Close the dialog
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(); // Call the dynamic cancel action (optional)
    }
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title || "Confirmation"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description || "Are you sure you want to proceed?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>No</Button>
        <Button onClick={handleConfirm} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
