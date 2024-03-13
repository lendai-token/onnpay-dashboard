import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { CodeEditorEditable } from 'react-code-editor-editable';
import './apiDocs.css';

const columns = [
  {
    id: 'method',
    label: 'Method',
    minWidth: 100,
  },
  {
    id: 'endpoint',
    label: 'Endpoint',
    minWidth: 200,
  },
  {
    id: 'description',
    label: 'Description',
    minWidth: 250,
  },
  {
    id: 'status',
    label: 'Status Code',
    minWidth: 100,
  },
];

const json = `{
  "serviceCommand": "PAYMENT_LINK",
  "merchantReference": "ORDER-202304110008",
  "amount": 10000,
  "currency": "AED",
  "language": "en",
  "email": "ahmed@payd.ae",
  "expiryDate": "2023-12-20T15:36:55+03:00",
  "linkCommand": "PURCHASE",
  "notification": "EMAIL",
  "invoiceNo": "INV-001",
  "orderDescription": "iPhone 6-S",
  "name": "Ahmed Aideed",
  "phone": 971564969040,
  "returnUrl": "http://localhost:3030/payment",
  "createdBy": "adam@onnpay.com"
}`;

function createData(method, endpoint, description, status) {
  return { method, endpoint, description, status };
}

const rows = [
  createData('POST', 'https://apis.onnpay.com/api/v1/payment/create_invoice', 'Create a new invoice', '201'),
];

export default function ApiDocs() {
  const [showRequest, setShowRequest] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [value, setValue] = useState(json);

  const handleRequestClick = () => {
    setShowRequest((prevShowTable) => !prevShowTable);
  };

  const handleResponseClick = () => {
    setShowResponse((prevShowTable) => !prevShowTable);
  };

  const handleChangeCode = (val) => {
    setValue(val);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3">API Documentation</Typography>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Here is a list of available API endpoints:
        </Typography>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.endpoint}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1">API Key Usage:</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            In order to access this API, you will need to obtain an API key from the admin. You can obtain the API key
            by following these steps:
          </Typography>
          <List sx={{ mt: 1 }}>
            <ListItem>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary="Create an account if you haven't already" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary="Navigate to the Edit Profile page and add all informations. Admin will check your profile and provide api key" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary="Copy the API key and use it in your API requests by setting the Authorization header to 'x-api-key'" />
            </ListItem>
          </List>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Create a new invoice
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2, cursor: 'pointer' }} onClick={handleRequestClick}>
            Request body{' '}
            {showRequest ? (
              <ExpandLessIcon sx={{ position: 'absolute' }} />
            ) : (
              <ExpandMoreIcon sx={{ position: 'absolute' }} />
            )}
          </Typography>
          {showRequest && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '100px' }}>ATTRIBUTES</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '& tr:nth-of-type(2n)': {
                      backgroundColor: '#F4F6F8',
                    },
                  }}
                >
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>merchantReference</b>
                      <br />
                      Alphanumeric
                      <br />
                      Mandatory
                      <br />
                      max: 40
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The Merchant's unique order number.
                      <br />
                      Example: ORDER-202305150001
                      <br />
                      Special characters: - _{' '}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>amount</b>
                      <br />
                      Numeric
                      <br />
                      Mandatory
                      <br />
                      max: 10
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The transaction's amount. *Each currency has predefined allowed decimal points that should be
                      taken into consideration when sending the amount.
                      <br />
                      Example: 100 USD=1.00 USD
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>currency</b>
                      <br />
                      Alpha
                      <br />
                      Mandatory
                      <br />
                      max: 3
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The currency of the transaction's amount in ISO code 3.
                      <br />
                      Example: USD
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>language</b>
                      <br />
                      Alpha
                      <br />
                      Mandatory
                      <br />
                      max: 2
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The invoice and the received messages language.
                      <br />
                      Possible/ expected values: en / ar
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>email</b>
                      <br />
                      Alphanumeric
                      <br />
                      Mandatory
                      <br />
                      max: 255
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The customer's email.
                      <br />
                      Example: ahmed@payd.ae
                      <br />
                      Special characters: _ - . @ +
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>expiryDate</b>
                      <br />
                      Alphanumeric
                      <br />
                      Mandatory
                      <br />
                      max: 25
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The invoice link expiry date.
                      <br />
                      Example: 2023-12-20T15:36:55+03:00
                      <br />
                      Special characters: + : -
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>notification</b>
                      <br />
                      Alpha
                      <br />
                      Mandatory
                      <br />
                      max: 20
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The way the Customer wants to use to get his notification. The Merchant can choose more than one
                      way. * If the Customer chooses NONE with “EMAIL” or “SMS”, then the NONE will be taken as
                      notification type.
                      <br />
                      Possible/ expected values:
                      <br />
                      - SMS
                      <br />
                      - EMAIL
                      <br />
                      - NONE
                      <br />
                      Special characters: ,
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>invoiceNo</b>
                      <br />
                      Alphanumeric
                      <br />
                      Optional
                      <br />
                      max: 20
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The ID of the generated Invoice payment link.
                      <br />
                      Example: INV-001
                      <br />
                      Special characters: - _ .
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>orderDescription</b>
                      <br />
                      Alphanumeric
                      <br />
                      Optional
                      <br />
                      max: 150
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      It holds the description of the order.
                      <br />
                      Example: iPhone 6-S
                      <br />
                      Special characters: ' / . _ - # : $ Space
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>name</b>
                      <br />
                      Alpha
                      <br />
                      Optional
                      <br />
                      max: 40
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The customer's name.
                      <br />
                      Example: Ahmed Aideed
                      <br />
                      Special characters: _ \ / - . ' Space
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>phone</b>
                      <br />
                      Numeric
                      <br />
                      Optional
                      <br />
                      max: 19
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The Customer mobile number. It's mandatory when selecting SMS as notification type.
                      <br />
                      Example: 00962797219966
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>returnUrl</b>
                      <br />
                      Alphanumeric
                      <br />
                      Optional
                      <br />
                      max: 400
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The URL of the Merchant's page to be redirected to when the order is processed.
                      <br />
                      Example: https://www.merchant.com
                      <br />
                      Special characters:$ ! = ? # & _ - / : .
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Typography variant="subtitle1" sx={{ mt: 4, mb: 2, cursor: 'pointer' }} onClick={handleResponseClick}>
            Response{' '}
            {showResponse ? (
              <ExpandLessIcon sx={{ position: 'absolute' }} />
            ) : (
              <ExpandMoreIcon sx={{ position: 'absolute' }} />
            )}
          </Typography>
          {showResponse && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '100px' }}>ATTRIBUTES</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '& tr:nth-of-type(2n)': {
                      backgroundColor: '#F4F6F8',
                    },
                  }}
                >
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>service_command</b>
                      <br />
                      Alpha
                      <br />
                      max: 20
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      Command.
                      <br />
                      Possible/ expected values: PAYMENT_LINK
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>access_code</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 20
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      Access code.
                      <br />
                      Possible/ expected Example: zx0IPmPy5jp1vAz
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>merchant_identifier</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 20
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The ID of the Merchant.
                      <br />
                      Example: CycHZxVj
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>merchant_reference</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 40
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The Merchant's unique order number.
                      <br />
                      Example: ORDER-202305150001
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>amount</b>
                      <br />
                      Numeric
                      <br />
                      max: 10
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The transaction's amount.
                      <br />
                      Example: 100 USD=1.00 USD
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>currency</b>
                      <br />
                      Alpha
                      <br />
                      max: 3
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The currency of the transaction's amount in ISO code 3.
                      <br />
                      Example: USD
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>language</b>
                      <br />
                      Alpha
                      <br />
                      max: 2
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The invoice and received messages language.
                      <br />
                      Possible/ expected values: en / ar
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>email</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 255
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The customer's email.
                      <br />
                      Example: ahmed@payd.ae
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>request_expiry_date</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 25
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The invoice link expiry date.
                      <br />
                      Example: 2023-12-20T15:36:55+03:00
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>notification_type</b>
                      <br />
                      Alpha
                      <br />
                      max: 20
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The way the Customer wants to use to get his notification. The Merchant can choose more than one
                      way. * If the Customer chooses NONE with “EMAIL” or “SMS”, then the NONE will be taken as
                      notification type.
                      <br />
                      Possible/ expected values:
                      <br />
                      - SMS
                      <br />
                      - EMAIL
                      <br />- NONE
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>signature</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 200
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      A string hashed using the Secure Hash Algorithm.
                      <br />
                      Example: 7cad05f0212ed933c9a5d5dffa31661acf2c827a
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>link_command</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 15
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      Link operation to be executed.
                      <br />
                      Possible/ expected values: AUTHORIZATION/ PURCHASE.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>payment_link_id</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 20
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The ID of the generated Invoice payment link.
                      <br />
                      Example: INV-001
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>payment_link</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 150
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The generated invoice link notified to the Customer by one of the notification types, used to
                      complete the payment process.
                      <br />
                      Example: https://sbcheckout.payfort.com/dfc3d762
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>payment_option</b>
                      <br />
                      Alpha
                      <br />
                      max: 10
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      Payment option.
                      <br />
                      Possible/ expected values:
                      <br />
                      - MASTERCARD
                      <br />
                      - VISA
                      <br />
                      - AMEX
                      <br />
                      - SADAD (for Purchase operations only)
                      <br />
                      - NAPS (for Purchase operations only)
                      <br />
                      - KNET(for Purchase operations only)
                      <br />
                      - MADA (for Purchase operations and eci Ecommerce only)
                      <br />- MEEZA (for Purchase operations and ECOMMERCE eci only)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>order_description</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 150
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      It holds the description of the order.
                      <br />
                      Example: iPhone 6-S
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>customer_name</b>
                      <br />
                      Alpha
                      <br />
                      max: 40
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The customer's name.
                      <br />
                      Example: Ahmed Aideed
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>response_message</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 150
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      Message description of the response code. It returns according to the request language.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>response_code</b>
                      <br />
                      Numeric
                      <br />
                      max: 5
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      Response Code carries the value of our system's response. *The code is made up of five digits, the
                      first 2 digits refer to the request status, and the last 3 digits refer to the request messages.
                      <br />
                      Example: 20064
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>status</b>
                      <br />
                      Numeric
                      <br />
                      max: 2
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      A two-digit numeric value that indicates the status of the transaction.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>customer_phone</b>
                      <br />
                      Numeric
                      <br />
                      max: 19
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The Customer mobile number. It's mandatory when selecting SMS as notification type.
                      <br />
                      Example: 00962797219966
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      <b>return_url</b>
                      <br />
                      Alphanumeric
                      <br />
                      max: 400
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                      The URL of the Merchant's page to be redirected to when the order is processed.
                      <br />
                      Example: https://www.merchant.com
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
            Example Value
          </Typography>
          <CodeEditorEditable
            value={value}
            setValue={handleChangeCode}
            width="100%"
            height="360px"
            language="json"
            inlineNumbers
          />
        </Box>
      </Box>
    </Container>
  );
}
