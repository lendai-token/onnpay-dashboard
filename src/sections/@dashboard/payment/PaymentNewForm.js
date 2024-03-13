import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, DateTimePicker } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { currencies, notifications, languages } from '../../../_mock';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
// utils
import axios from '../../../utils/axios';
import { fDateTimeWithTimezone } from '../../../utils/formatTime';
// hooks
import useAuth from '../../../hooks/useAuth';
// ----------------------------------------------------------------------

PaymentNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPayment: PropTypes.object,
};

export default function PaymentNewForm({ isEdit, currentPayment }) {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewPaymentSchema = Yup.object().shape({
    invoiceNo: Yup.string().required('Invoice Number is required'),
    merchantReference: Yup.string().required('Merchant Reference is required'),
    email: Yup.string().required('Email is required').email(),
    amount: Yup.string().required('Amount is required'),
    currency: Yup.string().required('Currency is required'),
    language: Yup.string().required('Language is required'),
    expiryDate: Yup.string().required('Expiry Date is required'),
    notification: Yup.string().required('Notification Type is required'),
  });

  const defaultValues = useMemo(
    () => ({
      invoiceNo: currentPayment?.name || '',
      merchantReference: currentPayment?.merchantReference || '',
      orderDescription: currentPayment?.orderDescription || '',
      email: currentPayment?.email || '',
      name: currentPayment?.name || '',
      phone: currentPayment?.phone || '',
      amount: currentPayment?.amount || 0,
      currency: currentPayment?.currency || '',
      notification: currentPayment?.notification || '',
      expiryDate: currentPayment?.expiryDate || new Date(),
      language: currentPayment?.language || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPayment]
  );

  const methods = useForm({
    resolver: yupResolver(NewPaymentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentPayment) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPayment]);

  const values = watch();

  const onSubmit = async () => {
    try {
      values.createdBy = user.email;
      values.amount = parseFloat(values.amount);
      values.serviceCommand = 'PAYMENT_LINK';
      values.linkCommand = 'PURCHASE';
      values.returnUrl = 'http://localhost:3030/payment';
      values.expiryDate = fDateTimeWithTimezone(values.expiryDate);

      const config = {
        headers: { 'x-api-key': user.apiKey !== null ? user.apiKey : process.env.REACT_APP_DEFAULT_API_KEY },
      };

      console.log(config);

      const response = await axios.post('/payment/create_invoice', values, config);

      if (response.data.status === '00' && response.data.response_message) {
        enqueueSnackbar(response.data.response_message, {
          variant: 'error',
        });
      } else {
        reset();
        enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
        navigate(PATH_DASHBOARD.general.payment);
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="invoiceNo" label="Invoice No" />
              <RHFTextField name="merchantReference" label="Merchant Reference" />
              <RHFTextField name="orderDescription" label="Order Description" />
              <DateTimePicker
                disablePast
                label="Expiry Date"
                name="expiryDate"
                value={values.expiryDate}
                onChange={(newValue) => {
                  methods.setValue('expiryDate', newValue, { shouldValidate: true });
                }}
                renderInput={(params) => <RHFTextField {...params} />}
              />
              <RHFTextField name="email" label="Customer Email" />
              <RHFTextField name="name" label="Customer Name" />
              <RHFTextField name="amount" label="Amount" />
              <RHFSelect name="currency" label="Currency" placeholder="Currency">
                <option value="" />
                {currencies.map((option) => (
                  <option key={option.symbol} value={option.symbol}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect name="notification" label="Notification Type" placeholder="Notification Type">
                <option value="" />
                {notifications.map((option) => (
                  <option key={option.type} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="phone" label="Phone Number" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFSelect name="language" label="Language" placeholder="Language">
                <option value="" />
                {languages.map((option) => (
                  <option key={option.symbol} value={option.symbol}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <LoadingButton type="submit" sx={{ mt: 3 }} variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
