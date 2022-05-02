import React from 'react';
import PropTypes from 'prop-types';
import NestedAttributesContext from './nested-attributes-context';

export class NestedAttributesContainerConsumer extends React.Component {
  static displayName = 'NestedAttributesContainerConsumer';
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  render() {
    return (
      <NestedAttributesContext.Consumer>
        {contextProps => this.props.children(contextProps)}
      </NestedAttributesContext.Consumer>
    );
  }
}

export default NestedAttributesContainerConsumer;
