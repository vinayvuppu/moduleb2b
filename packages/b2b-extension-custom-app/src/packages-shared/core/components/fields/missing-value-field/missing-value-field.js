import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import CheckboxField from '../checkbox-field';
import messages from './messages';

const MissingValueField = props => (
  <div>
    <CheckboxField
      labelClassName={props.labelClassName}
      name="missing-value"
      checked={props.isChecked}
      onChange={props.onChange}
      data-track-component="MissingValue"
      data-track-event="change"
      data-track-label={props.isChecked}
      label={<FormattedMessage {...messages.label} />}
    />
  </div>
);
MissingValueField.displayName = 'MissingValueField';
MissingValueField.defaultProps = { isChecked: false };
MissingValueField.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  labelClassName: PropTypes.string,
};

export default MissingValueField;
