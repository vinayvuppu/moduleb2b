import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import messages from './messages';
import styles from './total-results.mod.css';

export const TotalResults = props => {
  const intl = useIntl();
  return (
    <span className={styles.container}>
      <FormattedMessage
        {...messages.title}
        values={{ total: intl.formatNumber(props.total) }}
      />
    </span>
  );
};

TotalResults.displayName = 'TotalResults';
TotalResults.propTypes = {
  total: PropTypes.number.isRequired,
};
TotalResults.defaultProps = {
  total: 0,
};

export default TotalResults;
