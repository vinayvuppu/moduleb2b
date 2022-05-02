import React from 'react';
import {
  renderApp,
  fireEvent,
} from '@commercetools-frontend/application-shell/test-utils';
import useTracking from '../../hooks/use-tracking';
import CartAddDiscountCode from './cart-add-discount-code';

jest.mock('../../hooks/use-tracking');

const createTestProps = custom => ({
  isDisabled: false,
  onApplyDiscountCode: jest.fn(),
  ...custom,
});

const renderComponent = ({ props } = { props: {} }) => {
  return renderApp(<CartAddDiscountCode {...props} />);
};

describe('when rendering', () => {
  let props;
  let rendered;

  it('should display the discount code text field', () => {
    props = createTestProps();
    rendered = renderComponent({ props });

    expect(rendered.queryByLabelText('Add Discount Code')).toBeInTheDocument();
  });

  it('should display the apply button', () => {
    props = createTestProps();
    rendered = renderComponent({ props });

    expect(rendered.queryByLabelText('Apply')).toBeInTheDocument();
  });

  describe('when the input field is empty', () => {
    it('should the apply button should be disabled', () => {
      props = createTestProps();
      rendered = renderComponent({ props });

      expect(rendered.queryByLabelText('Apply')).toBeDisabled();
    });
  });

  describe('when entering and applying a discount code', () => {
    it('should call onApplyDiscountCode with the entered code', () => {
      props = createTestProps();
      rendered = renderComponent({ props });
      const { trackApplyDiscountCode } = useTracking();

      fireEvent.change(rendered.queryByLabelText('Add Discount Code'), {
        target: { value: 'generic-cart-discount' },
      });

      fireEvent.click(rendered.queryByLabelText('Apply'));

      expect(props.onApplyDiscountCode).toBeCalledWith('generic-cart-discount');

      expect(trackApplyDiscountCode).toHaveBeenCalled();
    });
  });

  describe('when the component is disabled', () => {
    it('should disable the input and apply button', () => {
      props = createTestProps({ isDisabled: true });
      rendered = renderComponent({ props });

      expect(rendered.queryByLabelText('Add Discount Code')).toBeDisabled();
      expect(rendered.queryByLabelText('Apply')).toBeDisabled();
    });
  });
});
