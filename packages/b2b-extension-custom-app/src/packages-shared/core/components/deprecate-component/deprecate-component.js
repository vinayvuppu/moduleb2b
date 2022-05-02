import React from 'react';
import { getDisplayName } from 'recompose';
import warning from 'warning';

export default function({ message = '' }) {
  return Component =>
    class DeprecateComponent extends React.PureComponent {
      static displayName = `Deprecated(${getDisplayName(Component)})`;
      componentDidMount() {
        const shouldSkipWarning = ['test', 'production'].includes(
          process.env.NODE_ENV
        );
        warning(
          // `warning` logs the message when `NODE_ENV` is not 'production' or 'test'
          shouldSkipWarning,
          `\`${getDisplayName(Component)}\` is no longer supported. ${message}`
        );
      }
      render() {
        return <Component {...this.props} />;
      }
    };
}
