import { useSnackbar } from 'notistack';
// @mui
import { Grid, Card, Stack, Typography } from '@mui/material';
import QRCode from 'react-qr-code';
// hooks
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function AccountNotifications() {
  const { user } = useAuth();

  const qrData = 'http://onnpay.com:3000/dashboard/payment/new';

  const { enqueueSnackbar } = useSnackbar();

  return (
    <Grid item xs={12} md={6}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="flex-end">
          <Stack spacing={2} sx={{ width: 1 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              QR Code
            </Typography>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <QRCode value={qrData} />
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );
}
