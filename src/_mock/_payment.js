import _mock from './_mock';
import { randomInArray } from './funcs';

export const _paymentList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  amount: _mock.number.price(index),
  createdAt: _mock.time(index),
  createdby: _mock.email(index),
  currency: randomInArray(['AED', 'USD']),
  deletedAt: _mock.time(index),
  email: _mock.email(index),
  expiryDate: _mock.time(index),
  invoiceNo: 'INV-001',
  isDelete: 'false',
  language: 'en',
  merchantReference: 'ORDER-202304170001',
  name: _mock.name.fullName(index),
  notification: randomInArray(['Email', 'SMS']),
  orderDescription: 'i phone',
  paymentLink: '',
  phone: _mock.phoneNumber(index),
  status: randomInArray(['Paid', 'Pending']),
  updatedAt: _mock.time(index),
  visits: 0,
}));
