import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../../../test-utils';
import CompanyReferenceFilterTag from './company-reference-filter-tag';

describe('export', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<CompanyReferenceFilterTag />, {
      context: { intl: intlMock },
    });
  });
  it('should export composed component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
