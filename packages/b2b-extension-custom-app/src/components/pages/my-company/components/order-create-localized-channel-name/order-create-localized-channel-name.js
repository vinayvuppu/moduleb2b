import React from 'react';
import { PropTypes } from 'prop-types';
import { Text } from '@commercetools-frontend/ui-kit';
import { useLocalize } from '@commercetools-local/hooks';

const propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    nameAllLocales: PropTypes.arrayOf(
      PropTypes.shape({
        locale: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

const OrderCreateLocalizedChannelName = props => {
  const localize = useLocalize();

  return (
    <Text.Detail tone="secondary">
      {localize(props.channel.nameAllLocales, props.channel.key)}
    </Text.Detail>
  );
};
OrderCreateLocalizedChannelName.propTypes = propTypes;
OrderCreateLocalizedChannelName.displayName = 'OrderCreateLocalizedChannelName';

export default OrderCreateLocalizedChannelName;
