import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { deepEqual } from 'fast-equals';
import { injectIntl } from 'react-intl';
import omit from 'lodash.omit';
import orderBy from 'lodash.orderby';
import { compose } from 'recompose';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { LocalizedTextInput } from '@commercetools-frontend/ui-kit';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import CompanyOrdersListCustomViewsConnectorContext from './company-orders-list-custom-views-connector-context';
import {
  FetchViewsQuery,
  SwitchViewActivationMutation,
  ActivateViewMutation,
  DeactivateViewMutation,
  CreateViewMutation,
  UpdateViewMutation,
  DeleteViewMutation,
} from './company-orders-list-custom-views-connector.graphql';
import { initialViewState, docToView, viewToDoc } from './conversions';
import messages from './messages';

const createDefaultView = props => ({
  ...initialViewState,
  id: 'default-orders-list-view',
  name: LocalizedTextInput.createLocalizedString(props.languages, {
    en: props.intl.formatMessage(messages.defaultOptionLabel),
  }),
  isImmutable: true,
  filters: initialViewState.filters,
});

const createQueryVariables = custom => ({
  target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
  ...custom,
});

export class CompanyOrdersListCustomViewsConnectorProvider extends React.Component {
  static displayName = 'CompanyOrdersListCustomViewsConnectorProvider';
  static propTypes = {
    projectKey: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    // graphql
    viewsQuery: PropTypes.shape({
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
      loading: PropTypes.bool.isRequired,
      activeView: PropTypes.shape({
        id: PropTypes.string.isRequired,
        nameAllLocales: PropTypes.arrayOf(
          PropTypes.shape({
            locale: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
          })
        ).isRequired,
      }),
      views: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          nameAllLocales: PropTypes.arrayOf(
            PropTypes.shape({
              locale: PropTypes.string.isRequired,
              value: PropTypes.string.isRequired,
            })
          ).isRequired,
        })
      ),
    }),
    activateViewMutation: PropTypes.func.isRequired,
    deactivateViewMutation: PropTypes.func.isRequired,
    createViewMutation: PropTypes.func.isRequired,
    updateViewMutation: PropTypes.func.isRequired,
    deleteViewMutation: PropTypes.func.isRequired,
    switchViewActivationMutation: PropTypes.func.isRequired,
    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    // withApplicationContext
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    // injectFeatureToggle
    areSavedOrdersListViewsEnabled: PropTypes.bool.isRequired,
  };

  state = {
    activeView: null,
  };

  immutableViews = [createDefaultView(this.props)];

  handleSelectView = nextActiveView => {
    const hasActiveOrdersListView = Boolean(this.props.viewsQuery.activeView);

    if (nextActiveView.isImmutable) {
      this.setActiveView(nextActiveView);

      if (hasActiveOrdersListView) {
        return this.props.deactivateViewMutation({
          variables: createQueryVariables({
            id: this.props.viewsQuery.activeView.id,
          }),
        });
      }
    }

    return (hasActiveOrdersListView
      ? this.props.switchViewActivationMutation({
          variables: createQueryVariables({
            idOfPreviouslyActiveView: this.props.viewsQuery.activeView.id,
            idOfNextActiveView: nextActiveView.id,
          }),
        })
      : this.props.activateViewMutation({
          variables: createQueryVariables({
            id: nextActiveView.id,
          }),
        })
    ).then(
      () => this.resetActiveView(),
      ({ graphQLErrors }) => {
        throw graphQLErrors;
      }
    );
  };

  handleCreateView = draft =>
    this.props
      .createViewMutation({
        variables: createQueryVariables({
          draft: viewToDoc(draft),
        }),
      })
      .then(
        createdView => {
          if (this.props.viewsQuery?.activeView?.id)
            return this.props.deactivateViewMutation({
              variables: createQueryVariables({
                id: this.props.viewsQuery.activeView.id,
              }),
            });

          return Promise.resolve(createdView);
        },
        ({ graphQLErrors }) => {
          throw graphQLErrors;
        }
      )
      .then(() => this.resetActiveView());

  handleUpdateView = view =>
    this.props
      .updateViewMutation({
        variables: createQueryVariables({
          id: view.id,
          draft: viewToDoc(view),
        }),
      })
      .then(
        () => {
          this.resetActiveView();
        },
        ({ graphQLErrors }) => {
          throw graphQLErrors;
        }
      );

  handleDeleteView = () =>
    this.props
      .deleteViewMutation({
        variables: createQueryVariables({
          id: this.getActiveView().id,
        }),
      })
      .then(
        () => {
          this.resetActiveView();
        },
        ({ graphQLErrors }) => {
          throw graphQLErrors;
        }
      );

  getInitialActiveView = () =>
    (this.props.viewsQuery?.activeView &&
      docToView(this.props.viewsQuery.activeView)) ||
    this.immutableViews[0];

  getActiveView = () =>
    this.state.activeView ||
    (this.props.viewsQuery?.activeView &&
      docToView(this.props.viewsQuery.activeView));

  setActiveView = activeView => {
    this.setState({ activeView });
  };

  resetActiveView = () => {
    this.setState({ activeView: null });
  };

  getHasUnsavedChanges = () => {
    if (!this.state.activeView) return false;

    // These props are not saved but augmented onto the view.
    const nonCustomViewProps = ['page', 'perPage', 'track'];
    const hasChangesInInitialAndActiveView = !deepEqual(
      omit(this.state.activeView, nonCustomViewProps),
      omit(this.getInitialActiveView(), nonCustomViewProps)
    );

    return hasChangesInInitialAndActiveView;
  };

  getViews = activeView => {
    if (!this.props.viewsQuery?.views) return this.immutableViews;

    const ordersListViewDocs = this.props.viewsQuery.views.map(docToView);

    if (activeView.isImmutable) {
      const activeImmutableView = this.immutableViews.find(
        immutableView => immutableView.id === activeView.id
      );
      const remainingImmutableViews = this.immutableViews.filter(
        immutableView => immutableView.id !== activeView.id
      );

      return [
        activeImmutableView,
        ...ordersListViewDocs,
        ...remainingImmutableViews,
      ];
    }

    const ordersListViewDocsOrderedByActivation = orderBy(
      ordersListViewDocs,
      ['isActive'],
      ['desc']
    );

    return [...ordersListViewDocsOrderedByActivation, ...this.immutableViews];
  };

  render() {
    const activeView = this.state.activeView || this.getInitialActiveView();
    const views = this.getViews(activeView);
    const isLoadingViews = Boolean(this.props.viewsQuery?.loading);
    return (
      <CompanyOrdersListCustomViewsConnectorContext.Provider
        value={{
          hasUnsavedChanges: this.getHasUnsavedChanges(),
          activeView,
          viewsFetcher: {
            isLoading: isLoadingViews,
            views,
          },
          activeViewFetcher: {
            isLoading: isLoadingViews,
            view:
              this.props.viewsQuery?.activeView &&
              docToView(this.props.viewsQuery.activeView),
          },
          setActiveView: this.setActiveView,
          resetActiveView: this.resetActiveView,
          selectView: this.handleSelectView,
          createView: this.handleCreateView,
          saveView: this.handleUpdateView,
          deleteView: this.handleDeleteView,
        }}
      >
        {this.props.children}
      </CompanyOrdersListCustomViewsConnectorContext.Provider>
    );
  }
}

export default compose(
  graphql(FetchViewsQuery, {
    name: 'viewsQuery',
    options: () => ({
      // TODO skip based on prev query or make declarative to
      // prioritise requests.
      variables: createQueryVariables(),
    }),
    skip: ownProps => !ownProps.areSavedOrdersListViewsEnabled,
  }),
  graphql(ActivateViewMutation, {
    name: 'activateViewMutation',
    options: () => ({
      refetchQueries: [
        { query: FetchViewsQuery, variables: createQueryVariables() },
      ],
    }),
  }),
  graphql(DeactivateViewMutation, {
    name: 'deactivateViewMutation',
    options: () => ({
      refetchQueries: [
        { query: FetchViewsQuery, variables: createQueryVariables() },
      ],
    }),
  }),
  graphql(CreateViewMutation, {
    name: 'createViewMutation',
    options: () => ({
      refetchQueries: [
        { query: FetchViewsQuery, variables: createQueryVariables() },
      ],
    }),
  }),
  graphql(SwitchViewActivationMutation, {
    name: 'switchViewActivationMutation',
    options: () => ({
      refetchQueries: [
        { query: FetchViewsQuery, variables: createQueryVariables() },
      ],
    }),
  }),
  graphql(UpdateViewMutation, {
    name: 'updateViewMutation',
    options: () => ({
      refetchQueries: [
        { query: FetchViewsQuery, variables: createQueryVariables() },
      ],
    }),
  }),
  graphql(DeleteViewMutation, {
    name: 'deleteViewMutation',
    options: () => ({
      refetchQueries: [
        { query: FetchViewsQuery, variables: createQueryVariables() },
      ],
    }),
  }),
  withApplicationContext(applicationContext => ({
    languages: applicationContext.project.languages,
  })),
  injectIntl
)(CompanyOrdersListCustomViewsConnectorProvider);
