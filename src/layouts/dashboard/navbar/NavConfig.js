// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';
// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  cart: getIcon('ic_cart'),
  user: getIcon('ic_user'),
  banking: getIcon('ic_banking'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  payment: getIcon('ic_banking'),
  settlement: getIcon('ic_settlement'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      // { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'dashboard', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.analytics },
      // { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
      { title: 'transaction', path: PATH_DASHBOARD.general.transaction, icon: ICONS.booking },
      { title: 'payment', path: PATH_DASHBOARD.general.payment, icon: ICONS.banking },
      { title: 'settlement', path: PATH_DASHBOARD.general.settlement, icon: ICONS.settlement, role: 'admin' },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          // { title: 'profile', path: PATH_DASHBOARD.user.profile },
          // { title: 'cards', path: PATH_DASHBOARD.user.cards },
          { title: 'list', path: PATH_DASHBOARD.user.list },
          { title: 'create', path: PATH_DASHBOARD.user.newUser },
          { title: 'edit', path: PATH_DASHBOARD.user.editById },
          // { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },

      //     // MANAGEMENT : E-COMMERCE
      //     {
      //       title: 'e-commerce',
      //       path: PATH_DASHBOARD.eCommerce.root,
      //       icon: ICONS.cart,
      //       children: [
      //         { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
      //         { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
      //         { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
      //         { title: 'create', path: PATH_DASHBOARD.eCommerce.newProduct },
      //         { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
      //         { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
      //         { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice },
      //       ],
      //     },
    ],
  },
];

export default navConfig;
