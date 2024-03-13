import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { Stack, Link, Button, Typography, TextField } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fInvoiceCurrency } from '../../../../utils/formatNumber';
import axios from '../../../../utils/axios';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

AccountBillingInvoiceHistory.propTypes = {
  invoices: PropTypes.array,
};

export default function AccountBillingInvoiceHistory({ invoices, onUpdate }) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [invoiceList, setInvoiceList] = useState(invoices);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleButtonClick = () => {
    navigate(PATH_DASHBOARD.payment, { replace: true });
  };

  const requestSettlement = async (dateString, price, curId) => {
    let response = '';

    if (curId > 0) {
      const data = {
        status: 'request',
      };

      response = await axios.patch(`/settlement/update_status/${curId}`, data);
    } else {
      const data = {
        date: dateString,
        amount: price,
        createdBy: user.email,
        status: 'request',
      };

      response = await axios.post('/settlement/request_settlement', data);
    }

    if (response.data.id > 0) {
      enqueueSnackbar('Successfully requested!');
      onUpdate();
    }
  };

  const getInvoicesByDate = async () => {
    const response = await axios.get(
      `/payment/get_invoices_by_date?email=${user.email}&start=${startDate}&end=${endDate}`
    );

    setInvoiceList(response.data);
  };

  const getStatusColor = (status) => {
    let color = '';
    if (status === 'request') {
      color = 'inherit';
    } else if (status === 'approve') {
      color = 'warning';
    } else {
      color = 'success';
    }
    return color;
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  useEffect(() => {
    setInvoiceList(invoices);
  }, [invoices]);

  return (
    <Stack spacing={3} alignItems="flex-start">
      <Typography variant="subtitle1" sx={{ width: 1 }}>
        Invoice History
      </Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Start date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" size="small" onClick={() => getInvoicesByDate()}>
          Apply
        </Button>
      </Stack>

      <Stack spacing={2} sx={{ width: 1 }}>
        {invoiceList ? (
          Object.entries(invoiceList).map(([date, data]) => {
            if (data.status !== 'complete') {
              return (
                <Stack key={date} direction="row" justifyContent="space-between" sx={{ width: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 160 }}>
                    {date}
                  </Typography>
                  <Typography variant="body2">{fInvoiceCurrency(data.amount)} AED</Typography>
                  {!data.status || data.status === '' || data.status === 'reject' ? (
                    <Button
                      color="info"
                      variant="contained"
                      size="small"
                      onClick={() => requestSettlement(date, data.amount, data.id)}
                    >
                      Request
                    </Button>
                  ) : (
                    <Button color={getStatusColor(data.status)} size="small">
                      {sentenceCase(data.status)}
                    </Button>
                  )}
                </Stack>
              );
            }

            return null;
          })
        ) : (
          <div>No invoice history!</div>
        )}
      </Stack>

      <Button size="small" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />} onClick={handleButtonClick}>
        All invoices
      </Button>
    </Stack>
  );
}
