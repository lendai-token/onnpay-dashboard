import { useState, useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Box, Container, Tab, Tabs } from '@mui/material';
import Iconify from '../../../components/Iconify';
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import UserNewForm from '../../../sections/@dashboard/user/UserNewForm';
// utils
import axios from '../../../utils/axios';
import Documents from './Documents';
import BankInformation from './BankInformation';
import Other from './Other';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const [currentTab, setCurrentTab] = useState('general');
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentUser, setCurrentUser] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`/user/${id}`);

      const user = response.data;

      setCurrentUser(user);
      setName(response.data.name);
    };

    if (isEdit)
      getUser();
  }, [id]);

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <UserNewForm isEdit={isEdit} currentUser={currentUser} />,
    },
    {
      value: 'documents',
      icon: <Iconify icon={'solar:documents-bold-duotone'} width={20} height={20} />,
      component: <Documents isEdit={isEdit} currentUser={currentUser} />,
    },
    {
      value: 'bank information',
      icon: <Iconify icon={'mdi:bank-circle'} width={20} height={20} />,
      component: <BankInformation isEdit={isEdit} currentUser={currentUser} />,
    },
    {
      value: 'others',
      icon: <Iconify icon={'icon-park-outline:other'} width={20} height={20} />,
      component: <Other isEdit={isEdit} currentUser={currentUser} />,
    },
  ];

  return (
    <Page title={!isEdit ? "User: Create a new user" : 'User: Edit user'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New user' : name },
          ]}
        />

        {isEdit ? (
          <>
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              allowScrollButtonsMobile
              onChange={(e, value) => setCurrentTab(value)}
            >
              {ACCOUNT_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
              ))}
            </Tabs>

            <Box sx={{ mb: 5 }} />

            {ACCOUNT_TABS.map((tab) => {
              const isMatched = tab.value === currentTab;
              return isMatched && <Box key={tab.value}>{tab.component}</Box>;
            })}
          </>) :
          <UserNewForm isEdit={isEdit} currentUser={currentUser} />
        }
      </Container>
    </Page>
  );
}
