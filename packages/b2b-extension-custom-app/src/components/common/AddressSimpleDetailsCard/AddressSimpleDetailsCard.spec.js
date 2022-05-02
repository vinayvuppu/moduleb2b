import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';
import AddressSimpleDetailsCard from './AddressSimpleDetailsCard';

describe('AddressSimpleDetailsCard component', () => {
  test('render snapshot', () => {
    const { asFragment } = render(
      <IntlProvider locale="en">
        <AddressSimpleDetailsCard type="shipping" address={{ country: 'us' }} />
      </IntlProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
