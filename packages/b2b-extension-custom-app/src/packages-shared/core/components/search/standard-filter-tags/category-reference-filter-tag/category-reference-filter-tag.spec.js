import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../../../test-utils';
import CategoryReferenceFilterTag from './category-reference-filter-tag';

describe('export', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<CategoryReferenceFilterTag />, {
      context: { intl: intlMock },
    });
  });
  it('should export composed component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
