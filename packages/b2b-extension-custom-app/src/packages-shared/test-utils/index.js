import crypto from 'crypto';
import { withProps, compose, branch, renderComponent } from 'recompose';

export { createGraphqlMock, createRosie } from './graphql-mock';

export const intlMock = {
  formatMessage: jest.fn(message => message.id),
  formatDate: jest.fn(date => {
    const dateObj = new Date(date);
    const day = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1;
    const year = dateObj.getUTCFullYear();
    return `${day}.${month}.${year}`;
  }),
  formatTime: jest.fn(date => {
    const dateObj = new Date(date);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    return `${hours}:${minutes}`;
  }),
  formatRelative: jest.fn(() => 'xxx'),
  formatNumber: jest.fn((number, currency) =>
    currency?.currency
      ? `${currency.currency} ${number.toString()}`
      : number.toString()
  ),
  formatPlural: jest.fn(() => 'xxx'),
  formatHTMLMessage: jest.fn(() => 'xxx'),
  now: jest.fn(() => 'xxx'),
  locale: 'en',
};

export const routerMock = {
  go: jest.fn(() => {}),
  goBack: jest.fn(() => {}),
  goForward: jest.fn(() => {}),
  push: jest.fn(() => {}),
  replace: jest.fn(() => {}),
  isActive: jest.fn(() => {}),
  createHref: jest.fn(() => {}),
  setRouteLeaveHook: jest.fn(() => {}),
};

export function createMountOptions(options = {}) {
  const { intl, router } = options;
  return {
    context: {
      intl: { ...intlMock, ...intl },
      router: { ...routerMock, ...router },
      store: {
        getState: () => ({
          application: {
            products: {
              currentVisible: {
                productType: {
                  obj: {
                    name: 'foo',
                  },
                },
              },
            },
          },
        }),
        subscribe() {},
        dispatch() {},
      },
    },
  };
}

export function promisedTimeout(cb, timeout = 0) {
  const p = new Promise(resolve => {
    setTimeout(() => {
      resolve(cb());
    }, timeout);
  });
  return p;
}

export const randomId = () => crypto.randomBytes(16).toString('hex');

export const mockPermissions = ({ isAuthorized = true } = {}) => {
  const injectAuthorized = (
    demandedPermissions,
    options,
    propName = 'isAuthorized'
  ) => withProps({ [propName]: isAuthorized });

  const branchOnPermissions = (
    demandedPermissions,
    FallbackComponent,
    options
  ) =>
    compose(
      injectAuthorized(demandedPermissions, options),
      branch(() => !isAuthorized, renderComponent(FallbackComponent))
    );
  return {
    injectAuthorized,
    branchOnPermissions,
    permissions: {},
  };
};

export const mockBranchOnFeatureToggle = ({
  isFeatureToggledOn = true,
} = {}) => (flags, FallbackComponent) =>
  branch(() => !isFeatureToggledOn, renderComponent(FallbackComponent));

export const mockComponent = displayName => {
  const MockedComponent = ({ children }) => children || null;
  MockedComponent.displayName = displayName;
  return MockedComponent;
};

export const mockConnector = (displayName, childrenProps = {}) => {
  const MockedConnector = jest.fn(({ children }) => children(childrenProps));
  MockedConnector.displayName = displayName;
  return MockedConnector;
};

export const mockContext = displayName => {
  let providedValue;

  const ProviderComponent = ({ value, children }) => {
    providedValue = value;
    return children;
  };
  ProviderComponent.displayName = `${displayName}.Provider`;
  const ConsumerComponent = ({ children }) => children(providedValue);
  ConsumerComponent.displayName = `${displayName}.Consumer`;

  return {
    Provider: ProviderComponent,
    Consumer: ConsumerComponent,
  };
};

export const mockReactIntl = () => ({
  ...require.requireActual('react-intl'),
  FormattedMessage: ({ id }) => `formatted-${id}`,
  injectIntl: withProps({ intl: intlMock }),
});

export const waitForPromises = () =>
  new Promise(resolve => setImmediate(resolve));
