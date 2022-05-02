import { actions as sdkActions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';

// eslint-disable-next-line
export const fetchProducts = options =>
  sdkActions.get({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    service: 'productProjectionsSearch',
    options: { ...options, expand: ['productType'] },
  });
