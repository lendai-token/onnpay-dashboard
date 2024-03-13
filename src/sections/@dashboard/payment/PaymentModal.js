import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';
import {
  Link,
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
} from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';
import { fInvoiceCurrency } from '../../../utils/formatNumber';

export default function PaymentModal({ open, onClose, invoice }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h5" gutterBottom>
          Invoice Details
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ paddingTop: '24px !important' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Invoice Number:
            </Typography>
            <Typography variant="body1">{invoice?.invoiceNo}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Merchant Reference:
            </Typography>
            <Typography variant="body1">{invoice?.merchantReference}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Customer Email:
            </Typography>
            <Typography variant="body1">{invoice?.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Amount:
            </Typography>
            <Typography variant="body1">{fInvoiceCurrency(invoice?.amount / 100)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Currency:
            </Typography>
            <Typography variant="body1">{invoice?.currency}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Status:
            </Typography>
            <Typography variant="body1">
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={(invoice?.status === 'Pending' && 'warning') || 'success'}
              >
                {invoice?.status}
              </Label>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Created At:
            </Typography>
            <Typography variant="body1">{invoice?.createdAt}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Expiry Date:
            </Typography>
            <Typography variant="body1">{invoice?.expiryDate}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Payment Link:
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link href={invoice?.paymentLink} target="_blank" rel="noopener">
                {invoice?.paymentLink}
              </Link>
              <CopyToClipboard
                text={invoice?.paymentLink}
                onCopy={() => enqueueSnackbar('Payment Link copied to clipboard!')}
              >
                <IconButton>
                  <Iconify icon={'material-symbols:content-copy'} width={20} height={20} />
                </IconButton>
              </CopyToClipboard>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
