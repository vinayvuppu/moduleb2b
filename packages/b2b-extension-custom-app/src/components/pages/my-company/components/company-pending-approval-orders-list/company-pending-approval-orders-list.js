import React from 'react';
import PropTypes from 'prop-types';

import { useStateFetcher } from '@commercetools-local/hooks';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import CompanyOrdersList from '../company-orders-list';
import { ORDER_STATES } from '../order-create/constants';
import OrderCreateConnector from '../order-create-connector';

export const CompanyPendingApprovarOrdersList = props => {
  const stateFetcher = useStateFetcher({
    stateKey: ORDER_STATES.PENDING_APPROVAL,
  });

  if (stateFetcher.isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <OrderCreateConnector.Consumer>
      {({ orderUpdater }) => {
        return (
          <CompanyOrdersList
            location={props.location}
            restrictToState={stateFetcher.state}
            projectKey={props.projectKey}
            orderUpdater={orderUpdater}
          />
        );
      }}
    </OrderCreateConnector.Consumer>
  );
};
CompanyPendingApprovarOrdersList.displayName =
  'CompanyPendingApprovarOrdersList';
CompanyPendingApprovarOrdersList.propTypes = {
  projectKey: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
};

export default CompanyPendingApprovarOrdersList;
