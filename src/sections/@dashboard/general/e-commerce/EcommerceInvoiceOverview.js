import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, Stack, Box, Typography } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
import axios from '../../../../utils/axios';
//
import { BaseOptionChart } from '../../../../components/chart';
// hooks
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function EcommerceInvoiceOverview() {
  const theme = useTheme();
  const { user } = useAuth();

  const [countAll, setCountAll] = useState(0);
  const [countPending, setCountPending] = useState(0);

  const chartOptions = merge(BaseOptionChart(), {
    legend: { show: false },
    grid: {
      padding: { top: -32, bottom: -32 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          [
            { offset: 0, color: theme.palette.primary.light },
            { offset: 100, color: theme.palette.primary.main },
          ],
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '64%' },
        dataLabels: {
          name: { offsetY: -16 },
          value: { offsetY: 8 },
          total: {
            label: 'Created',
            formatter: () => fNumber(countAll),
          },
        },
      },
    },
  });

  useEffect(() => {
    const getInvoiceCount = async () => {
      const all = user.role === "admin" ? await axios.get("/payment/count_all") : await axios.get(`/payment/count_all_by_email?email=${user.email}`);
      setCountAll(all.data);

      const pending = user.role === "admin" ? await axios.get("/payment/count_pending") : await axios.get(`/payment/count_pending_by_email?email=${user.email}`);
      setCountPending(pending.data);
    };

    getInvoiceCount();
  }, [user]);

  return (
    <Card>
      <CardHeader title="Invoices" sx={{ mb: 8 }} />
      <ReactApexChart
        type="radialBar"
        series={[((countAll - countPending) / countAll) * 100]}
        options={chartOptions}
        height={310}
      />

      <Stack spacing={2} sx={{ p: 5 }}>
        <Legend label="Sold out" number={countAll - countPending} />
        <Legend label="PENDING" number={countPending} />
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

Legend.propTypes = {
  label: PropTypes.string,
  number: PropTypes.number,
};

function Legend({ label, number }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            width: 16,
            height: 16,
            bgcolor: 'grey.50016',
            borderRadius: 0.75,
            ...(label === 'Sold out' && {
              bgcolor: 'primary.main',
            }),
          }}
        />
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="subtitle1">{number} Invoices</Typography>
    </Stack>
  );
}
