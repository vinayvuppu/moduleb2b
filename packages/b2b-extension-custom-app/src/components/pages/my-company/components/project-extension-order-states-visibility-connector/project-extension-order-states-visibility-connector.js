import React from 'react';
import PropTypes from 'prop-types';
import { wrapDisplayName } from 'recompose';
import { Query } from 'react-apollo';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchProjectExtensionOrderStatesVisibility from './fetch-project-extension-order-states-visibility.graphql';

const ProjectExtensionOrderStatesVisibilityConnector = props => (
  <Query
    query={FetchProjectExtensionOrderStatesVisibility}
    variables={{ target: GRAPHQL_TARGETS.SETTINGS_SERVICE }}
  >
    {({ loading, data }) =>
      props.children({
        isLoading: loading,
        orderStatesVisibility:
          // In case the project has no extensions we return
          // an empty array to the column definitions
          (data &&
            data.projectExtension &&
            data.projectExtension.orderStatesVisibility) ||
          [],
      })
    }
  </Query>
);
ProjectExtensionOrderStatesVisibilityConnector.displayName =
  'ProjectExtensionOrderStatesVisibilityConnector';
ProjectExtensionOrderStatesVisibilityConnector.propTypes = {
  children: PropTypes.func.isRequired,
};

const withProjectExtensionOrderStatesVisibility = (
  propKey = 'orderStatesVisibilityData'
) => Component => {
  const WrappedComponent = props => (
    <ProjectExtensionOrderStatesVisibilityConnector>
      {orderStatesVisibilityData => (
        <Component {...props} {...{ [propKey]: orderStatesVisibilityData }} />
      )}
    </ProjectExtensionOrderStatesVisibilityConnector>
  );
  WrappedComponent.displayName = wrapDisplayName(
    Component,
    'withProjectExtensionOrderStatesVisibility'
  );
  return WrappedComponent;
};

// Exports
export default ProjectExtensionOrderStatesVisibilityConnector;
export { withProjectExtensionOrderStatesVisibility };
