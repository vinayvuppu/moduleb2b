import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defaultMemoize } from 'reselect';
import { createSyncProducts } from '@commercetools/sync-actions';
import * as productActions from '../../actions/products';
import NestedAttributesContext from './nested-attributes-context';

const sync = createSyncProducts();

export const createProviderAPI = defaultMemoize(
  (
    nestedAttributesModalStack,
    addOpenedModalLevelToStack,
    removeClosedModalLevelFromStack,
    updateInternalProductDraft,
    cancelInternalProductDraftUpdates,
    setShouldUpdateInternalDraft,
    canUpdateInternalProductDraft
  ) => ({
    isSaveToolbarVisible: !nestedAttributesModalStack.length,
    addOpenedModalLevelToStack,
    removeClosedModalLevelFromStack,
    updateInternalProductDraft,
    cancelInternalProductDraftUpdates,
    setShouldUpdateInternalDraft,
    canUpdateInternalProductDraft,
  })
);

export class NestedAttributesContainerProvider extends React.Component {
  static displayName = 'NestedAttributesContainerProvider';
  static propTypes = {
    children: PropTypes.node.isRequired,
    productDraft: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    productAttributeDefinitions: PropTypes.array,

    // connect
    setProductDraft: PropTypes.func.isRequired,
  };

  state = {
    nestedAttributesModalStack: [],
    shouldUpdateInternalDraft: false,
    isSetOfNestedModified: false,
    previousProductDraft: this.props.productDraft,
  };

  addOpenedModalLevelToStack = modalLevel => {
    this.setState(prevState => ({
      nestedAttributesModalStack: [
        ...prevState.nestedAttributesModalStack,
        modalLevel,
      ],
    }));
  };

  removeClosedModalLevelFromStack = () => {
    this.setState(prevState => ({
      nestedAttributesModalStack: prevState.nestedAttributesModalStack.slice(
        0,
        prevState.nestedAttributesModalStack.length - 1
      ),
    }));
  };

  updateInternalProductDraft = () => {
    this.setState({
      previousProductDraft: this.props.productDraft,
    });
  };

  cancelInternalProductDraftUpdates = () => {
    this.props.setProductDraft(this.state.previousProductDraft);
  };

  setShouldUpdateInternalDraft = shouldUpdate => {
    this.setState({
      shouldUpdateInternalDraft: shouldUpdate,
    });
  };

  static getDerivedStateFromProps(props, state) {
    return state.shouldUpdateInternalDraft
      ? {
          previousProductDraft: props.productDraft,
          shouldUpdateInternalDraft: false,
        }
      : null;
  }

  render() {
    const updateActions = sync.buildActions(
      this.props.productDraft,
      this.state.previousProductDraft,
      {
        sameForAllAttributes: this.props.productAttributeDefinitions.map(
          productAttributeDefinition => productAttributeDefinition.name
        ),
      }
    );

    const canUpdateInternalProductDraft = updateActions.length > 0;

    return (
      <NestedAttributesContext.Provider
        value={{
          ...createProviderAPI(
            this.state.nestedAttributesModalStack,
            this.addOpenedModalLevelToStack,
            this.removeClosedModalLevelFromStack,
            this.updateInternalProductDraft,
            this.cancelInternalProductDraftUpdates,
            this.setShouldUpdateInternalDraft,
            canUpdateInternalProductDraft
          ),
        }}
      >
        {this.props.children}
      </NestedAttributesContext.Provider>
    );
  }
}

const mapDispatchToProps = {
  setProductDraft: productActions.setProductDraft,
};

export default connect(
  null,
  mapDispatchToProps
)(NestedAttributesContainerProvider);
