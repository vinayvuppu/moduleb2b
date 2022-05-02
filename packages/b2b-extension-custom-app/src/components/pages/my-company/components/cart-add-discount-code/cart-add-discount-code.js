import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  Spacings,
  TextField,
  PlusBoldIcon,
  SecondaryButton,
} from '@commercetools-frontend/ui-kit';
import useTracking from '../../hooks/use-tracking';
import messages from './messages';

const CartAddDiscountCode = props => {
  const intl = useIntl();
  const tracking = useTracking();
  const [codeValue, setCodeValue] = React.useState('');

  const handleInputChange = event => {
    setCodeValue(event.target.value);
  };

  const handleApplyDiscountCode = () => {
    props.onApplyDiscountCode(codeValue);
    setCodeValue('');
  };

  return (
    <Spacings.Inline alignItems="flex-end">
      <TextField
        name="add-discount-code"
        title={intl.formatMessage(messages.addDiscountCodeLabel)}
        value={codeValue}
        onChange={handleInputChange}
        isDisabled={props.isDisabled}
        data-track-event="change"
        data-track-component="AddDiscountCode"
        horizontalConstraint="m"
      />
      <SecondaryButton
        type="submit"
        label={intl.formatMessage(messages.applyLabel)}
        onClick={tracking.forwardHandler(
          tracking.trackApplyDiscountCode,
          handleApplyDiscountCode
        )}
        iconLeft={<PlusBoldIcon />}
        isDisabled={codeValue === '' || props.isDisabled}
      />
    </Spacings.Inline>
  );
};
CartAddDiscountCode.displayName = 'CartAddDiscountCode';
CartAddDiscountCode.propTypes = {
  isDisabled: PropTypes.bool,
  onApplyDiscountCode: PropTypes.func.isRequired,
};
export default CartAddDiscountCode;
