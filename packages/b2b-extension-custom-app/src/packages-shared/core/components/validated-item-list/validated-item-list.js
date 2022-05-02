import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash.omit';
import { Tooltip } from '@commercetools-frontend/ui-kit';
import ItemList from '../item-list';

// This component is used to "reset" the default wrapper styles of
// the Tooltip in order to render the underlying input with full width.
// eslint-disable-next-line react/display-name
const WrapperComponent = React.forwardRef((props, ref) => (
  <div {...props} ref={ref} />
));

const ValidatedItemList = props => (
  <div>
    <Tooltip
      components={{ WrapperComponent }}
      isOpen={!props.validation.isValid}
      title={props.validation.message || ''}
      // TODO: use a custom body wrapper to show a warning-like message
    >
      <ItemList
        {...omit(props, 'validation')}
        shouldRenderButtons={!props.disabled}
      />
    </Tooltip>
  </div>
);
ValidatedItemList.displayName = 'ValidatedItemList';
ValidatedItemList.propTypes = {
  itemCount: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,
  getKey: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  validation: PropTypes.shape({
    isValid: PropTypes.bool,
    message: PropTypes.string,
  }),
  disabled: PropTypes.bool,
};

ValidatedItemList.defaultProps = {
  validation: {
    isValid: true,
    message: null,
  },
  disabled: false,
};

export default ValidatedItemList;
