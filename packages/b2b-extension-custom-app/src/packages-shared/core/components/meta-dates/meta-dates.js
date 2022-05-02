import PropTypes from 'prop-types';
import React from 'react';
import { branch, renderNothing } from 'recompose';
import { FormattedMessage } from 'react-intl';
import { Text } from '@commercetools-frontend/ui-kit';
import FormattedDateTime from '../formatted-date-time';
import styles from './meta-dates.mod.css';
import messages from './messages';

export const MetaDates = props => (
  <div className={styles.container}>
    <Text.Detail tone="secondary">
      <FormattedMessage
        {...messages.dateCreated}
        values={{
          datetime: <FormattedDateTime type="datetime" value={props.created} />,
        }}
      />
    </Text.Detail>
    <Text.Detail tone="secondary">
      <FormattedMessage
        {...messages.dateModified}
        values={{
          datetime: (
            <FormattedDateTime type="datetime" value={props.modified} />
          ),
        }}
      />
    </Text.Detail>
  </div>
);
MetaDates.displayName = 'MetaDates';
MetaDates.propTypes = {
  created: PropTypes.string,
  modified: PropTypes.string,
};

export default branch(
  props => !props.created || !props.modified,
  renderNothing
)(MetaDates);
