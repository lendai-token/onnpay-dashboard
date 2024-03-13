import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { Box, Grid, Card, Button, Typography, Stack } from '@mui/material';
// utils
import axios from '../../../../utils/axios';
import { fInvoiceCurrency } from '../../../../utils/formatNumber';
// hooks
import useAuth from '../../../../hooks/useAuth';
//
import AccountBillingAddressBook from './AccountBillingAddressBook';
import AccountBillingInvoiceHistory from './AccountBillingInvoiceHistory';

// ----------------------------------------------------------------------
export default function AccountBilling() {
  const { user } = useAuth();

  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);

  const bankInfo = {
    id: user.id,
    bank: user.bank,
    accountNo: user.accountNo,
    iban: user.iban,
    swiftCode: user.swiftCode,
  };

  const handleUpdate = async () => {
    getInvoices();
    getTotalAmount();
  };

  const getInvoices = async () => {
    const response = await axios.get(`/payment/get_invoices_by_email?email=${user.email}`);

    setInvoices(response.data);
  };

  const getTotalAmount = async () => {
    const response = await axios.get(`/settlement/get_completed_amount?email=${user.email}`);

    setTotal(response.data);
  };

  useEffect(() => {
    getInvoices();
    getTotalAmount();
  }, [user]);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={5}>
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Typography variant="overline" sx={{ mb: 3, display: 'block', color: 'text.secondary' }}>
              Total Settled
            </Typography>
            <Typography variant="h4">{fInvoiceCurrency(total)} AED</Typography>
          </Card>

          <AccountBillingAddressBook bankInfo={bankInfo} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={7}>
        <AccountBillingInvoiceHistory invoices={invoices} onUpdate={handleUpdate} />
      </Grid>
    </Grid>
  );
}
