import PropTypes from 'prop-types';
import React from 'react';
import shouldUpdateAttributeInput from '../../../../utils/should-update-attribute-input';
import BooleanField from '../../fields/boolean-field';

export default class extends React.Component {
  static displayName = 'AttributeInputBoolean';

  static propTypes = {
    definition: PropTypes.shape({
      type: PropTypes.shape({
        name: PropTypes.oneOf(['boolean', 'set']),
      }).isRequired,
      isRequired: PropTypes.bool,
    }).isRequired,
    attribute: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    }),
    onChangeValue: PropTypes.func.isRequired,
    // Define profile if this is a filter field OR a form field
    // The profile will determine the styles it should have.
    profile: PropTypes.oneOf(['form', 'filter']),
    disabled: PropTypes.bool,
  };

  static defaultProps = { profile: 'form', disabled: false };

  shouldComponentUpdate(nextProps, nextState) {
    return shouldUpdateAttributeInput({
      currentProps: this.props,
      currentState: this.state,
      nextProps,
      nextState,
    });
  }

  handleChange = value => {
    const newValue = value !== null ? value : undefined;
    this.props.onChangeValue({
      name: this.props.attribute.name,
      value: newValue,
    });
  };

  render() {
    const isMulti = this.props.definition.type.name === 'set';

    return (
      <BooleanField
        isMulti={isMulti}
        isRequired={this.props.definition.isRequired}
        name={this.props.attribute.name}
        value={this.props.attribute.value}
        onChange={this.handleChange}
        disabled={this.props.disabled}
      />
    );
  }
}
