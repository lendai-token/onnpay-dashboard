import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import axios from '../../../../utils/axios';
import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const qrData = JSON.stringify(user);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    name: user?.name || '',
    email: user?.email || '',
    photoURL: user?.avatar || '',
    phone: user?.phone || '',
    country: user?.country || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    zipcode: user?.zipcode || '',
    apiKey: user?.apiKey || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [showKey, setShowKey] = useState(false);
  const handleClickShowKey = () => setShowKey(!showKey);

  const onSubmit = async () => {
    try {
      values.role = user.role;
      values.avatar = values.photoURL.path;
      const response = await axios.patch(`/user/${user.id}`, values);

      if (response.data.id > 0) {
        enqueueSnackbar('Update success!');
      } else {
        enqueueSnackbar('Profile update failed!', {
          variant: 'error',
        });
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

          const response = await axios.post('/user/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          enqueueSnackbar('Avatar uploaded successfully!');

          setValue('photoURL', {
            preview: URL.createObjectURL(file),
            path: response.data.url,
          });
        } catch (error) {
          error.message.forEach((msg) => {
            enqueueSnackbar(msg, {
              variant: 'error',
            });
          });
        }
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
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
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="email" label="Email Address" />

              <RHFTextField name="phone" label="Phone Number" />
              <RHFTextField name="address" label="Address" />

              <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />

              <RHFTextField name="city" label="City" />
              <RHFTextField name="zipcode" label="Zip/Code" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {defaultValues.apiKey && (
                <RHFTextField
                  name="apiKey"
                  label="API Key"
                  disabled="true"
                  InputProps={{
                    type: showKey ? 'text' : 'password',
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowKey} edge="end">
                          {showKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
