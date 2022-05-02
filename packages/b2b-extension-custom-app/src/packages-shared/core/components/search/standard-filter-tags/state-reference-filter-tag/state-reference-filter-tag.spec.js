import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../../../test-utils';
import createStateFilterTag from './state-reference-filter-tag';

describe('export', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<div>{createStateFilterTag('OrderState')}</div>, {
      context: { intl: intlMock },
    });
  });
  it('should export composed component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
