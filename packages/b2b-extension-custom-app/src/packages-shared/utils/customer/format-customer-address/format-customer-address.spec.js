import formatCustomerAddress from './format-customer-address';

describe('formatting', () => {
  it('formats address with a null street number value', () => {
    const address = {
      streetName: 'Wallaby Way',
      streetNumber: null,
    };

    const actual = formatCustomerAddress(address);
    expect(actual).toBe('Wallaby Way');
  });

  it('formats address with a null street name value', () => {
    const address = {
      streetName: null,
      streetNumber: 42,
    };

    const actual = formatCustomerAddress(address);
    expect(actual).toBe('-');
  });

  it('formats address with street name and number values set to null', () => {
    const address = {
      streetName: null,
      streetNumber: null,
    };

    const actual = formatCustomerAddress(address);
    expect(actual).toBe('-');
  });

  it('formats address with street name and number', () => {
    const address = {
      streetName: 'Wallaby Way',
      streetNumber: 42,
    };

    const actual = formatCustomerAddress(address);
    expect(actual).toBe('Wallaby Way 42');
  });
});
