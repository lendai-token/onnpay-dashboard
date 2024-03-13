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

PaymentListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filteredPayments: PropTypes.array,
};

export default function PaymentListToolbar({ numSelected, filterName, onFilterName, filteredPayments }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const payments = [];
  filteredPayments.forEach((item) => {
    const array = {
      invoiceNumber: item.invoiceNo,
      merchantReference: item.merchantReference,
      customerEmail: item.email,
      amount: item.amount,
      visitsCount: item.visits,
      status: item.status,
      createdTime: item.createdAt,
      expiryDate: item.expiryDate,
      createdBy: item.createdBy,
      paymentLink: item.paymentLink,
    };

    payments.push(array);
  });

  const handleExportToCSV = async () => {
    const headers = [
      { label: 'Invoice Number', key: 'invoiceNumber' },
      { label: 'Merchant Reference', key: 'merchantReference' },
      { label: 'Customer Email', key: 'customerEmail' },
      { label: 'Amount', key: 'amount' },
      { label: 'Visits Count', key: 'visitsCount' },
      { label: 'Status', key: 'status' },
      { label: 'Created Time', key: 'createdTime' },
      { label: 'Expiry Date', key: 'expiryDate' },
      { label: 'Created By', key: 'createdBy' },
      { label: 'Payment Link', key: 'paymentLink' },
    ];

    const fields = headers.map((header) => header.label);
    const data = payments.map((payment) => Object.values(payment));
    const csvData = Papa.unparse({ fields, data });
    const csvBlob = new Blob([csvData], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = csvUrl;
    downloadLink.download = 'payments.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

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

      <Tooltip title="Export to CSV">
        <IconButton onClick={handleExportToCSV}>
          <Iconify icon={'foundation:page-export-csv'} />
        </IconButton>
      </Tooltip>
    </RootStyle>
  );
}
