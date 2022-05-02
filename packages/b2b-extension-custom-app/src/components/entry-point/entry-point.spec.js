import React from 'react';
import { shallow } from 'enzyme';
import { ApplicationStarter } from './entry-point';

describe('rendering', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ApplicationStarter />);
  });
  it('should render b2b-extension route', () => {
    expect(wrapper).toRender({ path: '/:projectKey/b2b-extension' });
  });
});
