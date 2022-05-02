import React from 'react';
import { FormattedMessage } from 'react-intl';
import { WarningIcon, Spacings } from '@commercetools-frontend/ui-kit';
import styles from './read-only-message.mod.css';
import messages from './messages';

const ReadOnlyMessage = () => (
  <Spacings.Inline alignItems="flex-end" scale="xs">
    <WarningIcon color="warning" />
    <span className={styles['read-only-text']}>
      <FormattedMessage {...messages.readOnly} />
    </span>
  </Spacings.Inline>
);
ReadOnlyMessage.displayName = 'ReadOnlyMessage';

export default ReadOnlyMessage;
