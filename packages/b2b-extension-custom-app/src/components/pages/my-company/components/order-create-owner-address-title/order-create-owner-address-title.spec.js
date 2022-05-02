import React from 'react';
import { shallow } from 'enzyme';
import {
  PaperBillInvertedIcon,
  RadioInput,
  TruckIcon,
} from '@commercetools-frontend/ui-kit';
import OrderCreateOwnerAddressTitle from './order-create-owner-address-title';

const createTestProps = props => ({
  cartDraft: {
    customerId: 'c1',
    shippingAddress: { id: 'address-1' },
    billingAddress: { id: 'address-1' },
    customerEmail: 'c1@test.com',
  },
  type: 'shipping',
  address: {
    id: 'address-1',
  },
  employee: {
    id: 'c1',
    addresses: [],
    defaultAddressId: 'address-1',
    defaultShippingAddressId: 'address-1',
    defaultBillingAddressId: 'address-2',
    email: 'c1@test.com',
  },
  onSelectAddress: jest.fn(),
  ...props,
});

describe('rendering', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = createTestProps({
      employee: {
        addresses: [{ id: 'address-1' }, { id: 'address-2' }],
        defaultShippingAddressId: 'address-1',
        defaultBillingAddressId: 'address-1',
      },
    });
    wrapper = shallow(<OrderCreateOwnerAddressTitle {...props} />);
  });
  describe('RadioInputOption', () => {
    it('should render a RadioInputOption', () => {
      expect(wrapper).toRender(RadioInput.Option);
    });
    describe('if the address is the selected one', () => {
      it('should be checked', () => {
        expect(wrapper.find(RadioInput.Option)).toHaveProp('isChecked', true);
      });
    });
    describe('if the address is not the selected one', () => {
      beforeEach(() => {
        props = createTestProps({
          cartDraft: {
            shippingAddress: { id: 'address-2' },
          },
        });
        wrapper = shallow(<OrderCreateOwnerAddressTitle {...props} />);
      });
      it('should be unchecked', () => {
        expect(wrapper.find(RadioInput.Option)).toHaveProp('isChecked', false);
      });
    });
  });

  describe('PaperBillInvertedIcon', () => {
    describe('when is the default billing address', () => {
      beforeEach(() => {
        props = createTestProps({
          employee: {
            defaultBillingAddressId: 'address-1',
          },
        });
        wrapper = shallow(<OrderCreateOwnerAddressTitle {...props} />);
      });
      it('should render PaperBillInvertedIcon', () => {
        expect(wrapper).toRender(PaperBillInvertedIcon);
      });
    });
    describe('when is not the default billing address', () => {
      beforeEach(() => {
        props = createTestProps({
          employee: {
            defaultBillingAddressId: 'address-2',
          },
        });
        wrapper = shallow(<OrderCreateOwnerAddressTitle {...props} />);
      });
      it('should not render PaperBillInvertedIcon', () => {
        expect(wrapper).not.toRender(PaperBillInvertedIcon);
      });
    });
  });

  describe('TruckIcon', () => {
    describe('when is the default shipping address', () => {
      beforeEach(() => {
        props = createTestProps({
          employee: {
            defaultShippingAddressId: 'address-1',
          },
        });
        wrapper = shallow(<OrderCreateOwnerAddressTitle {...props} />);
      });
      it('should render TruckIcon', () => {
        expect(wrapper).toRender(TruckIcon);
      });
    });
    describe('when is not the default billing address', () => {
      beforeEach(() => {
        props = createTestProps({
          employee: {
            defaultShippingAddressId: 'address-2',
          },
        });
        wrapper = shallow(<OrderCreateOwnerAddressTitle {...props} />);
      });
      it('should not render TruckIcon', () => {
        expect(wrapper).not.toRender(TruckIcon);
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  describe('when user selects address', () => {
    beforeEach(() => {
      props = createTestProps({
        employee: {
          defaultShippingAddressId: 'address-1',
        },
      });
      wrapper = shallow(<OrderCreateOwnerAddressTitle {...props} />);
      wrapper.find(RadioInput.Option).prop('onChange')();
    });
    it('should call onSelectAddress', () => {
      expect(props.onSelectAddress).toHaveBeenCalledTimes(1);
    });
    it('should call onSelectAddress with paramters', () => {
      expect(props.onSelectAddress).toHaveBeenCalledWith(
        'shipping',
        'address-1'
      );
    });
  });
});
