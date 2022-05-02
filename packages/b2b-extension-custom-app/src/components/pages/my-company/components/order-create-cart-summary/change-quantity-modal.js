import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Spacings } from '@commercetools-frontend/ui-kit';

import { FormDialog } from '@commercetools-frontend/application-components';
import QuantitySelector from '../quantity-selector';
import messages from './messages';

const propTypes = {
  quantity: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  productName: PropTypes.string,
  handleOnClose: PropTypes.func.isRequired,
  handleOnSave: PropTypes.func.isRequired,
};

const ChangeQuantityModal = props => {
  const intl = useIntl();

  const [quantity, setQuantity] = useState(props.quantity.toString());
  return (
    <FormDialog
      title={intl.formatMessage(messages.changeQuantityTitle, {
        name: props.productName,
      })}
      isOpen={props.isOpen}
      onClose={props.handleOnClose}
      onSecondaryButtonClick={props.handleOnClose}
      onPrimaryButtonClick={() => props.handleOnSave(quantity)}
      isPrimaryButtonDisabled={false}
    >
      <Spacings.Inline scale="s">
        <QuantitySelector
          onChange={setQuantity}
          quantity={quantity}
          maxValue={10}
          menuPortalTarget={document.body}
          menuPortalZIndex={1000}
        />
      </Spacings.Inline>
    </FormDialog>
  );
};

ChangeQuantityModal.displayName = 'ChangeQuantityModal';
ChangeQuantityModal.propTypes = propTypes;

export default ChangeQuantityModal;
