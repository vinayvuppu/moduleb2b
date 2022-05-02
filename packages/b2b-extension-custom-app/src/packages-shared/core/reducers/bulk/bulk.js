import omit from 'lodash.omit';
import { createSelector } from 'reselect';
import { isEmptyValue, filterEmptyValues } from '../../../utils/attributes';
import {
  START_BULK_UPDATE,
  ADD_BULK_UPDATE_SUCCESS,
  ADD_BULK_UPDATE_FAILURE,
  BULK_TOGGLE_CONFIRMATION_DIALOG,
  BULK_SET_SELECTED_ATTRIBUTES,
  BULK_LEAVE_BULK_UPDATE,
} from '../../constants';
// TODO We'd like to use the version below, but this breaks the test.
// The import is counted as undefined in `createSelector` below.
// To get around it, directly impot from the source file for now. This solves
// the issue for a reason we could not figure out. It may be a bug in the
// "transform-export-extensions" plugin.
//
// import * as productsSelectors from '../products'
import { selectProducts } from '../products/products';

export const updateModes = {
  CLEAR: 'CLEAR',
  UPDATE: 'UPDATE',
  // For set attributes
  ADD_VALUES: 'ADD_VALUES',
  REMOVE_VALUES: 'REMOVE_VALUES',
};

export const initialState = {
  selectedAttributes: {},
  showConfirmationModal: false,
  numberOfProductsToUpdate: 0,
  successfulUpdates: [],
  failedUpdates: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case BULK_LEAVE_BULK_UPDATE:
      return initialState;
    case START_BULK_UPDATE:
      return {
        ...state,
        numberOfProductsToUpdate: action.payload,
        successfulUpdates: [],
        failedUpdates: [],
      };
    case ADD_BULK_UPDATE_SUCCESS:
      return {
        ...state,
        successfulUpdates: [...state.successfulUpdates, action.payload],
      };
    case ADD_BULK_UPDATE_FAILURE:
      return {
        ...state,
        failedUpdates: [...state.failedUpdates, action.payload],
      };
    case BULK_TOGGLE_CONFIRMATION_DIALOG:
      return {
        ...state,
        showConfirmationModal: !state.showConfirmationModal,
      };
    case BULK_SET_SELECTED_ATTRIBUTES:
      return {
        ...state,
        selectedAttributes: action.payload,
      };
    default:
      return state;
  }
}

function selectBulkState(state) {
  return state.products.bulk;
}

export function selectSelectedAttributes(state) {
  return selectBulkState(state).selectedAttributes;
}

export function selectShowConfirmationModal(state) {
  return selectBulkState(state).showConfirmationModal;
}

export const selectSuccesfulBulkUpdatedProducts = createSelector(
  selectProducts,
  selectBulkState,
  (selectedProducts, bulkState) =>
    bulkState.successfulUpdates.map(productId => ({
      product: selectedProducts.find(product => product.id === productId),
    }))
);

export const selectFailedBulkUpdatedProducts = createSelector(
  selectProducts,
  selectBulkState,
  (selectedProducts, bulkState) =>
    bulkState.failedUpdates.map(({ productId, error }) => ({
      product: selectedProducts.find(product => product.id === productId),
      error,
    }))
);

export const selectUnclearedEmptyAttributes = createSelector(
  selectSelectedAttributes,
  (state, attributeDefinitions) => attributeDefinitions,
  (selectedAttributes, attrDefs) =>
    Object.keys(selectedAttributes).filter(
      attrName =>
        selectedAttributes[attrName].mode !== updateModes.CLEAR &&
        isEmptyValue(
          selectedAttributes[attrName].value,
          attrDefs.find(attr => attr.name === attrName).type.name
        )
    )
);

export const selectAttributesToUpdate = createSelector(
  selectSelectedAttributes,
  selectUnclearedEmptyAttributes,
  (state, attributeDefinitions) => attributeDefinitions,
  (selectedAttributes, unclearedEmptyAttributes, attrDefs) =>
    Object.keys(omit(selectedAttributes, unclearedEmptyAttributes)).reduce(
      (strippedAttributesAcc, attrName) => {
        const attribute = selectedAttributes[attrName];
        const definition = attrDefs.find(attr => attr.name === attrName);
        let newValue = attribute.value;
        if (Array.isArray(newValue) && definition.type.name === 'set') {
          newValue = filterEmptyValues(
            attribute.value,
            definition.type.elementType.name
          );
          if (newValue.length === 0) return strippedAttributesAcc;
        }

        return {
          ...strippedAttributesAcc,
          [attrName]: { ...attribute, value: newValue },
        };
      },
      {}
    )
);
