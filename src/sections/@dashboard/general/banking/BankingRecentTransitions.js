import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Avatar,
  Button,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency, fInvoiceCurrency } from '../../../../utils/formatNumber';
import axios from '../../../../utils/axios';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

export default function BankingRecentTransitions() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [userList, setUser] = useState([]);

  const handleButtonClick = () => {
    navigate(PATH_DASHBOARD.user.list, { replace: true });
  };

  const convertDate = (string) => {
    const date = new Date(string);

    return Math.floor(date.getTime());
  };

  useEffect(() => {
    const getTopUsers = async () => {
      const response = await axios.get('/payment/get_top_five_users');

      setUser(response.data);
    };

    getTopUsers();
  }, [user]);

  return (
    <>
      <Card>
        <CardHeader title="Top 5 merchants/users for this month" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Joined Date</TableCell>
                  <TableCell>Created Invoice</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative' }}>{renderAvatar(row.user.name, row.user.avatar)}</Box>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {row.user.company}
                          </Typography>
                          <Typography variant="subtitle2"> {row.user.name}</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {format(new Date(convertDate(row.user.createdAt)), 'dd MMM yyyy')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {format(new Date(convertDate(row.user.createdAt)), 'p')}
                      </Typography>
                    </TableCell>

                    <TableCell>{row.count}</TableCell>

                    <TableCell>
                      {row.totalUSD * 1 > 0 && <p>{fCurrency(row.totalUSD / 100)}</p>}
                      {row.totalAED * 1 > 0 && <p>{fInvoiceCurrency(row.totalAED / 100)} AED</p>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
            onClick={handleButtonClick}
          >
            View All
          </Button>
        </Box>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

function renderAvatar(name, avatar) {
  return (
    <Avatar alt={name} src={avatar} sx={{ width: 48, height: 48, boxShadow: (theme) => theme.customShadows.z8 }} />
  );
}
