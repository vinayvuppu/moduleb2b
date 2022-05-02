import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { formatDateTime } from '../../../utils/formats';

export class FormattedDateTime extends React.PureComponent {
  static displayName = 'FormattedDateTime';

  static propTypes = {
    type: PropTypes.oneOf(['time', 'datetime', 'date']),
    value: PropTypes.string.isRequired,

    // Intl
    intl: PropTypes.shape({
      locale: PropTypes.string.isRequired,
    }),
  };

  render() {
    return (
      <ApplicationContext
        render={({ user }) =>
          formatDateTime(this.props.type, this.props.value, {
            timeZone: user?.timeZone,
            locale: this.props.intl.locale,
          })
        }
      />
    );
  }
}

export default injectIntl(FormattedDateTime);
