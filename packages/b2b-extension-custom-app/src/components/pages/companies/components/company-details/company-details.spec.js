import React from 'react';
import { shallow } from 'enzyme';
import {
  BinLinearIcon,
  IconButton,
  LoadingSpinner,
} from '@commercetools-frontend/ui-kit';
import { DOMAINS } from '@commercetools-frontend/constants';
import {
  PageNotFound,
  ConfirmationDialog,
} from '@commercetools-frontend/application-components';
import { intlMock } from '@commercetools-local/test-utils';
import { CompanyDetails } from './company-details';

const createCompany = custom => ({
  id: 'cg-id-1',
  version: 1,
  key: 'test-key-1',
  name: 'test-name-1',
  ...custom,
});

const createMutationResponse = custom => ({
  data: {
    deleteCompany: {
      id: 'cg-id-1',
      version: 1,
      key: 'test-key-1',
      name: 'test-name-1',
      ...custom,
    },
  },
});

const createCompanyFetcher = custom => ({
  isLoading: false,
  refetch: jest.fn(),
  company: createCompany(),
  ...custom,
});

const createConnectorProps = custom => ({
  companyFetcher: createCompanyFetcher(),
  companyDeleter: {
    isLoading: false,
    execute: jest.fn(() => Promise.resolve(createMutationResponse())),
  },
  companyUpdater: {
    isLoading: false,
    execute: jest.fn(() => Promise.resolve(createMutationResponse())),
  },

  ...custom,
});

const createTestProps = customProps => ({
  history: { replace: jest.fn() },

  projectKey: 'test-1',
  companyId: 'cg-id-1',

  // withModalState
  deletionConfirmationModal: {
    isOpen: false,
    handleOpen: jest.fn(),
    handleClose: jest.fn(),
  },

  // injectIntl
  intl: intlMock,
  // connect
  hideAllPageNotifications: jest.fn(),
  showNotification: jest.fn(),
  showApiErrorNotification: jest.fn(),
  children: <div />,
  ...createConnectorProps(customProps),
  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;

  describe('rendering base elements', () => {
    describe('when loading', () => {
      beforeEach(() => {
        props = createTestProps({
          companyFetcher: createCompanyFetcher({
            isLoading: true,
          }),
        });
        wrapper = shallow(<CompanyDetails {...props} />);
      });

      it('should render `<LoadingSpinner>`', () => {
        expect(wrapper).toRender(LoadingSpinner);
      });
    });

    describe('when loaded', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<CompanyDetails {...props} />);
      });
      it('should not render `<LoadingSpinner>`', () => {
        expect(wrapper).not.toRender(LoadingSpinner);
      });
      it('should render data-track-component', () => {
        expect(wrapper).toRender({
          'data-track-component': 'CompanyUpdate',
        });
      });
      describe('when the company was not found', () => {
        beforeEach(() => {
          props = createTestProps({
            companyFetcher: createCompanyFetcher({
              isLoading: false,
              company: null,
            }),
          });

          wrapper = shallow(<CompanyDetails {...props} />);
        });
        it('should render a 404 page', () => {
          expect(wrapper).toRender(PageNotFound);
        });
      });
      describe('<ViewHeader>', () => {
        it('should render ViewHeader', () => {
          expect(wrapper).toRender('ViewHeader');
        });
        it('should have `title` prop', () => {
          expect(wrapper.find('ViewHeader')).toHaveProp('title', 'test-name-1');
        });
        describe('<BackToList>', () => {
          let renderBackToListWrapper;
          beforeEach(() => {
            props = createTestProps();
            wrapper = shallow(<CompanyDetails {...props} />);
            renderBackToListWrapper = shallow(
              <div>{wrapper.find('ViewHeader').prop('backToList')}</div>
            );
          });
          it('should render `<BackToList>`', () => {
            expect(renderBackToListWrapper).toRender('BackToList');
          });
          it('should have `to` prop', () => {
            expect(renderBackToListWrapper.find('BackToList')).toHaveProp(
              'to',
              '/test-1/b2b-extension/companies'
            );
          });
          it('should have `label` prop', () => {
            expect(renderBackToListWrapper.find('BackToList')).toHaveProp(
              'label',
              'Company.Details.backToList'
            );
          });
        });
        describe('rendering commands', () => {
          let renderCommandsWrapper;
          describe('when ConfirmationDialog is closed', () => {
            beforeEach(() => {
              props = createTestProps();
              wrapper = shallow(<CompanyDetails {...props} />);
              renderCommandsWrapper = shallow(
                <div>{wrapper.find('ViewHeader').prop('commands')}</div>
              );
            });
            it('should render `<IconButton>`', () => {
              expect(renderCommandsWrapper).toRender(IconButton);
            });
            it('should have `label` prop', () => {
              expect(renderCommandsWrapper.find(IconButton)).toHaveProp(
                'label',
                'Company.Details.labelDelete'
              );
            });
            it('should have `icon` prop', () => {
              expect(renderCommandsWrapper.find(IconButton)).toHaveProp(
                'icon',
                <BinLinearIcon />
              );
            });
            it('should have `onClick` prop', () => {
              expect(renderCommandsWrapper.find(IconButton)).toHaveProp(
                'onClick',
                props.deletionConfirmationModal.handleOpen
              );
            });
          });
          describe('when ConfirmationDialog is opened', () => {
            beforeEach(() => {
              props = createTestProps({
                deletionConfirmationModal: {
                  isOpen: true,
                  handleClose: jest.fn(),
                  handleOpen: jest.fn(),
                },
              });
              wrapper = shallow(<CompanyDetails {...props} />);
            });
            it('should render `<ConfirmationDialog>`', () => {
              expect(wrapper).toRender(ConfirmationDialog);
            });
            it('should have `title` prop', () => {
              expect(wrapper.find(ConfirmationDialog)).toHaveProp(
                'title',
                'Company.Details.confirmDeleteTitle'
              );
            });
            it('should have `message` prop', () => {
              expect(wrapper.find(ConfirmationDialog)).toRender({
                id: 'Company.Details.confirmDeleteMessage',
              });
            });
            it('should have `onConfirm` prop', () => {
              expect(wrapper.find(ConfirmationDialog)).toHaveProp(
                'onConfirm',
                expect.any(Function)
              );
            });
            it('should have `onClose` prop', () => {
              expect(wrapper.find(ConfirmationDialog)).toHaveProp(
                'onClose',
                props.deletionConfirmationModal.handleClose
              );
            });
          });
        });
      });

      it('should render `<TabContainer>`', () => {
        expect(wrapper).toRender('TabContainer');
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  describe('when delete button is clicked', () => {
    let renderCommandsWrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CompanyDetails {...props} />);
      renderCommandsWrapper = shallow(
        <div>{wrapper.find('ViewHeader').prop('commands')}</div>
      );
      renderCommandsWrapper.find(IconButton).simulate('click');
    });
    it('should open the deletion confirmation modal', () => {
      expect(props.deletionConfirmationModal.handleOpen).toHaveBeenCalled();
    });
  });
  describe('when deleting a company', () => {
    beforeEach(async () => {
      props = createTestProps({
        deletionConfirmationModal: {
          isOpen: true,
          handleClose: jest.fn(),
          handleOpen: jest.fn(),
        },
      });
      wrapper = shallow(<CompanyDetails {...props} />);
      await wrapper.find(ConfirmationDialog).prop('onConfirm')();
    });
    it('should call the hideAllPageNotifications function', () => {
      expect(props.hideAllPageNotifications).toHaveBeenCalledTimes(1);
    });
    it('should call deleteCompany', () => {
      expect(props.companyDeleter.execute).toHaveBeenCalled();
    });
    it('should dispatch success notification', () => {
      expect(props.showNotification).toHaveBeenCalledTimes(1);
      expect(props.showNotification).toHaveBeenLastCalledWith({
        kind: 'success',
        text: 'Company.Details.companyDeleted',
        domain: DOMAINS.SIDE,
      });
    });
    it('should return to the list ', () => {
      expect(props.history.replace).toHaveBeenCalledWith(
        '/test-1/b2b-extension/companies'
      );
    });

    describe('when deletion rejects', () => {
      beforeEach(() => {
        props = createTestProps({
          deletionConfirmationModal: {
            isOpen: true,
            handleClose: jest.fn(),
            handleOpen: jest.fn(),
          },
          companyDeleter: {
            isLoading: false,
            execute: jest.fn(() => Promise.reject(new Error('Test error'))),
          },
        });
        wrapper = shallow(<CompanyDetails {...props} />);
        wrapper
          .find(ConfirmationDialog)
          .prop('onConfirm')()
          .catch(() => {});
      });
      it('should not dispatch success notification', () => {
        expect(props.showNotification).toHaveBeenCalled();
      });
      it('should not return to the list ', () => {
        expect(props.history.replace).not.toHaveBeenCalled();
      });
    });
  });
});
