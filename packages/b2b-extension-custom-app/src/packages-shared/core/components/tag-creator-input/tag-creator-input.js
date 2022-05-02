import React from 'react';
import PropTypes from 'prop-types';
import { CreatableSelectInput } from '@commercetools-frontend/ui-kit';

const TagCreatorInput = props => (
  <CreatableSelectInput
    value={props.value}
    onChange={event => {
      props.onChange(event.target.value);
    }}
    placeholder={props.placeholder}
    isDisabled={props.disabled}
    // Following props are used to "disable" normal dropdown functionalities
    isClearable={false}
    isMulti={true}
    options={[]}
    noOptionsMessage={() => ''}
  />
);
TagCreatorInput.displayName = 'TagCreatorInput';
TagCreatorInput.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};
TagCreatorInput.defaultProps = {
  disabled: false,
};

export default TagCreatorInput;
