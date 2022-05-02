import React from 'react';
import { shallow } from 'enzyme';
import { CompanyPendingApprovarOrdersList } from './company-pending-approval-orders-list';

jest.mock('@commercetools-local/hooks', () => {
  return {
    useStateFetcher: () => ({
      isLoading: false,
      state: {
        id: 'state-id-1',
      },
    }),
  };
});

const createTestProps = props => ({
  projectKey: 'test',
  location: {},
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyPendingApprovarOrdersList {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
