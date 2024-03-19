import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Box } from '@mui/material';
// utils
import axios from '../../../utils/axios';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

Other.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function Other({ isEdit, currentUser }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const isUser = user.id === currentUser.id;

  const NewOtherSchema = Yup.object().shape({
    commission: Yup.number().required('Commission Percentage is required'),
    internationalCommission: Yup.number().required('International Commission Percentage is required'),
    withdrawal: Yup.number().required('Withdrawal Charge is required'),
    other: Yup.number().required('Other Charges is required'),
    accessCode: Yup.string().required('Access Code is required'),
    merchantId: Yup.string().required('Merchant Identifier is required'),
    shaRequest: Yup.string().required('SHA Request is required')
  });

  const defaultValues = useMemo(
    () => ({
      commission: currentUser?.commission || 0,
      internationalCommission: currentUser?.internationalCommission || 0,
      withdrawal: currentUser?.withdrawal || 0,
      other: currentUser?.other || 0,
      accessCode: currentUser?.accessCode || '',
      merchantId: currentUser?.merchantId || '',
      shaRequest: currentUser?.shaRequest || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewOtherSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      const response = await axios.patch(`/user/update_other/${currentUser.id}`, {
        commission: Number(values.commission),
        internationalCommission: Number(values.internationalCommission),
        withdrawal: Number(values.withdrawal),
        other: Number(values.other),
        accessCode: values.accessCode,
        merchantId: values.merchantId,
        shaRequest: values.shaRequest
      });

      if (response.data.id > 0) {
        enqueueSnackbar('Successfully saved!');
      }
    } catch (error) {
      error.message.forEach((msg) => {
        enqueueSnackbar(msg, {
          variant: 'error',
        });
      });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: 'grid',
                    rowGap: 3,
                    columnGap: 2,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <RHFTextField name="commission" label="Commission Percentage" type="number" disabled={isUser && true} />

                  <RHFTextField
                    name="internationalCommission"
                    label="International Commission Percentage"
                    type="number"
                    disabled={isUser && true}
                  />

                  <RHFTextField name="withdrawal" label="Withdrawal charge" type="number" disabled={isUser && true} />

                  <RHFTextField name="other" label="Other Charges" type="number" disabled={isUser && true} />
                </Box>

                <RHFTextField name="accessCode" label="Access Code" type="text" disabled={isUser && true} />
                <RHFTextField name="merchantId" label="Merchant Identifier" type="text" disabled={isUser && true} />
                <RHFTextField name="shaRequest" label="SHA Request" type="text" disabled={isUser && true} />
              </Stack>
              {!isUser && (
                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                  {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Save Changes
                  </LoadingButton>
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
