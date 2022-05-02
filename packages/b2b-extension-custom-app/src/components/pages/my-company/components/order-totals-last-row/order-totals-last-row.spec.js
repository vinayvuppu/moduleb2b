import React from 'react';
import { shallow } from 'enzyme';
import OrderTotalsLastRow from './order-totals-last-row';

const createTestProps = () => ({ total: 20 });

describe('rendering', () => {
  const props = createTestProps();
  const wrapper = shallow(<OrderTotalsLastRow {...props} />);

  it('outputs correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
