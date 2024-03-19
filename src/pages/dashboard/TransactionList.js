import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  IconButton,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
// import { _paymentList } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { PaymentListHead, PaymentListToolbar } from '../../sections/@dashboard/payment/list';
// utils
import axios from '../../utils/axios';
import { fDateTime } from '../../utils/formatTime';
import { fInvoiceCurrency } from '../../utils/formatNumber';
// hooks
import useAuth from '../../hooks/useAuth';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'transactionNoDate', label: 'Transaction No. & Date	', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'User Mail & No', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: true },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'receipt', label: 'Receipt', alignRight: false },
];

// ----------------------------------------------------------------------

export default function TransactionList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const [paymentList, setPaymentList] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('invoiceNo');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [counter, setCounter] = useState(0);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const copyPaymentLink = (link) => {
    navigator.clipboard.writeText(link);
    enqueueSnackbar('Payment Link copied to clipboard!');
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - paymentList.length) : 0;

  const filteredPayments = applySortFilter(paymentList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPayments.length && Boolean(filterName);

  useEffect(() => {
    const handleRequestGetAllPayments = async () => {
      const response =
        user.role === 'admin'
          ? await axios.get('/payment')
          : await axios.get(`/payment/get_all_by_email?email=${user.email}`);

      const updatePaymentList = response.data.map(payment => {
        if (payment.status === 'Pending' && isExpired(payment.expiryDate)) {
          return { ...payment, status: "Expired" };
        } 
          
        return payment;
      });

      setPaymentList(updatePaymentList);
    };

    handleRequestGetAllPayments();
  }, [user]);

  const isExpired = (expiryDate) => {
    const now = new Date();
    const expiryDateTime = new Date(expiryDate);
    return expiryDateTime < now;
  }

  return (
    <Page title="Payment: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Transaction"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'transaction' }]}
        />

        <Card>
          <PaymentListToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            filteredPayments={filteredPayments}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <PaymentListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={paymentList.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      id,
                      amount,
                      createdAt,
                      createdBy,
                      email,
                      expiryDate,
                      invoiceNo,
                      merchantReference,
                      paymentLink,
                      status,
                      visits,
                    } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="left">{invoiceNo}</TableCell>
                        <TableCell align="left">{merchantReference}</TableCell>
                        <TableCell align="left">{createdBy}</TableCell>
                        <TableCell align="right">{fInvoiceCurrency(amount / 100)}</TableCell>
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={
                              (status === 'Pending' && 'warning') ||
                              (status === 'Expired' && 'error') ||
                              'success'
                            }
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{email}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={paymentList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_payment) => {
      const { invoiceNo, merchantReference, email, orderDescription } = _payment;
      const lowerCaseQuery = query.toLowerCase();
      return (
        invoiceNo.toLowerCase().includes(lowerCaseQuery) ||
        merchantReference.toLowerCase().includes(lowerCaseQuery) ||
        email.toLowerCase().includes(lowerCaseQuery) ||
        orderDescription.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}
