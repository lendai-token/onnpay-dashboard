import PropTypes from 'prop-types';
// @mui
import { Box, Card, Button, Typography, Stack, Paper } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

AccountBillingAddressBook.propTypes = {
  bankInfo: PropTypes.array,
};

export default function AccountBillingAddressBook({ bankInfo }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Bank Info
        </Typography>

        <Paper
          key={bankInfo.id}
          sx={{
            p: 3,
            width: 1,
            bgcolor: 'background.neutral',
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            {bankInfo.accountNo}
          </Typography>

          <Typography variant="body2" gutterBottom>
            <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
              Bank: &nbsp;
            </Typography>
            {bankInfo.bank}
          </Typography>

          <Typography variant="body2" gutterBottom>
            <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
              IBAN: &nbsp;
            </Typography>
            {bankInfo.iban}
          </Typography>

          <Typography variant="body2" gutterBottom>
            <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
              Swift Code: &nbsp;
            </Typography>
            {bankInfo.swiftCode}
          </Typography>
        </Paper>
      </Stack>
    </Card>
  );
}
