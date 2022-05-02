import React from 'react';
import { mount } from 'enzyme';
import injectTracking from './inject-tracking';

const TestComponent = () => <div>{'Test'}</div>;
TestComponent.displayName = 'TestComponent';
TestComponent.propTypes = {};

describe('HoC', () => {
  let Enhanced;
  let wrapper;

  describe('when injecting tracking', () => {
    beforeEach(() => {
      Enhanced = injectTracking(TestComponent);
      wrapper = mount(<Enhanced />);
    });

    it('should inject `track` as props', () => {
      expect(wrapper.find(TestComponent)).toHaveProp(
        'track',
        expect.any(Function)
      );
    });
    it('should inject `getHierarchy` as props', () => {
      expect(wrapper.find(TestComponent)).toHaveProp(
        'getHierarchy',
        expect.any(Function)
      );
    });
  });
});
