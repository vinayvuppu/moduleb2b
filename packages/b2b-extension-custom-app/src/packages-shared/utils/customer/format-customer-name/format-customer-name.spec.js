import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import formatCustomerName from './format-customer-name';

describe('formatting', () => {
  it('formats customer with a null last name value', () => {
    const customer = {
      firstName: ' Bob   ',
      lastName: null,
    };

    const actual = formatCustomerName(customer);
    expect(actual).toBe('Bob');
  });

  it('formats customer with a null first name value', () => {
    const customer = {
      firstName: null,
      lastName: '  Bobbington',
    };

    const actual = formatCustomerName(customer);
    expect(actual).toBe('Bobbington');
  });

  it('formats customer with first and last name values set to null', () => {
    const customer = {
      firstName: null,
      lastName: null,
    };

    const actual = formatCustomerName(customer);
    expect(actual).toBe(NO_VALUE_FALLBACK);
  });

  it('formats customer with first and last name values', () => {
    const customer = {
      firstName: ' Bob    ',
      lastName: 'Bobbington ',
    };

    const actual = formatCustomerName(customer);
    expect(actual).toBe('Bob Bobbington');
  });
});
