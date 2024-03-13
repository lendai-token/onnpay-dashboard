import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useTheme, styled } from '@mui/material/styles';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Stack,
} from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// utils
import axios from '../../../utils/axios';

import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';
import { fInvoiceCurrency } from '../../../utils/formatNumber';
import { FormProvider, RHFUploadSingleFile } from '../../../components/hook-form';

UploadDocumentModal.propTypes = {
  settlement: PropTypes.object,
};

export default function UploadDocumentModal({ open, onClose, onUpdate, settlement }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const isCompleted = settlement?.status === 'complete';

  const NewDocumentsSchema = Yup.object().shape({
    document: Yup.mixed().test('required', 'Document is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      document: settlement?.document || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settlement]
  );

  const methods = useForm({
    resolver: yupResolver(NewDocumentsSchema),
    defaultValues,
  });

  const handleClose = () => {
    onClose();
  };

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
      values.document = values.document.path ? values.document.path : values.document;
      values.status = 'complete';

      const response = await axios.patch(`/settlement/complete/${settlement.id}`, values);

      if (response.data.id > 0) {
        enqueueSnackbar('Successfully completed!');
        onUpdate();
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

          const response = await axios.post('/user/upload_document', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          enqueueSnackbar('Document uploaded successfully!');

          setValue('document', {
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant="h5" gutterBottom>
            Upload Document for completing settlement
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '24px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Date:
              </Typography>
              <Typography variant="body1">{settlement?.date}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Amount:
              </Typography>
              <Typography variant="body1">{fInvoiceCurrency(settlement?.amount)} AED</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Created By:
              </Typography>
              <Typography variant="body1">{settlement?.createdBy}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Created At:
              </Typography>
              <Typography variant="body1">{settlement?.createdAt}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Status:
              </Typography>
              <Typography variant="body1">
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={(settlement?.status === 'Pending' && 'warning') || 'success'}
                >
                  {settlement?.status}
                </Label>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={3}>
              <div>
                <Typography variant="subtitle1" gutterBottom sx={{ paddingTop: '16px' }}>
                  Document:
                </Typography>
                {isCompleted ? (
                  <Avatar src={settlement.document} variant="square" sx={{ width: '100%', height: '100%' }} />
                ) : (
                  <RHFUploadSingleFile
                    name="document"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    setValue={setValue}
                  />
                )}
              </div>
            </Stack>
          </Grid>
        </DialogContent>
        <DialogActions>
          {!isCompleted && (
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Complete Settlement
            </LoadingButton>
          )}
          <Button variant="contained" color="error" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
