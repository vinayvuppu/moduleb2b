import React from 'react';
import { shallow } from 'enzyme';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import { EmployeeDetailWrapper } from './employee-detail-wrapper';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';
const createB2BApolloClientContextProps = () => ({ apolloClient: {} });

const createTestProps = customProps => ({
  projectKey: 'projectkey1',
  children: jest.fn(() => <ChildComponent />),
  ...customProps,
});
const createEmployee = () => ({
  id: 'employee-id1',
  customerGroup: {
    id: 'customer-group-id-1',
    key: 'company-id-1',
    name: 'Company name',
  },
  firstName: 'employee name',
  lastName: 'employee last name',
  email: 'foo@bar.com',
});

const createCompany = () => ({
  id: 'company-id-1',
});

const createEmployeeFetcher = custom => ({
  isLoading: false,
  employee: createEmployee(),
  ...custom,
});

const createCompanyFetcher = custom => ({
  isLoading: false,
  company: createCompany(),
  ...custom,
});

const createListConnectorProps = customProps => ({
  employeeFetcher: createEmployeeFetcher(),
  ...customProps,
});

const createCompanyDetailsConnectorProps = customProps => ({
  companyFetcher: createCompanyFetcher(),
  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;

  describe('when loading employee', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeeDetailWrapper {...props} />)
        .find(B2BApolloClientContext.Consumer)
        .renderProp('children')(createB2BApolloClientContextProps())
        .renderProp('children')(
        createListConnectorProps({
          employeeFetcher: createEmployeeFetcher({ isLoading: true }),
        })
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render `<LoadingSpinner>', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });

  describe('when loading company', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeeDetailWrapper {...props} />)
        .find(B2BApolloClientContext.Consumer)
        .renderProp('children')(createB2BApolloClientContextProps())
        .renderProp('children')(createListConnectorProps())
        .renderProp('children')(
        createCompanyDetailsConnectorProps({
          companyFetcher: { isLoading: true },
        })
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render `<LoadingSpinner>', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });
  describe('when loaded', () => {
    describe('when the user does not exist as employee', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailWrapper {...props} />)
          .find(B2BApolloClientContext.Consumer)
          .renderProp('children')(createB2BApolloClientContextProps())
          .renderProp('children')(
          createListConnectorProps({
            employeeFetcher: createEmployeeFetcher({
              isLoading: false,
              employee: undefined,
            }),
          })
        );
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render children', () => {
        expect(props.children).not.toHaveBeenCalled();
      });
    });
    describe('when the user does not have company associated', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailWrapper {...props} />)
          .find(B2BApolloClientContext.Consumer)
          .renderProp('children')(createB2BApolloClientContextProps())
          .renderProp('children')(
          createListConnectorProps({
            employeeFetcher: createEmployeeFetcher({
              isLoading: false,
              employee: {
                id: 'abc',
                company: undefined,
              },
            }),
          })
        );
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render children', () => {
        expect(props.children).not.toHaveBeenCalled();
      });
    });
    describe('when success', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<EmployeeDetailWrapper {...props} />)
          .find(B2BApolloClientContext.Consumer)
          .renderProp('children')(createB2BApolloClientContextProps())
          .renderProp('children')(createListConnectorProps())
          .renderProp('children')(createCompanyDetailsConnectorProps());
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render children', () => {
        expect(props.children).toHaveBeenCalledWith({
          company: { id: 'company-id-1' },
          employee: {
            id: 'employee-id1',
            firstName: 'employee name',
            lastName: 'employee last name',
            email: 'foo@bar.com',
          },
        });
      });
    });
  });
});
