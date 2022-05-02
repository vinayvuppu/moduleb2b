import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import classnames from 'classnames';
import {
  AngleDownIcon,
  AngleUpIcon,
  FlatButton,
} from '@commercetools-frontend/ui-kit';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import validatedInput, { VALIDATOR_REQUIRED } from '../../validated-input';
import ThrottledField from '../throttled-field';
import styles from './expandable-field.mod.css';
import messages from './messages';

export const RequiredThrottledField = validatedInput(ThrottledField, [
  VALIDATOR_REQUIRED,
]);

export const ExpandableField = props => {
  const {
    value,
    onToggle,
    isExpanded,
    onChange,
    onBlurValue,
    definition,
    disabled,
  } = props;

  // Filter out only `data-*` props
  const dataProps = filterDataAttributes(props);
  const fieldProps = {
    as: 'textarea',
    value,
    onChange,
    onBlurValue,
    autoSize: isExpanded,
    disabled,
    ...dataProps,
  };
  const isRequired = definition && definition.isRequired;

  return (
    <div
      className={classnames(
        styles['expandable-field'],
        props.expandableFieldModalClassName
      )}
    >
      {isRequired ? (
        <RequiredThrottledField {...fieldProps} />
      ) : (
        <ThrottledField {...fieldProps} />
      )}

      {value ? (
        <FlatButton
          onClick={onToggle}
          icon={isExpanded ? <AngleUpIcon /> : <AngleDownIcon />}
          tone="primary"
          label={props.intl.formatMessage(
            isExpanded ? messages.collapse : messages.expand
          )}
        />
      ) : null}
    </div>
  );
};

ExpandableField.displayName = 'ExpandableField';
ExpandableField.defaultProps = {
  definition: { isRequired: false },
  disabled: false,
};
ExpandableField.propTypes = {
  value: PropTypes.any,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
  definition: PropTypes.shape({
    isRequired: PropTypes.bool,
  }),
  expandableFieldModalClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlurValue: PropTypes.func,
  disabled: PropTypes.bool,
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
};

export default injectIntl(ExpandableField);
