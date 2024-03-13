import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, IconButton, InputAdornment, Alert, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
  RHFUploadAvatar,
  RHFUploadSingleFile,
} from '../../../components/hook-form';
// utils
import axios from '../../../utils/axios';
import { fData } from '../../../utils/formatNumber';
// _mock
import { countries } from '../../../_mock';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  fontSize: '18px',
  marginBottom: theme.spacing(1),
}));

export default function RegisterForm() {
  const { register } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    company: Yup.string().required('Company name required'),
    website: Yup.string().required('Company website required'),
    no: Yup.string().required('Company no required'),
    email: Yup.string().email('Company Email must be a valid email address').required('Email is required'),
    name: Yup.string().required('Full name required'),
    phone: Yup.string().required('Phone number required'),
    password: Yup.string().required('Password is required'),
    country: Yup.string().required('Country required'),
    city: Yup.string().required('City required'),
    address: Yup.string().required('Address required'),
    vatId: Yup.string().required('VAT ID required'),
    avatar: Yup.mixed().test('required', 'Company Logo is required', (value) => value !== ''),
    activity: Yup.string().required('Business activity is required'),
    tradeLicense: Yup.mixed().test('required', 'Trade License is required', (value) => value !== ''),
    emiratesId: Yup.mixed().test('required', 'Emirates ID is required', (value) => value !== ''),
    passport: Yup.mixed().test('required', 'Passport is required', (value) => value !== ''),
    visa: Yup.mixed().test('required', 'Visa is required', (value) => value !== ''),
    accountNo: Yup.string().required('Account No is required'),
    iban: Yup.string().required('IBAN is required'),
    swiftCode: Yup.string().required('Swift Code is required'),
    bank: Yup.string().required('Bank Name is required'),
  });

  const defaultValues = {
    avatar: '',
    tradeLicense: '',
    emiratesId: '',
    passport: '',
    visa: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      data.role = 'user';
      data.avatar = data.avatar.path;
      data.tradeLicense = data.tradeLicense.path;
      data.emiratesId = data.emiratesId.path;
      data.passport = data.passport.path;
      data.visa = data.visa.path;

      await register(data);

      reset();

      enqueueSnackbar('Successfully registered! Please wait for the administrator to activate your account.');
    } catch (error) {
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
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

          setValue('avatar', {
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

  const handleTradeDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post('/user/upload_document', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          enqueueSnackbar('Trade License uploaded successfully!');

          setValue('tradeLicense', {
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

  const handleEmiratesDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post('/user/upload_document', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          enqueueSnackbar('Emirates ID uploaded successfully!');

          setValue('emiratesId', {
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

  const handlePassportDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post('/user/upload_document', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          enqueueSnackbar('Passport uploaded successfully!');

          setValue('passport', {
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

  const handleVisaDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post('/user/upload_document', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          enqueueSnackbar('Visa uploaded successfully!');

          setValue('visa', {
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
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <LabelStyle>General Information</LabelStyle>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '8px !important' }}>
          <RHFTextField name="company" label="Company name" />
          <RHFTextField name="website" label="Company website" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="no" label="Company no" />
          <RHFTextField name="email" label="Company mail" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="name" label="Full name" />
          <RHFTextField name="phone" label="Contact number" />
        </Stack>

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect name="country" label="Country" placeholder="Country">
            <option value="" />
            {countries.map((option) => (
              <option key={option.code} value={option.label}>
                {option.label}
              </option>
            ))}
          </RHFSelect>
          <RHFTextField name="city" label="City" />
        </Stack>

        <RHFTextField name="address" label="Address" />
        <RHFTextField name="vatId" label="VAT ID" />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFUploadAvatar
            name="avatar"
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
          <RHFTextField name="activity" multiline rows={8} label="Business Activity" />
        </Stack>

        <LabelStyle sx={{ marginTop: '40px !important' }}>Upload Documents</LabelStyle>

        <div>
          <LabelStyle>Trade Licence</LabelStyle>
          <RHFUploadSingleFile
            name="tradeLicense"
            accept="image/*"
            maxSize={3145728}
            onDrop={handleTradeDrop}
            setValue={setValue}
          />
        </div>
        <div>
          <LabelStyle>Emirates ID</LabelStyle>
          <RHFUploadSingleFile
            name="emiratesId"
            accept="image/*"
            maxSize={3145728}
            onDrop={handleEmiratesDrop}
            setValue={setValue}
          />
        </div>
        <div>
          <LabelStyle>Passport Copy </LabelStyle>
          <RHFUploadSingleFile
            name="passport"
            accept="image/*"
            maxSize={3145728}
            onDrop={handlePassportDrop}
            setValue={setValue}
          />
        </div>
        <div>
          <LabelStyle>Visa Copy</LabelStyle>
          <RHFUploadSingleFile
            name="visa"
            accept="image/*"
            maxSize={3145728}
            onDrop={handleVisaDrop}
            setValue={setValue}
          />
        </div>

        <LabelStyle sx={{ marginTop: '40px !important' }}>Bank Information</LabelStyle>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '8px !important' }}>
          <RHFTextField name="accountNo" label="Account No." />
          <RHFTextField name="iban" label="IBAN" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="swiftCode" label="Swift Code" />
          <RHFTextField name="bank" label="Bank Name" />
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
