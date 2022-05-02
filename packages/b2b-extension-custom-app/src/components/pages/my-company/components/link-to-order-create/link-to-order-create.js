import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { PlusBoldIcon, SecondaryButton } from '@commercetools-frontend/ui-kit';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { PERMISSIONS, DATA_FENCES } from '../../../../../constants';
import messages from './messages';

export const LinkToOrderCreate = props => {
  const intl = useIntl();
  const canManageOrders = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageOrders],
    demandedDataFences: [DATA_FENCES.store.ManageOrders],
    selectDataFenceData: ({ actualDataFences }) => actualDataFences || [],
  });

  return (
    <SecondaryButton
      linkTo={`/${props.projectKey}/b2b-extension/my-company/orders/new`}
      isDisabled={!canManageOrders}
      iconLeft={<PlusBoldIcon />}
      data-track-component=""
      data-track-label="Add Order"
      data-track-event="click"
      label={intl.formatMessage(messages.addOrder)}
    />
  );
};
LinkToOrderCreate.displayName = 'LinkToOrderCreate';
LinkToOrderCreate.propTypes = {
  projectKey: PropTypes.string.isRequired,
};

export default LinkToOrderCreate;
