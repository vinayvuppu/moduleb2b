import {
  START_BULK_UPDATE,
  ADD_BULK_UPDATE_SUCCESS,
  ADD_BULK_UPDATE_FAILURE,
  BULK_SET_SELECTED_ATTRIBUTES,
} from '../../constants';
import * as actions from '../../actions/bulk-updates';
import reducer, {
  updateModes,
  initialState,
  selectSuccesfulBulkUpdatedProducts,
  selectFailedBulkUpdatedProducts,
  selectUnclearedEmptyAttributes,
  selectSelectedAttributes,
  selectShowConfirmationModal,
  selectAttributesToUpdate,
} from './bulk';

// TODO find a better way to do this
// the bulk reducer should not need to know in which context it is being used
const createBulkState = (bulk, currentQueryResult) => ({
  products: {
    bulk,
    currentQueryResult,
  },
});

const createSelectedProduct = id => ({
  id,
  name: { en: `product-${id}` },
  checked: true,
});

describe('reducer', () => {
  it('returns the correct initial state', () => {
    expect(reducer(undefined, {})).toBe(initialState);
  });

  it('should handle FINISH_BULK_UPDATE', () => {
    const action = actions.leaveBulkUpdate();
    const state = createBulkState({
      ...initialState,
      numberOfProductsToUpdate: 100,
      successfulUpdates: ['some-id'],
      selectedAttributes: {
        size: {
          value: 'M',
          mode: updateModes.UPDATE,
        },
        color: {
          value: 'green',
          mode: updateModes.UPDATE,
        },
        length: {
          value: null,
          mode: updateModes.CLEAR,
        },
      },
    });
    expect(reducer(state, action)).toBe(initialState);
  });

  describe('START_BULK_UPDATE', () => {
    const action = {
      type: START_BULK_UPDATE,
      payload: 100,
    };
    it('should set the number of products to update', () => {
      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        numberOfProductsToUpdate: 100,
        successfulUpdates: [],
        failedUpdates: [],
      });
    });
    it('should reset successful and failed updates lists', () => {
      expect(
        reducer(
          {
            numberOfProductsToUpdate: 2,
            successfulUpdates: ['product-id-1'],
            failedUpdates: ['product-id-2'],
          },
          action
        )
      ).toEqual({
        numberOfProductsToUpdate: 100,
        successfulUpdates: [],
        failedUpdates: [],
      });
    });
  });

  describe('ADD_BULK_UPDATE_SUCCESS', () => {
    it('should append the payload to successful updates', () => {
      const action = {
        type: ADD_BULK_UPDATE_SUCCESS,
        payload: 'product-id-123',
      };
      expect(
        reducer(
          {
            numberOfProductsToUpdate: 100,
            successfulUpdates: [],
            failedUpdates: [],
          },
          action
        )
      ).toEqual({
        numberOfProductsToUpdate: 100,
        successfulUpdates: ['product-id-123'],
        failedUpdates: [],
      });
    });
    it('should append the payload to successful updates (again)', () => {
      const action = {
        type: ADD_BULK_UPDATE_SUCCESS,
        payload: 'product-id-123',
      };
      expect(
        reducer(
          {
            numberOfProductsToUpdate: 100,
            successfulUpdates: ['product-id-1'],
            failedUpdates: [],
          },
          action
        )
      ).toEqual({
        numberOfProductsToUpdate: 100,
        successfulUpdates: ['product-id-1', 'product-id-123'],
        failedUpdates: [],
      });
    });
  });

  describe('ADD_BULK_UPDATE_FAILURE', () => {
    const action = {
      type: ADD_BULK_UPDATE_FAILURE,
      payload: 'product-id-123',
    };
    it('should append the payload to failed updates', () => {
      expect(
        reducer(
          {
            numberOfProductsToUpdate: 100,
            successfulUpdates: [],
            failedUpdates: [],
          },
          action
        )
      ).toEqual({
        numberOfProductsToUpdate: 100,
        successfulUpdates: [],
        failedUpdates: ['product-id-123'],
      });
    });
    it('should prepend the payload to failed updates (again)', () => {
      expect(
        reducer(
          {
            numberOfProductsToUpdate: 100,
            successfulUpdates: [],
            failedUpdates: ['product-id-1'],
          },
          action
        )
      ).toEqual({
        numberOfProductsToUpdate: 100,
        successfulUpdates: [],
        failedUpdates: ['product-id-1', 'product-id-123'],
      });
    });
  });

  describe('BULK_TOGGLE_CONFIRMATION_DIALOG', () => {
    it('should show the confirmation dialog', () => {
      const state = reducer(initialState, actions.toggleConfirmationDialog());
      expect(state.showConfirmationModal).toBe(true);
    });
    it('should hide the confirmation dialog', () => {
      const state = reducer(
        { ...initialState, showConfirmationModal: true },
        actions.toggleConfirmationDialog()
      );
      expect(state.showConfirmationModal).toBe(false);
    });
  });

  describe('BULK_SET_SELECTED_ATTRIBUTES', () => {
    it('should add size as a selected attribute', () => {
      const state = reducer(initialState, {
        type: BULK_SET_SELECTED_ATTRIBUTES,
        payload: {
          size: { value: null, mode: updateModes.UPDATE },
        },
      });
      expect(state.selectedAttributes).toEqual({
        size: { value: null, mode: updateModes.UPDATE },
      });
    });
    it('should add length as a selected attribute', () => {
      const state = reducer(initialState, {
        type: BULK_SET_SELECTED_ATTRIBUTES,
        payload: {
          size: { value: null, mode: updateModes.UPDATE },
          length: { value: null, mode: updateModes.UPDATE },
        },
      });
      expect(state.selectedAttributes).toEqual({
        size: { value: null, mode: updateModes.UPDATE },
        length: { value: null, mode: updateModes.UPDATE },
      });
    });
    it('should remove size and set length to 100', () => {
      const state = reducer(initialState, {
        type: BULK_SET_SELECTED_ATTRIBUTES,
        payload: {
          length: {
            value: 100,
            mode: updateModes.UPDATE,
          },
        },
      });
      expect(state.selectedAttributes).toEqual({
        length: { value: 100, mode: updateModes.UPDATE },
      });
    });
  });
});

describe('selectUnclearedEmptyAttributes', () => {
  const state = createBulkState({
    selectedAttributes: {
      size: { value: null, mode: updateModes.CLEAR },
      length: { value: null, mode: updateModes.CLEAR },
      color: { value: null, mode: updateModes.UPDATE },
      reviews: { value: null, mode: updateModes.UPDATE },
    },
  });
  const attributeDefinitions = [
    { name: 'size', type: { name: 'enum' } },
    { name: 'length', type: { name: 'text' } },
    { name: 'height', type: { name: 'text' } },
    { name: 'color', type: { name: 'enum' } },
    { name: 'reviews', type: { name: 'set' } },
  ];
  it('should return empty and uncleared color attributes', () => {
    expect(
      selectUnclearedEmptyAttributes(state, attributeDefinitions)
    ).toEqual(['color', 'reviews']);
  });
});

describe('selectSelectedAttributes', () => {
  const selectedAttributes = {
    size: { value: null, mode: updateModes.UPDATE },
    length: { value: null, mode: updateModes.UPDATE },
    color: { value: null, mode: updateModes.UPDATE },
  };
  const state = createBulkState({ selectedAttributes });

  it('should default the value and mode for each attribute', () => {
    expect(selectSelectedAttributes(state)).toBe(selectedAttributes);
  });
});

describe('selectShowConfirmationModal', () => {
  const state = createBulkState({
    showConfirmationModal: true,
  });
  it('should return the show confirmation modal state', () => {
    expect(selectShowConfirmationModal(state)).toBe(true);
  });
});

describe('selectSuccesfulBulkUpdatedProducts', () => {
  const productA = createSelectedProduct('product-id-1');
  const productB = createSelectedProduct('product-id-2');
  const state = createBulkState(
    { successfulUpdates: ['product-id-1', 'product-id-2'] },
    { results: [productA, productB] }
  );
  it('should return the successfully updated products', () => {
    expect(selectSuccesfulBulkUpdatedProducts(state)).toEqual([
      { product: productA },
      { product: productB },
    ]);
  });
});

describe('selectFailedBulkUpdatedProducts', () => {
  const productA = createSelectedProduct('product-id-1');
  const productB = createSelectedProduct('product-id-2');
  const state = createBulkState(
    {
      failedUpdates: [
        { productId: 'product-id-1', error: 'error1' },
        { productId: 'product-id-2', error: 'error2' },
      ],
    },
    {
      results: [productA, productB],
    }
  );
  it('should return the failed products and respective errors', () => {
    expect(selectFailedBulkUpdatedProducts(state)).toEqual([
      { product: productA, error: 'error1' },
      { product: productB, error: 'error2' },
    ]);
  });
});

describe('selectAttributesToUpdate', () => {
  const state = createBulkState({
    selectedAttributes: {
      size: { value: null, mode: updateModes.CLEAR },
      length: { value: null, mode: updateModes.CLEAR },
      color: { value: null, mode: updateModes.UPDATE },
      height: { value: '15', mode: updateModes.UPDATE },
      material: {
        value: [null, 'leather', undefined],
        mode: updateModes.UPDATE,
      },
      highlights: {
        value: [undefined, { en: 'awesome' }, null],
        mode: updateModes.UPDATE,
      },
      reviews: { value: [], mode: updateModes.UPDATE },
    },
  });
  const attributeDefinitions = [
    { name: 'size', type: { name: 'enum' } },
    { name: 'length', type: { name: 'text' } },
    { name: 'height', type: { name: 'text' } },
    { name: 'color', type: { name: 'enum' } },
    {
      name: 'material',
      type: {
        name: 'set',
        elementType: {
          name: 'enum',
        },
      },
    },
    {
      name: 'highlights',
      type: {
        name: 'set',
        elementType: {
          name: 'ltext',
        },
      },
    },
    {
      name: 'reviews',
      type: {
        name: 'set',
        elementType: {
          name: 'ltext',
        },
      },
    },
  ];

  const expectedResult = {
    size: { value: null, mode: updateModes.CLEAR },
    length: { value: null, mode: updateModes.CLEAR },
    height: { value: '15', mode: updateModes.UPDATE },
    material: {
      value: ['leather'],
      mode: updateModes.UPDATE,
    },
    highlights: {
      value: [{ en: 'awesome' }],
      mode: updateModes.UPDATE,
    },
  };
  // TODO could probably simply test resultFn of selector
  const actualResult = selectAttributesToUpdate(state, attributeDefinitions);
  it('should select only attributes with updates', () => {
    expect(actualResult).toEqual(expectedResult);
  });
});
