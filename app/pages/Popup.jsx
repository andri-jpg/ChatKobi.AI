import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogContentText, Button } from '@mui/material';
import { red, amber } from '@mui/material/colors';

function Popup({ open, onClose, message, severity }) {
  const [showCloseButton] = useState(severity === 'error');

  const messageBackgroundColor = severity === 'error' ? red[50] : amber[50];
  const severityColor = severity === 'error' ? red[500] : amber[500];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: severityColor, color: 'black' }}>
        {severity === 'error' ? 'Error' : 'Peringatan'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ backgroundColor: messageBackgroundColor }}>
          {message}
        </DialogContentText>
        {!showCloseButton && (
          <Button onClick={onClose} color="primary" sx={{ mt: 2 }}>
            Tutup
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default Popup;
