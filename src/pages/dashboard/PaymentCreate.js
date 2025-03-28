import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import PaymentNewForm from '../../sections/@dashboard/payment/PaymentNewForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');

  const currentUser = _userList.find((user) => paramCase(user.name) === name);

  return (
    <Page title="Payment: Create a new invoice">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new invoice' : 'Edit invoice'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Payment', href: PATH_DASHBOARD.general.payment },
            { name: !isEdit ? 'New invoice' : capitalCase(name) },
          ]}
        />

        <PaymentNewForm isEdit={isEdit} currentPayment={currentUser} />
      </Container>
    </Page>
  );
}
