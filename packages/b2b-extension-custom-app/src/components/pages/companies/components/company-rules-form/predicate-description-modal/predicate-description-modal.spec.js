import React from 'react';
import { shallow } from 'enzyme';
import PredicateDescriptionModal from './predicate-description-modal';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = { isOpen: true, handleOpenDialog: jest.fn() };
    wrapper = shallow(<PredicateDescriptionModal {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
