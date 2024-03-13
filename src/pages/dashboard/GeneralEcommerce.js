import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
// date
import { getYear } from 'date-fns';
// utils
import axios from '../../utils/axios';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
// sections
import {
  EcommerceYearlySales,
  EcommerceWidgetSummary,
  EcommerceInvoiceOverview,
} from '../../sections/@dashboard/general/e-commerce';
import { BankingRecentTransitions } from '../../sections/@dashboard/general/banking';

// ----------------------------------------------------------------------

export default function GeneralEcommerce() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  const [salesCount, setSalesCount] = useState([]);
  const [salesTotal, setSalesTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [paymentsCount, setPaymentCount] = useState([]);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [activeUser, setActiveUser] = useState(0);

  const now = new Date();
  const currentYear = getYear(now);

  useEffect(() => {
    const getTotalSales = async () => {
      const response =
        user.role === 'admin'
          ? await axios.get(`/payment/count_sales_by_year?year=${currentYear}`)
          : await axios.get(`/payment/count_sales_by_email?email=${user.email}&year=${currentYear}`);

      setSalesCount(response.data);

      let sum = 0;
      response.data.forEach((element) => {
        sum += element;
      });

      setSalesTotal(sum);
    };

    const getTotalPending = async () => {
      const response = await axios.get(`/payment/count_pending_by_year?year=${currentYear}`);

      setPendingCount(response.data);

      let sum = 0;
      response.data.forEach((element) => {
        sum += element;
      });

      setPendingTotal(sum);
    };

    const getTotalPayments = async () => {
      const response =
        user.role === 'admin'
          ? await axios.get(`/payment/count_payments_by_year?year=${currentYear}`)
          : await axios.get(`/payment/count_payments_by_email?email=${user.email}&year=${currentYear}`);

      setPaymentCount(response.data);

      let sum = 0;
      response.data.forEach((element) => {
        sum += element;
      });

      setPaymentsTotal(sum);
    };

    const getActiveUserCount = async () => {
      const response = await axios.get('/get_active_user_count');

      setActiveUser(response.data);
    };

    getTotalSales();
    getTotalPayments();
    if (user.role === 'admin') {
      getActiveUserCount();
      getTotalPending();
    }
  }, [user]);

  return (
    <Page title="General: E-commerce">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <EcommerceWidgetSummary
              title="Total Sales"
              total={salesTotal}
              chartColor={theme.palette.primary.main}
              chartData={salesCount}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <EcommerceWidgetSummary
              title="Total Payments"
              total={paymentsTotal}
              chartColor={theme.palette.chart.green[0]}
              chartData={paymentsCount}
            />
          </Grid>

          {user.role === 'admin' && (
            <>
              <Grid item xs={12} md={6}>
                <EcommerceWidgetSummary
                  title="Total Number of merchants/user active"
                  total={activeUser}
                  chartColor={theme.palette.primary.main}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <EcommerceWidgetSummary
                  title="Number of pending request"
                  total={pendingTotal}
                  chartColor={theme.palette.chart.green[0]}
                  chartData={pendingCount}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={4}>
            <EcommerceInvoiceOverview />
          </Grid>

          <Grid item xs={12} md={8}>
            <EcommerceYearlySales />
          </Grid>

          {user.role === 'admin' && (
            <Grid item xs={12}>
              <BankingRecentTransitions />
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
