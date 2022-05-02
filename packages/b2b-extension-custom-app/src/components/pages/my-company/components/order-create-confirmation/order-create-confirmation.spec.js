import { PropTypes } from 'prop-types';
import React from 'react';
import { shallow } from 'enzyme';
import {
  CollapsiblePanel,
  PaperBillInvertedIcon,
  TruckIcon,
} from '@commercetools-frontend/ui-kit';
import { intlMock } from '@commercetools-local/test-utils';
import OrderCreateItemsTable from '../order-create-items-table';
import { OrderCreateConfirmation } from './order-create-confirmation';
import AddressSummary from '../address-summary';
import OrderTotalsLastRow from '../order-totals-last-row';

const createCartDraft = custom => ({
  lineItems: [],
  shippingAddress: {
    country: 'DE',
  },
  billingAddress: {
    country: 'DE',
  },
  shippingInfo: {
    shippingMethodName: 'UPS',
    price: {
      currencyCode: 'EUR',
      centAmount: '1000',
    },
  },
  totalPrice: {
    currencyCode: 'EUR',
    centAmount: '40000',
  },
  ...custom,
});

const createTestProps = props => ({
  renderSaveToolbarStep: jest.fn(),
  allLineItems: [
    {
      id: 'line-item-id-3',
    },
    {
      id: 'line-item-id-4',
    },
    {
      id: 'line-item-id-5',
    },
  ],
  cartDraft: createCartDraft(),
  intl: intlMock,
  ...props,
});

const TestRowItem = ({ children }) => <div>{children}</div>;
TestRowItem.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateConfirmation {...props} />);
  });

  it('should match layout structure', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a CollapsiblePanel', () => {
    expect(wrapper).toRender(CollapsiblePanel);
  });
  it('should render two AddressSummary component', () => {
    expect(wrapper).toRenderElementTimes(AddressSummary, 2);
  });
  it('should render the TruckIcon icon', () => {
    expect(wrapper).toRender(TruckIcon);
  });
  it('should render the PaperBillInvertedIcon icon', () => {
    expect(wrapper).toRender(PaperBillInvertedIcon);
  });
  it('should render the OrderTotalsLastRow component', () => {
    expect(wrapper).toRender(OrderTotalsLastRow);
  });
  it('should pass the order total to the OrderTotalsLastRow component', () => {
    expect(wrapper.find(OrderTotalsLastRow)).toHaveProp('total', 'EUR 390');
  });
  it('should render the create order items table', () => {
    expect(wrapper).toRender(OrderCreateItemsTable);
  });
  it('should call `renderSaveToolbarStep`', () => {
    expect(props.renderSaveToolbarStep).toHaveBeenCalled();
  });

  describe('when missing shippingInfo', () => {
    beforeEach(() => {
      props = createTestProps({
        cartDraft: createCartDraft({ shippingInfo: null }),
      });
      wrapper = shallow(<OrderCreateConfirmation {...props} />);
    });

    it('should render message for no shipping method selected', () => {
      expect(wrapper).toRender({
        id: 'Orders.Duplicate.Step.Confirmation.noShippingMethod',
      });
    });
  });

  describe('when missing shipping address', () => {
    beforeEach(() => {
      props = createTestProps({
        cartDraft: createCartDraft({ shippingAddress: null }),
      });
      wrapper = shallow(<OrderCreateConfirmation {...props} />);
    });

    it('should render message for no shipping address selected', () => {
      expect(wrapper).toRender({
        id: 'Orders.Duplicate.Step.Confirmation.noShippingAddress',
      });
    });
  });

  describe('when missing billing address', () => {
    beforeEach(() => {
      props = createTestProps({
        cartDraft: createCartDraft({ billingAddress: null }),
      });
      wrapper = shallow(<OrderCreateConfirmation {...props} />);
    });

    it('should render message for no billing address selected', () => {
      expect(wrapper).toRender({
        id: 'Orders.Duplicate.Step.Confirmation.noBillingAddress',
      });
    });
  });

  describe('when missing no items', () => {
    beforeEach(() => {
      props = createTestProps({ allLineItems: [] });
      wrapper = shallow(<OrderCreateConfirmation {...props} />);
    });

    it('should render message for no billing address selected', () => {
      expect(wrapper).toRender({
        id: 'Orders.Duplicate.Step.Confirmation.noItems',
      });
    });
  });
});
