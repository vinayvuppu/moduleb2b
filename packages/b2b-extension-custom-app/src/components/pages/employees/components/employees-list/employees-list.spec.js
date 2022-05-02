import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import Pagination from '@commercetools-local/core/components/search/pagination';
import CustomFieldDefinitionsConnector from '@commercetools-local/core/components/custom-field-definitions-connector';
import { LoadingSpinner, Table } from '@commercetools-frontend/ui-kit';
import SearchViewControlledContainer from '@commercetools-local/core/components/search/search-view-controlled-container';
import ColumnManager from '@commercetools-local/core/components/column-manager';
import FormattedDateTime from '@commercetools-local/core/components/formatted-date-time';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import EmployeesListCustomViewsConnector from '../employees-list-custom-views-connector';
import EmployeesListConnector from '../employees-list-connector';
import { EmployeesList } from './employees-list';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';

jest.mock('@commercetools-local/utils/formats/date');
jest.mock('@commercetools-frontend/application-shell-connectors', () => {
  const actual = jest.requireActual(
    '@commercetools-frontend/application-shell-connectors'
  );
  return {
    ...actual,
    useApplicationContext: () => ({
      environment: { apiUrl: 'url' },
      language: 'en',
      userId: 'adasd',
      languages: ['en', 'de'],
    }),
  };
});
const createEmployee = customProps => ({
  id: 1,
  email: 'foo@bar.de',
  customerNumber: '123',
  externalId: '12',
  firstName: 'Jon',
  lastName: 'Snow',
  companyName: 'test',
  createdAt: '2016-08-11T16:26:09.045Z',
  lastModifiedAt: '2016-08-11T16:26:09.045Z',
  custom: null,
  ...customProps,
});

const createTestProps = customProps => ({
  // Connected
  projectKey: 'test',
  history: {
    push: jest.fn().mockName('history.push'),
  },
  location: {},

  // withApplicationContext
  language: 'en',
  userId: 'adasd',
  languages: ['en', 'de'],
  canViewEmployees: true,

  // injectIntl
  intl: intlMock,

  ...customProps,
});

const createCustomFieldDefinitionsFetcher = custom => ({
  isLoading: false,
  customFieldDefinitions: [],

  ...custom,
});

const createEmployeesFetcher = custom => ({
  isLoading: false,
  employees: {
    total: 1,
    count: 1,
    offset: 0,
    results: [createEmployee()],
  },

  ...custom,
});

const createListConnectorProps = customProps => ({
  employeesFetcher: createEmployeesFetcher(),

  ...customProps,
});

const createActiveView = custom => ({
  page: 1,
  perPage: 20,
  searchText: '',
  sorting: {
    key: 'createdAt',
    order: 'desc',
  },
  filters: {},

  ...custom,
});

const createCustomViewsConnectorProps = custom => ({
  activeView: createActiveView(),
  setActiveView: jest.fn().mockName('setActiveView'),

  ...custom,
});

const createB2BApolloClientContextProps = () => ({ apolloClient: {} });

const createSearchViewProps = custom => ({
  rowCount: 2,
  results: ['1', '2'],
  sorting: { key: 'rank', order: 'asc' },
  onSortChange: jest.fn(),
  measurementResetter: jest.fn(),
  footer: (
    <Pagination
      totalItems={2}
      perPage={20}
      page={1}
      onPerPageChange={jest.fn().mockName('onPerPageChange')}
      onPageChange={jest.fn().mockName('onPageChange')}
    />
  ),

  ...custom,
});

const TestRowItem = ({ children }) => <div>{children}</div>;
TestRowItem.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('render', () => {
  let props;
  let wrapper;

  describe('when loading', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeesList {...props} />)
        .find(B2BApolloClientContext.Consumer)
        .renderProp('children')(createB2BApolloClientContextProps())
        .find(EmployeesListCustomViewsConnector.Consumer)
        .renderProp('children')(createCustomViewsConnectorProps())
        .find(EmployeesListConnector)
        .renderProp('children')(
          createListConnectorProps({
            employeesFetcher: createEmployeesFetcher({ isLoading: true }),
          })
        )
        .find(CustomFieldDefinitionsConnector)
        .renderProp('children')({
          customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
        })
        .find(SearchViewControlledContainer)
        .renderProp('children')(createSearchViewProps());
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render `<LoadingSpinner>', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });

  describe('when loaded', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeesList {...props} />)
        .find(B2BApolloClientContext.Consumer)
        .renderProp('children')(createB2BApolloClientContextProps())
        .find(EmployeesListCustomViewsConnector.Consumer)
        .renderProp('children')(createCustomViewsConnectorProps())
        .find(EmployeesListConnector)
        .renderProp('children')(createListConnectorProps())
        .find(CustomFieldDefinitionsConnector)
        .renderProp('children')({
        customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
      });
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render `<LoadingSpinner>', () => {
      expect(wrapper).not.toRender(LoadingSpinner);
    });

    describe('<SearchViewControlledContainer>', () => {
      beforeEach(() => {
        wrapper = wrapper
          .find(SearchViewControlledContainer)
          .renderProp('children')(createSearchViewProps());
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render `<Table>`', () => {
        expect(wrapper).toRender(Table);
      });

      it('should render `<ColumnManager>`', () => {
        expect(wrapper).toRender(ColumnManager);
      });

      describe('<Table>', () => {
        it('should have `rowCount` prop', () => {
          expect(wrapper.find(Table)).toHaveProp('rowCount', 2);
        });
        it('should have `sortBy` prop', () => {
          expect(wrapper.find(Table)).toHaveProp('sortBy', 'rank');
        });
        it('should have `sortDirection` prop', () => {
          expect(wrapper.find(Table)).toHaveProp('sortDirection', 'ASC');
        });
        it('should have `shouldFillRemainingVerticalSpace` prop', () => {
          expect(wrapper.find(Table)).toHaveProp(
            'shouldFillRemainingVerticalSpace',
            true
          );
        });
      });

      describe('with `visibleColumns` on `activeView`', () => {
        beforeEach(() => {
          props = createTestProps();
          const activeView = createActiveView({
            visibleColumns: ['customerGroup', 'foo'],
          });
          wrapper = shallow(<EmployeesList {...props} />)
            .find(B2BApolloClientContext.Consumer)
            .renderProp('children')(createB2BApolloClientContextProps())
            .find(EmployeesListCustomViewsConnector.Consumer)
            .renderProp('children')(
              createCustomViewsConnectorProps({
                activeView,
              })
            )
            .find(EmployeesListConnector)
            .renderProp('children')(createListConnectorProps())
            .find(CustomFieldDefinitionsConnector)
            .renderProp('children')({
              customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
            })
            .find(SearchViewControlledContainer)
            .renderProp('children')(createSearchViewProps());
        });

        it('should match snapshot', () => {
          expect(wrapper).toMatchSnapshot();
        });

        describe.skip('<Table>', () => {
          it('should receive `visibleColumns`', () => {
            expect(wrapper.find(Table)).toHaveProp(
              'columns',
              expect.arrayContaining([
                expect.objectContaining({
                  key: 'customerGroup',
                }),
              ])
            );
          });

          it('should remove unknown `visibleColumns`', () => {
            expect(wrapper.find(Table)).toHaveProp(
              'columns',
              expect.not.arrayContaining([
                expect.objectContaining({
                  key: 'foo',
                }),
              ])
            );
          });
        });
      });
    });

    describe('custom fields cell', () => {
      let row;
      let results;
      let instance;
      let customFieldDefinitionsFetcher;
      const rowIndex = 0;
      const columnKey = 'myAwesomeCustomField';
      const customFieldValue = 'is the best';
      describe('when the custom field has value', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<EmployeesList {...props} />);
          instance = wrapper.instance();
          customFieldDefinitionsFetcher = createCustomFieldDefinitionsFetcher({
            customFieldDefinitions: [
              {
                name: 'myAwesomeCustomField',
                type: { name: 'String' },
              },
            ],
          });
          results = [
            createEmployee({
              custom: {
                customFieldsRaw: [
                  {
                    name: columnKey,
                    value: customFieldValue,
                  },
                ],
              },
            }),
          ];
          row = shallow(
            <TestRowItem>
              {instance.renderEmployeeRow(
                results,
                { columnKey, rowIndex },
                customFieldDefinitionsFetcher.customFieldDefinitions
              )}
            </TestRowItem>
          );
        });

        it('should render the cell with the custom field value', () => {
          expect(row).toHaveText(customFieldValue);
        });
      });
      describe('when the custom field has no value', () => {
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<EmployeesList {...props} />);
          instance = wrapper.instance();
          customFieldDefinitionsFetcher = createCustomFieldDefinitionsFetcher({
            customFieldDefinitions: [
              {
                name: 'myAwesomeCustomField',
                type: { name: 'String' },
              },
            ],
          });
          results = [createEmployee()];
          row = shallow(
            <TestRowItem>
              {instance.renderEmployeeRow(
                results,
                { columnKey, rowIndex },
                customFieldDefinitionsFetcher.customFieldDefinitions
              )}
            </TestRowItem>
          );
        });

        it('should render NO_VALUE_FALLBACK', () => {
          expect(row).toHaveText(NO_VALUE_FALLBACK);
        });
      });
    });
  });
});

describe('interacting', () => {
  let props;
  let wrapper;
  describe('`renderItem`', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeesList {...props} />);
    });

    const index = 0;

    let value;
    it('should render customerNumber', () => {
      value = wrapper.instance().renderEmployeeRow(
        [createEmployee()],
        {
          rowIndex: index,
          columnKey: 'customerNumber',
        },
        {}
      );
      expect(value).toBe('123');
    });

    it('should render email', () => {
      value = wrapper.instance().renderEmployeeRow(
        [createEmployee()],
        {
          rowIndex: index,
          columnKey: 'email',
        },
        {}
      );
      expect(value).toBe('foo@bar.de');
    });

    it('should render externalId', () => {
      value = wrapper.instance().renderEmployeeRow(
        [createEmployee()],
        {
          rowIndex: index,
          columnKey: 'externalId',
        },
        {}
      );
      expect(value).toBe('12');
    });

    it('should render createdAt', () => {
      value = shallow(
        <div>
          {wrapper.instance().renderEmployeeRow(
            [createEmployee()],
            {
              rowIndex: index,
              columnKey: 'createdAt',
            },
            {}
          )}
        </div>
      );
      expect(value.find(FormattedDateTime)).toHaveProp(
        'value',
        '2016-08-11T16:26:09.045Z'
      );
    });

    it('should render lastModifiedAt', () => {
      value = shallow(
        <div>
          {wrapper.instance().renderEmployeeRow(
            [createEmployee()],
            {
              rowIndex: index,
              columnKey: 'createdAt',
            },
            {}
          )}
        </div>
      );
      expect(value.find(FormattedDateTime)).toHaveProp(
        'value',
        '2016-08-11T16:26:09.045Z'
      );
    });
  });

  describe('`handleRowClick`', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<EmployeesList {...props} />);
      wrapper.instance().handleRowClick(0, [createEmployee()]);
    });
    it('should call the router with correct parameters', () => {
      expect(props.history.push).toHaveBeenCalledWith(
        '/test/b2b-extension/employees/1'
      );
    });
  });
});

describe('callbacks', () => {
  let wrapper;
  let props;
  let customViewConnectorProps;

  beforeEach(() => {
    props = createTestProps();
    customViewConnectorProps = createCustomViewsConnectorProps();
    wrapper = shallow(<EmployeesList {...props} />)
      .find(B2BApolloClientContext.Consumer)
      .renderProp('children')(createB2BApolloClientContextProps())
      .find(EmployeesListCustomViewsConnector.Consumer)
      .renderProp('children')(customViewConnectorProps)
      .find(EmployeesListConnector)
      .renderProp('children')(createListConnectorProps())
      .find(CustomFieldDefinitionsConnector)
      .renderProp('children')({
        customFieldDefinitionsFetcher: createCustomFieldDefinitionsFetcher(),
      })
      .find(SearchViewControlledContainer)
      .renderProp('children')(createSearchViewProps());
  });

  describe('<ColumnManager>', () => {
    describe('`onUpdateColumns`', () => {
      beforeEach(() => {
        const nextVisibleColumns = [{ key: 'foo-next-column' }];

        wrapper.find(ColumnManager).prop('onUpdateColumns')(nextVisibleColumns);
      });

      it('should invoke `setActiveView` on the `<EmployeesListCustomViewsConnector>`', () => {
        expect(customViewConnectorProps.setActiveView).toHaveBeenCalled();
      });

      it('should invoke `setActiveView` on `<EmployeesListCustomViewsConnector>` with keys of the next visible columns', () => {
        expect(customViewConnectorProps.setActiveView).toHaveBeenCalledWith(
          expect.objectContaining({
            visibleColumns: expect.arrayContaining(['foo-next-column']),
          })
        );
      });
    });
  });
});
