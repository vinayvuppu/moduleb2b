import React from 'react';
import { shallow } from 'enzyme';
import CompanyPredicateRules from './company-predicate-rules';
import PredicateModalForm from '../predicate-modal-form';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

const createTestProps = props => ({
  formik: {
    setFieldValue: jest.fn(),
    values: {
      rules: [
        {
          name: 'name1',
          value: 'rule1',
        },
      ],
    },
  },
  isAuthorized: true,
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyPredicateRules {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('interacting', () => {
  let props;
  let wrapper;

  describe('when press open modal form button', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CompanyPredicateRules {...props} />);
      wrapper.find('SecondaryButton').simulate('click');
    });

    it('should render the "PredicateModalForm', () => {
      expect(wrapper).toRender(PredicateModalForm);
    });
  });
});
