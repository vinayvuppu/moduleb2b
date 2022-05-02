import React from 'react';
import { wrapDisplayName } from 'recompose';
import { GtmContext } from '@commercetools-frontend/application-shell';

export default function injectTracking(Component) {
  const WrappedComponent = props => (
    <GtmContext.Consumer>
      {({ track, getHierarchy }) => (
        <Component {...props} track={track} getHierarchy={getHierarchy} />
      )}
    </GtmContext.Consumer>
  );
  WrappedComponent.displayName = wrapDisplayName(Component, 'injectTracking');
  return WrappedComponent;
}
