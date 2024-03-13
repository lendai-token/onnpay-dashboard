import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, InputAdornment } from '@mui/material';
import Papa from 'papaparse';
// components
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

SettlementListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filteredSettlements: PropTypes.array,
};

export default function SettlementListToolbar({ numSelected, filterName, onFilterName, filteredSettlements }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const settlements = [];
  filteredSettlements.forEach((item) => {
    const array = {
      date: item.date,
      amount: item.amount,
      createdBy: item.createdBy,
      status: item.status,
      createdTime: item.createdAt,
    };

    settlements.push(array);
  });

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
        }),
      }}
    >
      <InputStyle
        stretchStart={240}
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </RootStyle>
  );
}
