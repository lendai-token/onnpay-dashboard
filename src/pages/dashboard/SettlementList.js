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
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  SettlementListHead,
  SettlementListToolbar,
  SettlementMoreMenu,
} from '../../sections/@dashboard/settlement/list';
import UploadDocumentModal from '../../sections/@dashboard/settlement/UploadDocumentModal';
// utils
import axios from '../../utils/axios';
import { fDateTime } from '../../utils/formatTime';
import { fInvoiceCurrency } from '../../utils/formatNumber';
// hooks
import useAuth from '../../hooks/useAuth';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: true },
  { id: 'createdBy', label: 'User Email', alignRight: false },
  { id: 'createdAt', label: 'Requested At', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function SettlementList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const { user } = useAuth();

  const [settlementList, setSettlementList] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('created_at');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
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

  const handleListUpdate = () => {
    handleRequestGetAllSettlements();
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - settlementList.length) : 0;

  const filteredSettlements = applySortFilter(settlementList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredSettlements.length && Boolean(filterName);

  const getStatusColor = (status) => {
    let color = '';
    if (status === 'request') {
      color = 'warning';
    } else if (status === 'approve') {
      color = 'info';
    } else if (status === 'complete') {
      color = 'success';
    } else {
      color = 'error';
    }
    return color;
  };

  const handleRequestGetAllSettlements = async () => {
    const response = await axios.get('/settlement');

    setSettlementList(response.data);
  };

  const handleOpen = (settlement) => {
    setOpenModal(true);
    setSelectedSettlement(settlement);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedSettlement(null);
  };

  useEffect(() => {
    handleRequestGetAllSettlements();
  }, [user]);

  return (
    <Page title="Payment: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Transaction"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'transaction' }]}
        />

        <Card>
          <SettlementListToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            filteredSettlements={filteredSettlements}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SettlementListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={settlementList.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredSettlements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, amount, createdAt, createdBy, date, status } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="left">
                          <Button onClick={() => handleOpen(row)}>{date}</Button>
                        </TableCell>
                        <TableCell align="right">{fInvoiceCurrency(amount)}</TableCell>
                        <TableCell align="left">{createdBy}</TableCell>
                        <TableCell align="left">{fDateTime(createdAt)}</TableCell>
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={getStatusColor(status)}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <SettlementMoreMenu onUpdate={handleListUpdate} settlementId={id} />
                        </TableCell>
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
            count={settlementList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <UploadDocumentModal
          open={openModal}
          onClose={handleClose}
          settlement={selectedSettlement}
          onUpdate={handleListUpdate}
        />
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
    return array.filter((_settlement) => {
      const { date, createdBy, createdAt, status } = _settlement;
      const lowerCaseQuery = query.toLowerCase();
      return (
        date.toLowerCase().includes(lowerCaseQuery) ||
        createdBy.toLowerCase().includes(lowerCaseQuery) ||
        createdAt.toLowerCase().includes(lowerCaseQuery) ||
        status.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}
