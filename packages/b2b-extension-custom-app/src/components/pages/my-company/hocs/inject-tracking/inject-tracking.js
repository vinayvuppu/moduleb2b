import React from 'react';
import { wrapDisplayName } from 'recompose';
import useTracking from '../../hooks/use-tracking';

export const injectTracking = (propName = 'tracking') => WrappedComponent => {
  const WithTracking = props => {
    const tracking = useTracking();

    const trackingProp = {
      [propName]: tracking,
    };

    return <WrappedComponent {...props} {...trackingProp} />;
  };

  WithTracking.displayName = wrapDisplayName(WrappedComponent, 'withTracking');

  return WithTracking;
};

export default injectTracking;
