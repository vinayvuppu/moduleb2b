import React from 'react';
import { shallow } from 'enzyme';
import { FormattedDateTime } from './formatted-date-time';

const createTestProps = props => ({
  value: '2018-02-21T14:57:07.113Z',
  type: 'date',
  intl: { locale: 'es' },

  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  describe('when the type is `date`', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<FormattedDateTime {...props} />);
    });

    it('should output correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the type is `time`', () => {
    beforeEach(() => {
      props = createTestProps({ type: 'time' });
      wrapper = shallow(<FormattedDateTime {...props} />);
    });

    it('should output correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the type is `datetime`', () => {
    beforeEach(() => {
      props = createTestProps({ type: 'datetime' });
      wrapper = shallow(<FormattedDateTime {...props} />);
    });

    it('should output correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
