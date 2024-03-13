import _mock from './_mock';

// ----------------------------------------------------------------------

export const _bankingContacts = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  email: _mock.email(index),
  avatar: _mock.image.avatar(index + 4),
}));

export const _bankingQuickTransfer = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  email: _mock.email(index),
  avatar: _mock.image.avatar(index),
}));

export const _bankingCreditCard = [
  {
    id: _mock.id(2),
    balance: 23432.03,
    cardType: 'mastercard',
    cardHolder: _mock.name.fullName(2),
    cardNumber: '**** **** **** 3640',
    cardValid: '11/22',
  },
  {
    id: _mock.id(3),
    balance: 18000.23,
    cardType: 'visa',
    cardHolder: _mock.name.fullName(3),
    cardNumber: '**** **** **** 8864',
    cardValid: '11/25',
  },
  {
    id: _mock.id(4),
    balance: 2000.89,
    cardType: 'mastercard',
    cardHolder: _mock.name.fullName(4),
    cardNumber: '**** **** **** 7755',
    cardValid: '11/22',
  },
];

export const _bankingRecentTransitions = [
  {
    id: _mock.id(2),
    name: _mock.name.fullName(2),
    avatar: _mock.image.avatar(8),
    company: 'company',
    date: 1627556358365,
    invoice: 10,
    amount: 811.45,
  },
  {
    id: _mock.id(3),
    name: _mock.name.fullName(3),
    avatar: _mock.image.avatar(9),
    company: 'company',
    date: 1627556329038,
    invoice: 10,
    amount: 436.03,
  },
  {
    id: _mock.id(4),
    name: _mock.name.fullName(4),
    avatar: _mock.image.avatar(12),
    company: 'company',
    date: 1627556339677,
    invoice: 10,
    amount: 82.26,
  },
  {
    id: _mock.id(5),
    name: _mock.name.fullName(6),
    avatar: null,
    company: 'company',
    date: 1627547330510,
    invoice: 10,
    amount: 480.73,
  },
  {
    id: _mock.id(6),
    name: _mock.name.fullName(5),
    avatar: null,
    company: 'company',
    date: 1627556347676,
    invoice: 10,
    amount: 11.45,
  },
];
