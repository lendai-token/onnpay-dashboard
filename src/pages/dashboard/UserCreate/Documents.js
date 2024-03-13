import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Stack, Typography } from '@mui/material';
// utils
import axios from '../../../utils/axios';
// components
import { FormProvider, RHFUploadSingleFile } from '../../../components/hook-form';
//

// ----------------------------------------------------------------------

Documents.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function Documents({ isEdit, currentUser }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewDocumentsSchema = Yup.object().shape({
    tradeLicense: Yup.mixed().test('required', 'Trade License is required', (value) => value !== ''),
    emiratesId: Yup.mixed().test('required', 'Emirates ID is required', (value) => value !== ''),
    passport: Yup.mixed().test('required', 'Passport is required', (value) => value !== ''),
    visa: Yup.mixed().test('required', 'Visa is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      tradeLicense: currentUser?.tradeLicense || '',
      emiratesId: currentUser?.emiratesId || '',
      passport: currentUser?.passport || '',
      visa: currentUser?.visa || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewDocumentsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      values.tradeLicense = values.tradeLicense.path ? values.tradeLicense.path : values.tradeLicense;
      values.emiratesId = values.emiratesId.path ? values.emiratesId.path : values.emiratesId;
      values.passport = values.passsport.path ? values.passsport.path : values.passsport;
      values.visa = values.visa.path ? values.visa.path : values.visa;

      const response = await axios.patch(`/user/update_document/${currentUser.id}`, values);

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
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <LabelStyle>Trade Licence</LabelStyle>
                  <RHFUploadSingleFile name="tradeLicense" accept="image/*" maxSize={3145728} onDrop={handleTradeDrop} setValue={setValue} />
                </div>
                <div>
                  <LabelStyle>Emirates ID</LabelStyle>
                  <RHFUploadSingleFile name="emiratesId" accept="image/*" maxSize={3145728} onDrop={handleEmiratesDrop} setValue={setValue} />
                </div>
                <div>
                  <LabelStyle>Passport Copy </LabelStyle>
                  <RHFUploadSingleFile name="passport" accept="image/*" maxSize={3145728} onDrop={handlePassportDrop} setValue={setValue} />
                </div>
                <div>
                  <LabelStyle>Visa Copy</LabelStyle>
                  <RHFUploadSingleFile name="visa" accept="image/*" maxSize={3145728} onDrop={handleVisaDrop} setValue={setValue} />
                </div>
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
