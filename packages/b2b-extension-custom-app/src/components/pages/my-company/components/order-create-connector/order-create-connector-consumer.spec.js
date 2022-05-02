import React from 'react';
import { shallow } from 'enzyme';
import { OrderCreateConnectorConsumer } from './order-create-connector-consumer';

const createTestProps = customProps => ({
  children: jest.fn(),
  ...customProps,
});
const createContextRenderProps = customProps => ({
  a: 'test-prop',
  ...customProps,
});

describe('rendering', () => {
  let props;
  let contextRenderProps;

  beforeEach(() => {
    props = createTestProps();
    contextRenderProps = createContextRenderProps();
    shallow(<OrderCreateConnectorConsumer {...props} />).renderProp('children')(
      contextRenderProps
    );
  });

  it('should invoke `children` with the context render props', () => {
    expect(props.children).toHaveBeenCalledWith(contextRenderProps);
  });
});
