import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import LabelRange, { messages } from './label-range';

const createTestProps = props => ({
  ...props,
});

const labelTypes = ['from', 'to'];
labelTypes.forEach(type => {
  describe(`rendering for label type ${type}`, () => {
    const props = createTestProps({ type });
    const wrapper = shallow(<LabelRange {...props} />);
    it(`has only one child for type ${type}`, () => {
      expect(wrapper.children()).toHaveLength(1);
    });

    it(`has only one label field for type ${type}`, () => {
      expect(wrapper.type()).toBe('label');
    });

    it(`has a formatted message for the ${type}`, () => {
      const formattedMessage = wrapper.childAt(0);
      expect(formattedMessage.type()).toBe(FormattedMessage);
      expect(formattedMessage.props().id).toBe(messages[type].id);
    });
  });
});
