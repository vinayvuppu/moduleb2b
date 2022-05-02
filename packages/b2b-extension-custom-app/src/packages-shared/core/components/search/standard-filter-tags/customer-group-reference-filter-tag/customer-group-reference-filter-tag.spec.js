import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../../../test-utils';
import CustomerGroupReferenceFilterTag from './customer-group-reference-filter-tag';

describe('export', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<CustomerGroupReferenceFilterTag />, {
      context: { intl: intlMock },
    });
  });
  it('should export composed component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
