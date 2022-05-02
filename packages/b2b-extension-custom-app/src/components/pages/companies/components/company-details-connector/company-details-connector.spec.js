import React from 'react';
import { shallow } from 'enzyme';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { CompanyDetailsConnector } from './company-details-connector';

jest.mock('@commercetools-frontend/application-shell-connectors', () => {
  const actual = jest.requireActual(
    '@commercetools-frontend/application-shell-connectors'
  );
  return {
    ...actual,
    useApplicationContext: () => ({
      environment: { apiUrl: 'url' },
    }),
  };
});

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const companyId = 'company-1';

const createCompany = data => ({
  id: companyId,
  name: 'ok',
  logo: 'logo-1',
  channels: [],
  addresses: [{ id: 'address-id-1' }],
  requiredApprovalRoles: ['role1'],
  ...data,
});

const createTestProps = props => ({
  children: jest.fn(),
  projectKey: 'foo-key',
  companyId: 'foo-company-id',
  // withPendingRequests
  pendingDeleterRequests: {
    increment: jest.fn(),
    decrement: jest.fn(),
    isLoading: false,
  },
  pendingUpdaterRequests: {
    increment: jest.fn(),
    decrement: jest.fn(),
    isLoading: false,
  },

  ...props,
});

jest.mock('../../api', () => {
  const company = {
    id: 'company-1',
    name: 'ok',
    logo: 'logo-1',
    channels: [],
    addresses: [{ id: 'address-id-1' }],
    requiredApprovalRoles: ['role1'],
  };
  return {
    getCompany: jest.fn(() => {
      return Promise.resolve(company);
    }),
    updateCompany: jest.fn(() => {
      return Promise.resolve(company);
    }),
    deleteCompany: jest.fn(() => {
      return Promise.resolve(company);
    }),
  };
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CompanyDetailsConnector {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should invoke `children`', () => {
    expect(props.children).toHaveBeenCalled();
  });

  describe('companyFetcher', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          companyFetcher: expect.objectContaining({
            isLoading: true,
          }),
        })
      );
    });

    it('should invoke `children` with `data`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          companyFetcher: expect.objectContaining({
            company: {},
          }),
        })
      );
    });
  });

  describe('companyDeleter', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          companyDeleter: expect.objectContaining({
            isLoading: false,
          }),
        })
      );
    });

    it('should invoke `children` with `execute`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          companyDeleter: expect.objectContaining({
            execute: expect.any(Function),
          }),
        })
      );
    });
  });

  describe('companyUpdater', () => {
    it('should invoke `children` with `isLoading`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          companyUpdater: expect.objectContaining({
            isLoading: false,
          }),
        })
      );
    });

    it('should invoke `children` with `execute`', () => {
      expect(props.children).toHaveBeenCalledWith(
        expect.objectContaining({
          companyUpdater: expect.objectContaining({
            execute: expect.any(Function),
          }),
        })
      );
    });
  });
});

describe.skip('interacting', () => {
  let props;
  let wrapper;

  describe('when updating', () => {
    describe('when resolving', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<CompanyDetailsConnector {...props} />);

        await wrapper.instance().handleUpdateCompany(createCompany());
      });

      it('should invoke `updateCompanyMutation` with `id`, `version` and `actions`', () => {
        expect(props.updateCompanyMutation).toHaveBeenCalledWith({
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            version: props.companyQuery.company.version,
            id: props.companyId,
            actions: expect.any(Array),
          },
        });
      });

      it('should invoke `increment` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.increment).toHaveBeenCalled();
      });

      it('should invoke `decrement` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.decrement).toHaveBeenCalled();
      });
    });

    describe('when rejecting', () => {
      beforeEach(async () => {
        props = createTestProps({
          updateCompany: jest.fn(() => Promise.reject(new Error('Test error'))),
        });
        wrapper = shallow(<CompanyDetailsConnector {...props} />);

        await wrapper.instance().handleUpdateCompany(createCompany());
      });

      it('should invoke `decrement` on `pendingUpdaterRequests`', () => {
        expect(props.pendingUpdaterRequests.decrement).toHaveBeenCalled();
      });
    });
  });

  describe('when deleting', () => {
    describe('when resolving', () => {
      beforeEach(async () => {
        props = createTestProps();
        wrapper = shallow(<CompanyDetailsConnector {...props} />);

        await wrapper.instance().handleDeleteCompany();
      });

      it('should invoke `deleteCompanyMutation` with `id` and `version`', () => {
        expect(props.deleteCompanyMutation).toHaveBeenCalledWith({
          variables: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            version: props.companyQuery.company.version,
            id: props.companyId,
          },
        });
      });

      it('should invoke `increment` on `pendingDeleterRequests`', () => {
        expect(props.pendingDeleterRequests.increment).toHaveBeenCalled();
      });

      it('should invoke `decrement` on `pendingDeleterRequests`', () => {
        expect(props.pendingDeleterRequests.decrement).toHaveBeenCalled();
      });
    });

    describe('when rejecting', () => {
      beforeEach(async () => {
        props = createTestProps({
          deleteCompany: jest.fn(() => Promise.reject(new Error('Test error'))),
        });
        wrapper = shallow(<CompanyDetailsConnector {...props} />);

        await wrapper.instance().handleDeleteCompany();
      });

      it('should invoke `decrement` on `pendingDeleterRequests`', () => {
        expect(props.pendingDeleterRequests.decrement).toHaveBeenCalled();
      });
    });
  });
});
