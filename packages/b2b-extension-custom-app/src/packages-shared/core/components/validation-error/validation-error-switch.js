import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'tiny-invariant';
import Match from './validation-error-match';

const hasUnknownChildren = children =>
  React.Children.toArray(children).some(
    child => child.type.displayName !== Match.displayName
  );
const hasError = (errors, rule) => Boolean(errors[rule]);

class Switch extends React.PureComponent {
  static displayName = 'ValidationErrorSwitch';
  static propTypes = {
    errors: PropTypes.objectOf(PropTypes.bool),
    isTouched: PropTypes.bool,
    children: PropTypes.node.isRequired,
  };
  static defaultProps = {
    errors: {},
    isTouched: false,
  };

  componentDidMount() {
    /**
     * NOTE:
     *    The `<ValidationError.Switch>` only works with `<ValidationError.Match>` as its children.
     */
    invariant(
      !hasUnknownChildren(this.props.children),
      '@commercetools-local/core/validation-error/validation-error-switch: children can only be of type <ValidationError.Match>'
    );
  }

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        isTouched: this.props.isTouched,
        hasError: hasError(this.props.errors, child.props.rule),
      })
    );
  }
}

export default Switch;
