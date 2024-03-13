import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack } from '@mui/material';
// utils
import axios from '../../../utils/axios';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

BankInformation.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function BankInformation({ isEdit, currentUser }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewBankSchema = Yup.object().shape({
    accountNo: Yup.string().required('Account No is required'),
    iban: Yup.string().required('IBAN is required'),
    swiftCode: Yup.string().required('Swift Code is required'),
    bank: Yup.string().required('Bank Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      accountNo: currentUser?.accountNo || '',
      iban: currentUser?.iban || '',
      swiftCode: currentUser?.swiftCode || '',
      bank: currentUser?.bank || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewBankSchema),
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
      const response = await axios.patch(`/user/update_bank/${currentUser.id}`, values);

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
                <RHFTextField name="accountNo" label="Account No." />

                <RHFTextField name="iban" label="IBAN" />

                <RHFTextField name="swiftCode" label="Swift Code" />

                <RHFTextField name="bank" label="Bank Name" />
              </Stack>

              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
