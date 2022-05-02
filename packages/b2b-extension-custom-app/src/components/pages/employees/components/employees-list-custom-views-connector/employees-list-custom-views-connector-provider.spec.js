import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import { docToView } from './conversions';
import { EmployeesListCustomViewsConnectorProvider } from './employees-list-custom-views-connector-provider';

const TestComponent = () => <div>{'test'}</div>;
TestComponent.displayName = 'TestComponent';

const createActiveCustomersListDoc = custom => ({
  id: 'test-active-id',
  isImmutable: false,
  nameAllLocales: [
    {
      locale: 'de',
      value: 'test-value-de',
    },
  ],
  ...custom,
});

const createActiveCustomersListView = custom =>
  docToView(createActiveCustomersListDoc(custom));

const createTestProps = customProps => ({
  projectKey: 'test-project-key',
  children: <TestComponent />,
  // graphql
  activateViewMutation: jest.fn(() =>
    Promise.resolve(createActiveCustomersListDoc())
  ),
  deactivateViewMutation: jest.fn(() =>
    Promise.resolve(createActiveCustomersListDoc())
  ),
  createViewMutation: jest.fn(() =>
    Promise.resolve(createActiveCustomersListDoc())
  ),
  updateViewMutation: jest.fn(() =>
    Promise.resolve(createActiveCustomersListDoc())
  ),
  deleteViewMutation: jest.fn(() =>
    Promise.resolve(createActiveCustomersListDoc())
  ),
  switchViewActivationMutation: jest.fn(() =>
    Promise.resolve({
      activate: createActiveCustomersListDoc(),
      deactivate: createActiveCustomersListDoc(),
    })
  ),
  viewsQuery: {
    loading: false,
    activeView: createActiveCustomersListDoc(),
    views: [
      createActiveCustomersListDoc(),
      createActiveCustomersListDoc({ id: 'non-active-id' }),
    ],
  },
  // withApplicationContext
  languages: ['de', 'en'],
  // injectIntl
  intl: intlMock,
  // injectFeatureToggles
  areSavedEmployeesListViewsEnabled: false,

  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<EmployeesListCustomViewsConnectorProvider {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('interacting', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<EmployeesListCustomViewsConnectorProvider {...props} />);
  });

  describe('`setActiveView`', () => {
    let nextActiveView;
    beforeEach(() => {
      nextActiveView = createActiveCustomersListView();

      wrapper.instance().setActiveView(nextActiveView);
    });

    it('should update the state of the active view', () => {
      expect(wrapper).toHaveState('activeView', nextActiveView);
    });
  });

  describe('`resetActiveView`', () => {
    let nextActiveView;
    beforeEach(() => {
      nextActiveView = createActiveCustomersListView({
        id: 'another-active-view-id',
      });

      wrapper.instance().setActiveView(nextActiveView);
      wrapper.instance().resetActiveView();
    });

    it('should reset the state of the active view', () => {
      expect(wrapper).toHaveState('activeView', null);
    });
  });

  describe('`getInitialActiveView`', () => {
    let initialActiveView;
    describe('with `viewsQuery` and saved `activeView`', () => {
      beforeEach(() => {
        initialActiveView = wrapper.instance().getInitialActiveView();
      });

      it('should `docToView` the saved `activeView`', () => {
        expect(initialActiveView).toEqual(
          docToView(props.viewsQuery.activeView)
        );
      });
    });

    describe('without saved `activeView`', () => {
      beforeEach(() => {
        props = createTestProps({
          viewsQuery: {
            activeView: null,
            loading: false,
          },
        });

        wrapper = shallow(
          <EmployeesListCustomViewsConnectorProvider {...props} />
        );

        initialActiveView = wrapper.instance().getInitialActiveView();
      });

      it('should fall back to the first immutable view', () => {
        expect(initialActiveView).toEqual(wrapper.instance().immutableViews[0]);
      });
    });
  });

  describe('`getHasUnsavedChanges`', () => {
    describe('without `activeView` in `state`', () => {
      it('should not signal unsaved changes', () => {
        expect(wrapper.instance().getHasUnsavedChanges()).toBe(false);
      });
    });

    describe('with `activeView` in `state`', () => {
      describe('when `activeView` changed from initial view', () => {
        beforeEach(() => {
          wrapper.instance().setActiveView(
            createActiveCustomersListView({
              filters: [
                {
                  type: 'test-type',
                  json: {
                    value: 'test',
                  },
                },
              ],
            })
          );
        });

        it('should signal unsaved changes', () => {
          expect(wrapper.instance().getHasUnsavedChanges()).toBe(true);
        });

        describe('when `activeView` changes are non saveable', () => {
          beforeEach(() => {
            wrapper.instance().setActiveView({
              ...wrapper.instance().getInitialActiveView(),
              page: 10,
              perPage: 20,
              track: 'foo',
            });
          });

          it('should not signal unsaved changes', () => {
            expect(wrapper.instance().getHasUnsavedChanges()).toBe(false);
          });
        });
      });
    });
  });

  describe('getViews', () => {
    let activeView;
    let views;
    beforeEach(() => {
      activeView = createActiveCustomersListDoc();
    });
    describe('when no mutable views exist', () => {
      beforeEach(() => {
        props = createTestProps({
          viewsQuery: {
            loading: false,
            views: null,
          },
        });
        wrapper = shallow(
          <EmployeesListCustomViewsConnectorProvider {...props} />
        );
      });
      it('should return all immutable views', () => {
        expect(wrapper.instance().getViews(activeView)).toEqual(
          wrapper.instance().immutableViews
        );
      });
    });
    describe('when mutable views exist', () => {
      describe('when active view is immutable', () => {
        beforeEach(() => {
          activeView = wrapper.instance().immutableViews[0];
          views = wrapper.instance().getViews(activeView);
        });
        it('should place the immutable view first', () => {
          expect(views[0]).toEqual(activeView);
        });
        it('should place all mutable views after', () => {
          const [, ...remainingViews] = views;

          expect(remainingViews).toEqual(
            expect.arrayContaining(props.viewsQuery.views.map(docToView))
          );
        });
      });
      describe('when active view is mutable', () => {
        beforeEach(() => {
          props = createTestProps({
            viewsQuery: {
              loading: false,
              views: [
                createActiveCustomersListDoc({ isActive: true }),
                createActiveCustomersListDoc({
                  id: 'non-active-id',
                  isActive: false,
                }),
              ],
            },
          });
          wrapper = shallow(
            <EmployeesListCustomViewsConnectorProvider {...props} />
          );

          activeView = props.viewsQuery.views[0];
          views = wrapper.instance().getViews(activeView);
        });
        it('should place the mutable active view first', () => {
          expect(views[0].isActive).toBe(true);
        });
        it('should place all immutable views after', () => {
          const [, ...remainingViews] = views;

          expect(remainingViews).toEqual(
            expect.arrayContaining(wrapper.instance().immutableViews)
          );
        });
      });
    });
  });

  describe('`handleSelectView`', () => {
    describe('when view is immutable', () => {
      let nextActiveView;
      beforeEach(() => {
        nextActiveView = {
          ...createActiveCustomersListView(),
          isImmutable: true,
        };
        return wrapper.instance().handleSelectView(nextActiveView);
      });

      it('should set the active view', () => {
        expect(wrapper).toHaveState('activeView', nextActiveView);
      });

      it('should not invoke `activateViewMutation`', () => {
        expect(props.activateViewMutation).not.toHaveBeenCalled();
      });
    });

    describe('when view is mutable', () => {
      describe('when previously active view exists', () => {
        let nextActiveView;
        beforeEach(() => {
          nextActiveView = createActiveCustomersListView({
            isImmutable: false,
          });
          return wrapper.instance().handleSelectView(nextActiveView);
        });

        it('should invoke `switchViewActivationMutation`', () => {
          expect(props.switchViewActivationMutation).toHaveBeenCalledWith({
            variables: expect.objectContaining({
              idOfPreviouslyActiveView: props.viewsQuery.activeView.id,
              idOfNextActiveView: nextActiveView.id,
            }),
          });
        });

        describe('when switching activation resolves', () => {
          it('should reset the active view', () => {
            expect(wrapper).toHaveState('activeView', null);
          });
        });
      });
      describe('when previously active view does not exist', () => {
        let nextActiveView;
        beforeEach(() => {
          props = createTestProps({
            viewsQuery: {
              loading: false,
              activeView: null,
            },
          });
          wrapper = shallow(
            <EmployeesListCustomViewsConnectorProvider {...props} />
          );
          nextActiveView = createActiveCustomersListView({
            isImmutable: false,
          });
          return wrapper.instance().handleSelectView(nextActiveView);
        });

        it('should invoke `activateViewMutation`', () => {
          expect(props.activateViewMutation).toHaveBeenCalledWith({
            variables: expect.objectContaining({
              id: nextActiveView.id,
            }),
          });
        });

        describe('when switching activation resolves', () => {
          it('should reset the active view', () => {
            expect(wrapper).toHaveState('activeView', null);
          });
        });
      });
    });
  });

  describe('`handleCreateView`', () => {
    let viewDraft;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <EmployeesListCustomViewsConnectorProvider {...props} />
      );

      jest.spyOn(wrapper.instance(), 'resetActiveView');

      viewDraft = createActiveCustomersListView({
        id: null,
        isImmutable: true,
      });

      return wrapper.instance().handleCreateView(viewDraft);
    });

    it('should invoke `createViewMutation`', () => {
      expect(props.createViewMutation).toHaveBeenCalled();
    });

    it('should remove the `id` when creating from an existing view', () => {
      expect(props.createViewMutation).toHaveBeenCalledWith(
        expect.not.objectContaining({
          id: expect.any(String),
        })
      );
    });

    describe('when creation resolves', () => {
      it('should reset the active view', () => {
        expect(wrapper.instance().resetActiveView).toHaveBeenCalled();
      });

      describe('with previously active view', () => {
        it('should deactivate the previously active view', () => {
          expect(props.deactivateViewMutation).toHaveBeenCalledWith(
            expect.objectContaining({
              variables: expect.objectContaining({
                id: props.viewsQuery.activeView.id,
              }),
            })
          );
        });
      });
    });
  });

  describe('`handleUpdateView`', () => {
    let viewDraft;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <EmployeesListCustomViewsConnectorProvider {...props} />
      );

      jest.spyOn(wrapper.instance(), 'resetActiveView');

      viewDraft = createActiveCustomersListView({
        isImmutable: true,
      });

      return wrapper.instance().handleUpdateView(viewDraft);
    });

    it('should invoke `updateViewMutation`', () => {
      expect(props.updateViewMutation).toHaveBeenCalledWith({
        variables: expect.objectContaining({
          id: viewDraft.id,
          draft: expect.any(Object),
        }),
      });
    });

    describe('when editing resolves', () => {
      it('should reset the active view', () => {
        expect(wrapper.instance().resetActiveView).toHaveBeenCalled();
      });
    });
  });

  describe('`handleDeleteView`', () => {
    let viewDraft;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <EmployeesListCustomViewsConnectorProvider {...props} />
      );

      jest.spyOn(wrapper.instance(), 'resetActiveView');

      viewDraft = createActiveCustomersListView();
      wrapper.instance().setActiveView(viewDraft);

      return wrapper.instance().handleDeleteView();
    });

    it('should invoke `deleteViewMutation`', () => {
      expect(props.deleteViewMutation).toHaveBeenCalledWith({
        variables: expect.objectContaining({
          id: viewDraft.id,
        }),
      });
    });

    describe('when deletion resolves', () => {
      it('should reset the active view', () => {
        expect(wrapper.instance().resetActiveView).toHaveBeenCalled();
      });
    });
  });
});
