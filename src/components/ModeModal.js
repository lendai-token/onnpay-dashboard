import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';

export default function PaymentModeModal({ open, onClose, mode }) {
    const content = mode === "production" 
        ? "You are switching to live production mode. Do not use test payment card for any transactions to avoid suspension of your account."
        : "Switch to Sandbox Mode?";
    
    const handleClose = () => {
        onClose();
    };

    const saveMode = () => {
        localStorage.setItem('mode', mode);
        window.dispatchEvent(new Event('storage'));
        onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm">
            <DialogContent sx={{ paddingTop: '24px !important' }}>
                {content}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={saveMode}>
                    Confirm
                </Button>
                <Button variant="contained" color='info' onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}