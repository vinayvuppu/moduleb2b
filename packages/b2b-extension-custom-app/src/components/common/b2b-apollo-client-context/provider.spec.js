import React from 'react';
import { shallow } from 'enzyme';
import B2BApolloClientContextProvider from './provider';

const createTestProps = customProps => ({
  children: jest.fn(),
  ...customProps,
});
const createContextRenderProps = customProps => ({
  a: 'test-prop',
  ...customProps,
});

jest.mock('@commercetools-frontend/application-shell-connectors', () => ({
  useApplicationContext: () => ({ environment: { graphqlApiUrl: 'url' } }),
}));

describe('rendering', () => {
  let props;
  let contextRenderProps;

  beforeEach(() => {
    props = createTestProps();
    contextRenderProps = createContextRenderProps();
    shallow(<B2BApolloClientContextProvider {...props} />).renderProp(
      'children'
    )(contextRenderProps);
  });

  it('should invoke `children` with the context render props', () => {
    expect(props.children).toHaveBeenCalledWith(contextRenderProps);
  });
});
