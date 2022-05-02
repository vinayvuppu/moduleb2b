import React from 'react';
import { shallow } from 'enzyme';
import Shadow from './shadow';

const createTestProps = custom => ({
  children: <span>{'foo'}</span>,
  depth: '1',
  className: 'foo-style',
  ...custom,
});

describe('rendering', () => {
  it('outputs correct tree', () => {
    const props = createTestProps();
    const wrapper = shallow(<Shadow {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
