import React from 'react';
import { shallow } from 'enzyme';
import { EmployeesListCustomViewsConnectorConsumer } from './employees-list-custom-views-connector-consumer';

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
    shallow(
      <EmployeesListCustomViewsConnectorConsumer {...props} />
    ).renderProp('children')(contextRenderProps);
  });

  it('should invoke `children` with the context render props', () => {
    expect(props.children).toHaveBeenCalledWith(contextRenderProps);
  });
});
