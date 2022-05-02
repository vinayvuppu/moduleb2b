import React from 'react';
import PropTypes from 'prop-types';
import requiredIf from 'react-required-if';

const isEmptyChildren = children => React.Children.count(children) === 0;

class Match extends React.PureComponent {
  static displayName = 'ValidationErrorMatch';
  static propTypes = {
    rule: PropTypes.string.isRequired,

    // Options for rendering
    children: requiredIf(PropTypes.node, props => !props.component),
    component: requiredIf(PropTypes.func, props => !props.children),

    // From parent through compound pattern
    isTouched: PropTypes.bool,
    hasError: PropTypes.bool,
  };

  render() {
    if (this.props.isTouched && this.props.hasError) {
      if (this.props.component)
        return React.createElement(this.props.component);

      if (this.props.children && !isEmptyChildren(this.props.children))
        return React.Children.only(this.props.children);
    }

    return null;
  }
}

export default Match;
