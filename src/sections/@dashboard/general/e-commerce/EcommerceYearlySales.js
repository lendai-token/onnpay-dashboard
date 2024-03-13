import merge from 'lodash/merge';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// date
import { getYear } from 'date-fns';
// utils
import axios from '../../../../utils/axios';
// hooks
import useAuth from '../../../../hooks/useAuth';
//
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

export default function EcommerceYearlySales() {
  const { user } = useAuth();

  const now = new Date();
  const currentYear = getYear(now);

  const [seriesData, setSeriesData] = useState(currentYear);
  const [thisSalesAmount, setThisSalesAmount] = useState([]);
  const [prevSalesAmount, setPrevSalesAmount] = useState([]);
  const [amountPercentage, setAmountPercentage] = useState(0);

  const chartData = [
    {
      year: currentYear - 1,
      data: [{ name: 'Total Sales', data: prevSalesAmount }],
    },
    {
      year: currentYear,
      data: [{ name: 'Total Sales', data: thisSalesAmount }],
    },
  ];

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  useEffect(() => {
    const getTotalAmounts = async () => {
      const response =
        user.role === 'admin'
          ? await axios.get(`/payment/amount_sales_by_year?thisYear=${currentYear}&prevYear=${currentYear - 1}`)
          : await axios.get(
              `/payment/amount_sales_by_email?email=${user.email}&thisYear=${currentYear}&prevYear=${currentYear - 1}`
            );

      setThisSalesAmount(response.data.thisYear);
      setPrevSalesAmount(response.data.prevYear);
      setAmountPercentage(response.data.increasePercent === null ? 'infinity' : response.data.increasePercent);
    };

    getTotalAmounts();
  }, [user]);

  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  });

  return (
    <Card>
      <CardHeader
        title="Total Sales"
        subheader={`(+${amountPercentage}%) than last year`}
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 },
            }}
          >
            {chartData.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {chartData.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="area" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
