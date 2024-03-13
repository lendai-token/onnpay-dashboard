import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { MenuItem, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';
// utils
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

SettlementMoreMenu.propTypes = {
  settlementId: PropTypes.any,
  onUpdate: PropTypes.any,
};

export default function SettlementMoreMenu({ settlementId, onUpdate }) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleUpdateStatus = async (id, statusValue) => {
    const data = {
      status: statusValue,
    };

    const response = await axios.patch(`/settlement/update_status/${id}`, data);

    if (response.data.id > 0) {
      enqueueSnackbar('Action succeeded!');
      onUpdate();
    }
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem onClick={() => handleUpdateStatus(settlementId, 'approve', onUpdate)} sx={{ color: 'info.main' }}>
          <Iconify icon={'eva:checkmark-fill'} sx={{ ...ICON }} />
          Approve
        </MenuItem>

        <MenuItem onClick={() => handleUpdateStatus(settlementId, 'reject', onUpdate)} sx={{ color: 'error.main' }}>
          <Iconify icon={'basil:cross-outline'} sx={{ ...ICON }} />
          Reject
        </MenuItem>
      </MenuPopover>
    </>
  );
}
