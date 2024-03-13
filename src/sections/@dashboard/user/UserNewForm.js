import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
// utils
import axios from '../../../utils/axios';
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewForm({ isEdit, currentUser }) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = isEdit
    ? Yup.object().shape({
        company: Yup.string().required('Company is required'),
        no: Yup.string().required('Company No is required'),
        email: Yup.string().required('Company Mail is required').email(),
        country: Yup.string().required('country is required'),
        city: Yup.string().required('City is required'),
        address: Yup.string().required('Address is required'),
        name: Yup.string().required('Name is required'),
        phone: Yup.string().required('Phone number is required'),
        vatId: Yup.string().required('VAT Id is required'),
        logoUrl: Yup.mixed().test('required', 'Company Logo is required', (value) => value !== ''),
      })
    : Yup.object().shape({
        company: Yup.string().required('Company is required'),
        no: Yup.string().required('Company No is required'),
        email: Yup.string().required('Company Mail is required').email(),
        country: Yup.string().required('country is required'),
        city: Yup.string().required('City is required'),
        address: Yup.string().required('Address is required'),
        name: Yup.string().required('Name is required'),
        phone: Yup.string().required('Phone number is required'),
        vatId: Yup.string().required('VAT Id is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
        confirmpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
        logoUrl: Yup.mixed().test('required', 'Company Logo is required', (value) => value !== ''),
      });

  const defaultValues = useMemo(
    () => ({
      company: currentUser?.company || '',
      website: currentUser?.website || '',
      no: currentUser?.no || '',
      email: currentUser?.email || '',
      country: currentUser?.country || '',
      city: currentUser?.city || '',
      address: currentUser?.address || '',
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      vatId: currentUser?.vatId || '',
      password: '',
      confirmpassword: '',
      activity: currentUser?.activity || '',
      logoUrl: currentUser?.avatar || '',
      activated: currentUser?.activated || false,
      isProfileAllowed: currentUser?.isProfileAllowed || false,
      isAllow: currentUser?.isAllow || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async () => {
    try {
      if (!isEdit) {
        values.role = 'user';
        values.avatar = values.logoUrl.path;

        const response = await axios.post(`/user/create`, values);

        if (response.data.id > 0) {
          enqueueSnackbar('Successfully created!');
        }
      } else {
        values.role = 'user';
        values.avatar = values.logoUrl.path ? values.logoUrl.path : values.logoUrl;

        const response = await axios.patch(`/user_edit/${currentUser.id}`, values);

        if (response.data.id > 0) {
          enqueueSnackbar('Successfully Updated!');
        }
      }
    } catch (error) {
      error.message.forEach((msg) => {
        enqueueSnackbar(msg, {
          variant: 'error',
        });
      });
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post('/user/upload_logo', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          enqueueSnackbar('Logo uploaded successfully!');

          setValue('logoUrl', {
            preview: URL.createObjectURL(file),
            path: response.data.url,
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <>
                <Label
                  color={!values.activated ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.activated ? 'Active' : 'Pending'}
                </Label>
                <Label
                  color={!values.isProfileAllowed ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 100 }}
                >
                  {values.isProfileAllowed ? 'Profile Active' : 'Profile Pending'}
                </Label>
              </>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="logoUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {user.role === 'admin' && (
              <>
                <RHFSwitch
                  name="isProfileAllowed"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Allow user profile
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Disabling this will block the user profile
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mb: 2, width: 1, justifyContent: 'space-between' }}
                />
                <RHFSwitch
                  name="activated"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        User Activated
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Disabling this will block the user
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mb: 2, width: 1, justifyContent: 'space-between' }}
                />
                <RHFSwitch
                  name="isAllow"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Allow payment gateway
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Disabling this will disable the payment gateway of the user
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                />
              </>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="company" label="Company Name" />
              <RHFTextField name="website" label="Company Website" />
              <RHFTextField name="no" label="Company No" />
              <RHFTextField name="email" label="Company Mail" />

              <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="city" label="City" />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="name" label="Authorized Person Name" />
              <RHFTextField name="phone" label="Contact Number" />
              <RHFTextField name="vatId" label="VAT Id" />

              {!isEdit && (
                <>
                  <RHFTextField name="password" type="password" label="New Password" />
                  <RHFTextField name="confirmpassword" type="password" label="Confirm New Password" />
                </>
              )}
              {/* <RHFSelect name="role" label="Role" placeholder="User Role">
                <option value="" />
                {roles.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="activity" multiline rows={4} label="Business Activity" />

              <LoadingButton sx={{ mt: 3 }} type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
