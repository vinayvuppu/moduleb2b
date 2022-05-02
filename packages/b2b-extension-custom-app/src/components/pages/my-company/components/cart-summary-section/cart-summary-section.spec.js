import React from 'react';
import { shallow } from 'enzyme';
import {
  IconButton,
  Text,
  LoadingSpinner,
} from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import OrderCreateOwnerConnector from '../order-create-owner-connector';
import OrderCreateSummaryPanel from '../order-create-cart-summary';
import messages from './messages';
import { CartSummarySection } from './cart-summary-section';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

jest.mock('../../hooks/use-tracking');

// mock useLocalized, which returns a function 'localize',
// we then mock that to return a random string
jest.mock('@commercetools-local/hooks', () => ({
  useLocalize: () => () => 'some localized text',
}));

const createB2BApolloClientContextProps = () => ({ apolloClient: {} });

const createTestProps = props => ({
  title: 'test-title',
  cartDraft: {
    currency: 'EUR',
    id: 'some-id',
    lineItems: [],
    totalPrice: {
      centAmount: 0,
    },
  },
  intl: intlMock,
  goToCountrySelection: jest.fn(),
  store: {
    id: 'store-1',
    key: 'store-1',
    nameAllLocales: [
      {
        locale: 'de',
        value: 'deutschland',
      },
    ],
  },
  company: {},
  showNotification: jest.fn(),
  onActionError: jest.fn(),
  ...props,
});

const createConnectorProps = props => ({
  employeeFetcher: {
    isLoading: false,
    employee: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@commercetools.de',
      roles: [],
      company: {
        name: 'cg-test',
      },
    },
  },
  ...props,
});

const createLineItem = props => ({
  variant: {
    prices: [
      {
        country: 'CA',
        value: {
          currencyCode: 'EUR',
        },
      },
      {
        country: null,
      },
      {
        country: 'ES',
        value: {
          currencyCode: 'EUR',
        },
      },
    ],
  },
  ...props,
});

describe('render', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CartSummarySection {...props} />);
  });

  it('should render basic content', () => {
    expect(wrapper.find(Text.Headline)).toHaveProp('children', 'test-title');
  });

  it('should render the `OrderCreateSummaryPanel` component', () => {
    expect(wrapper).toRender(OrderCreateSummaryPanel);
  });

  describe('when a country has not been selected', () => {
    it('should not render EditIcon', () => {
      expect(wrapper).not.toRender(IconButton);
    });
  });
  describe('when a country has been selected', () => {
    beforeEach(() => {
      props = createTestProps({
        cartDraft: {
          currency: 'EUR',
          id: 'some-id',
          country: 'CA',
          lineItems: [createLineItem()],
          totalPrice: {
            centAmount: 0,
          },
        },
      });
      wrapper = shallow(<CartSummarySection {...props} />);
      wrapper.find(IconButton).prop('onClick')();
    });
    it('should render EditIcon', () => {
      expect(wrapper).toRender(IconButton);
    });

    it('should call goToCountrySelection', () => {
      expect(props.goToCountrySelection).toHaveBeenCalled();
    });

    it('should call goToCountrySelection with correct parameters', () => {
      expect(props.goToCountrySelection).toHaveBeenCalledWith(
        expect.objectContaining({
          availableCountries: ['CA', 'ES'],
        })
      );
    });
  });
  describe('when the employee has been selected', () => {
    beforeEach(() => {
      props = createTestProps({
        cartDraft: {
          currency: 'EUR',
          id: 'some-id',
          country: 'CA',
          customerId: 'some-id',
          lineItems: [],
          totalPrice: {
            centAmount: 0,
          },
        },
      });
      wrapper = shallow(<CartSummarySection {...props} />);
      wrapper = wrapper
        .find(B2BApolloClientContext.Consumer)
        .renderProp('children')(createB2BApolloClientContextProps())
        .find(OrderCreateOwnerConnector)
        .renderProp('children')(createConnectorProps());
    });
    it('should render message for the customer group', () => {
      expect(
        wrapper
          .findWhere(
            component =>
              component.name() === 'TextBody' &&
              component.prop('intlMessage').id === messages.company.id
          )
          .exists()
      ).toEqual(true);
    });
    it('should render message for the customer', () => {
      expect(
        wrapper
          .findWhere(
            component =>
              component.name() === 'TextBody' &&
              component.prop('intlMessage').id === messages.customer.id
          )
          .exists()
      ).toEqual(true);
    });

    it('should render CartSummaryBudgetRemaining', () => {
      expect(wrapper).toRender('CartSummaryBudgetRemaining');
    });
  });
  describe('when is loading customer info', () => {
    beforeEach(() => {
      props = createTestProps({
        cartDraft: {
          currency: 'EUR',
          id: 'some-id',
          country: 'CA',
          customerId: 'some-id',
          lineItems: [],
          totalPrice: {
            centAmount: 0,
          },
        },
      });
      wrapper = shallow(<CartSummarySection {...props} />);
      wrapper = wrapper
        .find(B2BApolloClientContext.Consumer)
        .renderProp('children')(createB2BApolloClientContextProps())
        .find(OrderCreateOwnerConnector)
        .renderProp('children')(
        createConnectorProps({
          employeeFetcher: {
            isLoading: true,
            employee: {},
          },
        })
      );
    });
    it('should render <LoadingSpinner>', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });
});
