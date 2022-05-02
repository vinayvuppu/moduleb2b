import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { EmployeeDetails } from './employee-details';

const createTestProps = props => ({
  employeeFetcher: {
    isLoading: false,
    employee: {
      id: 'employee-1',
      firstName: 'John',
      lastName: 'Doe',
    },
  },
  employeeDeleter: {
    isLoading: false,
    execute: jest.fn(() =>
      Promise.resolve({
        id: 'employee-1',
        firstName: 'James',
      })
    ),
  },
  location: {
    pathname: ""
  },
  goToEmployeesList: jest.fn(),
  employeeId: 'employee-1',
  employeeListUrl: 'url',
  projectKey: 'test1',
  showNotification: jest.fn(),
  onActionError: jest.fn(),
  intl: intlMock,
  children: <div />,
  deletionConfirmationModal: {
    isOpen: false,
    handleOpen: jest.fn(),
    handleClose: jest.fn(),
  },
  canViewOrders: true,
  canManageEmployees: true,
  ...props,
});

describe('rendering', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<EmployeeDetails {...props} />);
  });
  it('should output the correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('rendering base elements', () => {
    it('should render a track component', () => {
      expect(wrapper).toRender({ 'data-track-component': 'EmployeesUpdate' });
    });

    describe('when user has order permissions', () => {
      it('should not disable the orders info tab', () => {
        expect(wrapper.find({ name: 'orders' })).toHaveProp(
          'isDisabled',
          false
        );
      });
    });

    describe('when user has no order permissions', () => {
      beforeEach(() => {
        props = createTestProps({
          canViewOrders: false,
        });
        wrapper = shallow(<EmployeeDetails {...props} />);
      });
      it('should disable the orders info tab', () => {
        expect(wrapper.find({ name: 'orders' })).toHaveProp('isDisabled', true);
      });
    });
  });

  describe('rendering component title', () => {
    describe('when there is first name and last name', () => {
      let headerWrapper;
      beforeEach(() => {
        headerWrapper = shallow(wrapper.find('ViewHeader').prop('title'));
      });
      it('should render the employee full name', () => {
        expect(headerWrapper).toHaveText('John Doe');
      });
    });

    describe('when employee number and first and last names are defined', () => {
      let headerWrapper;
      beforeEach(() => {
        const customProps = createTestProps({
          employeeFetcher: {
            isLoading: false,
            employee: {
              id: 'employee-1',
              firstName: 'John',
              lastName: 'Doe',
              customerNumber: '123',
            },
          },
        });
        const customWrapper = shallow(<EmployeeDetails {...customProps} />);
        headerWrapper = shallow(customWrapper.find('ViewHeader').prop('title'));
      });

      it('should render customer number', () => {
        expect(headerWrapper.find('TextDetail')).toHaveProp('children', '123');
      });
    });
  });
});

describe('callbacks', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<EmployeeDetails {...props} />);
  });

  describe.skip('when deleting', () => {
    describe('when resolving', () => {
      beforeEach(() => {
        props = createTestProps({
          deletionConfirmationModal: {
            isOpen: true,
            handleOpen: jest.fn(),
            handleClose: jest.fn(),
          },
        });
        wrapper = shallow(<EmployeeDetails {...props} />);
        wrapper.find(ConfirmationDialog).prop('onConfirm')();
      });

      it('should call `goToEmployeesList`', () => {
        expect(props.goToEmployeesList).toHaveBeenCalled();
      });

      it('should call the show notification function with the proper params', () => {
        expect(props.showNotification).toHaveBeenCalled();
      });
    });
    describe('when rejecting', () => {
      beforeEach(() => {
        props = createTestProps({
          employeeDeleter: {
            isLoading: false,
            execute: jest.fn(() => Promise.reject(new Error('error'))),
          },
          deletionConfirmationModal: {
            isOpen: true,
            handleOpen: jest.fn(),
            handleClose: jest.fn(),
          },
        });
        wrapper = shallow(<EmployeeDetails {...props} />);
        wrapper.find(ConfirmationDialog).prop('onConfirm')();
      });

      it('should call `onActionError`', () => {
        expect(props.onActionError).toHaveBeenCalled();
      });
    });
  });
});
