import omit from 'lodash.omit';
import uniqWith from 'lodash.uniqwith';
import { deepEqual } from 'fast-equals';
import chunk from 'lodash.chunk';
import compose from 'promise-compose';
import { createSyncProducts } from '@commercetools/sync-actions';
import { actions as sdkActions } from '@commercetools-frontend/sdk';
import { isEmptyValue } from '@commercetools-local/utils/attributes';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import {
  ADD_BULK_UPDATE_SUCCESS,
  ADD_BULK_UPDATE_FAILURE,
  START_BULK_UPDATE,
  BULK_SET_SELECTED_ATTRIBUTES,
  BULK_TOGGLE_CONFIRMATION_DIALOG,
  BULK_LEAVE_BULK_UPDATE,
} from '../../constants';
import { selectCheckedProducts } from '../../reducers/products';
import {
  selectSelectedAttributes,
  selectAttributesToUpdate,
  updateModes,
} from '../../reducers/bulk';

const sync = createSyncProducts();

export function bulkUpdateProductAttributes(options = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedProducts = selectCheckedProducts(state);
    const { changedAttributes, commonAttributes } = options;
    const actionsPerProduct = selectedProducts.map(product => {
      const updatedProduct = updateProductWithAttributes(
        product,
        changedAttributes
      );
      return {
        id: product.id,
        version: product.version,
        actions: sync.buildActions(updatedProduct, product, {
          sameForAllAttributeNames: commonAttributes.map(attr => attr.name),
        }),
      };
    });
    dispatch({
      type: START_BULK_UPDATE,
      payload: selectedProducts.length,
    });
    // NOTE this chunk stuff does not work, since all promises will start
    // resolving right away anyways. It should be removed
    const chunkedActionPromises = chunk(actionsPerProduct, 5).map(
      actionsChunk =>
        Promise.all(
          actionsChunk.map(product =>
            dispatch(
              sdkActions.post({
                mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
                service: 'products',
                options: { id: product.id },
                payload: product,
              })
            ).then(
              () => {
                dispatch({
                  type: ADD_BULK_UPDATE_SUCCESS,
                  payload: product.id,
                });
              },
              err => {
                dispatch({
                  type: ADD_BULK_UPDATE_FAILURE,
                  payload: {
                    productId: product.id,
                    error: err,
                  },
                });
              }
            )
          )
        )
    );
    compose(...chunkedActionPromises)();
  };
}

export function leaveBulkUpdate() {
  return { type: BULK_LEAVE_BULK_UPDATE };
}

export function setAttributeUpdateMode({ attributeName, mode }) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedAttributes = selectSelectedAttributes(state);
    dispatch({
      type: BULK_SET_SELECTED_ATTRIBUTES,
      payload: {
        ...selectedAttributes,
        [attributeName]: {
          ...selectedAttributes[attributeName],
          mode,
        },
      },
    });
  };
}

export function removeEmptyAttributes(attributeDefinitions) {
  return (dispatch, getState) => {
    const state = getState();
    const attributesToUpdate = selectAttributesToUpdate(
      state,
      attributeDefinitions
    );
    dispatch({
      type: BULK_SET_SELECTED_ATTRIBUTES,
      payload: attributesToUpdate,
    });
  };
}

export function selectAttribute({ attributeName, attributeDefinitions }) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedAttributes = selectSelectedAttributes(state);
    dispatch({
      type: BULK_SET_SELECTED_ATTRIBUTES,
      payload: {
        ...selectedAttributes,
        [attributeName]: {
          value: undefined,
          mode: getDefaultAttributeUpdateMode(
            attributeName,
            attributeDefinitions
          ),
        },
      },
    });
  };
}

export function deselectAttribute({ attributeName }) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedAttributes = selectSelectedAttributes(state);
    dispatch({
      type: BULK_SET_SELECTED_ATTRIBUTES,
      payload: omit(selectedAttributes, attributeName),
    });
  };
}

export function setAttributeValue({ name, value }) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedAttributes = selectSelectedAttributes(state);
    dispatch({
      type: BULK_SET_SELECTED_ATTRIBUTES,
      payload: {
        ...selectedAttributes,
        [name]: {
          ...selectedAttributes[name],
          value,
        },
      },
    });
  };
}

export function toggleConfirmationDialog() {
  return {
    type: BULK_TOGGLE_CONFIRMATION_DIALOG,
  };
}

export function updateProductWithAttributes(product, selectedAttributes) {
  const attributeDefinitions = product.productType.obj.attributes;
  const updateVariantWithAttributes = createUpdateVariantWithAttributes(
    selectedAttributes,
    attributeDefinitions
  );
  return {
    ...product,
    masterVariant: updateVariantWithAttributes(product.masterVariant),
    variants: product.variants.map(variant =>
      updateVariantWithAttributes(variant)
    ),
  };
}

function createUpdateVariantWithAttributes(selectedAttributes, attrDefs) {
  const getAttributeDefinition = attrName =>
    attrDefs.find(attr => attr.name === attrName);

  // This function returns a new variant with the updated
  // attribute values.
  return variant => ({
    ...variant,
    attributes: [
      // Keep only original attributes that didn't change
      ...variant.attributes.filter(
        attr => !Object.keys(selectedAttributes).includes(attr.name)
      ),
      // TODO this should be done before this method can even be called
      // From the list of attributes that changed, keep / merge
      // only attribute with non-empty values.
      ...Object.keys(selectedAttributes)
        .filter(
          name =>
            !isEmptyValue(
              selectedAttributes[name].value,
              getAttributeDefinition(name).type.name
            )
        )
        .map(name => ({
          name,
          value:
            selectedAttributes[name].mode === updateModes.REMOVE_VALUES
              ? removeAttributeValues(
                  selectedAttributes[name].value,
                  name,
                  variant.attributes
                )
              : mergeAttributeValue(
                  selectedAttributes[name].value,
                  name,
                  variant.attributes
                ),
        })),
    ],
  });
}

function mergeAttributeValue(newValue, name, attributes) {
  if (Array.isArray(newValue)) {
    const originalAttribute = attributes.find(
      attribute => attribute.name === name
    );
    const originalValue = (originalAttribute && originalAttribute.value) || [];
    return uniqWith(originalValue.concat(newValue), deepEqual);
  }

  return newValue;
}

// This function is only used when the update mode is set to REMOVE_VALUES
// Since the update mode REMOVE_VALUES is only available for set attributes this
// function also only works with set attributes.
// It will first search for the attribute to update.
// Then it will remove any values from the attribute that are included in the
// list of values to remove
function removeAttributeValues(valuesToRemove, attributeName, attributes) {
  const originalAttribute = attributes.find(
    attribute => attribute.name === attributeName
  );
  const originalValues = (originalAttribute && originalAttribute.value) || [];
  let newValue = originalValues;
  if (Array.isArray(valuesToRemove))
    newValue = originalValues.filter(
      originalValue =>
        !valuesToRemove.some(value => deepEqual(value, originalValue))
    );

  return newValue;
}

// TODO: memoize
// This method determines the default modes for each type of
// attribute.
// For set attributes there are specific update modes which
// differ from the normal attribute updates.
// Since set attributes can have multiple values and the products
// we selected may have different values for a set attribute, using
// `update` as the default mode would result in overwriting all
// values. This could be an unexpected result. That's why by default
// the mode is set to `add values` so the user does not delete
// information by accident.
function getDefaultAttributeUpdateMode(name, attributeDefinitions) {
  const selectedAttribute = attributeDefinitions.find(
    attribute => attribute.name === name
  );
  switch (selectedAttribute.type.name) {
    case 'set':
      return updateModes.ADD_VALUES;
    default:
      return updateModes.UPDATE;
  }
}
