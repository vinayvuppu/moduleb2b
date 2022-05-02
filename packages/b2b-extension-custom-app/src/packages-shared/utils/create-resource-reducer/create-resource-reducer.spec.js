import createResourceReducer from './create-resource-reducer';

describe('`createResourceReducer`', () => {
  let resourceReducer;
  let state;
  let action;
  let nextState;
  let mergeData;
  beforeEach(() => {
    resourceReducer = createResourceReducer({
      constantsPrefix: {
        plural: 'PRODUCTS',
        single: 'PRODUCT',
      },
    });
  });
  describe('with no state', () => {
    beforeEach(() => {
      nextState = resourceReducer();
    });
    it('should return initial state', () => {
      expect(nextState).toEqual({
        currentQueryResult: {
          total: 0,
          count: 0,
          results: [],
          offset: 0,
        },
        currentVisible: null,
      });
    });
  });
  describe('FETCHED', () => {
    describe('single', () => {
      beforeEach(() => {
        action = {
          type: 'PRODUCT_FETCHED',
          payload: { id: 'foo' },
        };
        nextState = resourceReducer(state, action);
      });
      it('should return nextState for `currentVisible`', () => {
        expect(nextState).toEqual({
          currentQueryResult: {
            total: 0,
            offset: 0,
            count: 0,
            results: [],
          },
          currentVisible: action.payload,
        });
      });
    });
    describe('plural', () => {
      beforeEach(() => {
        action = {
          type: 'PRODUCTS_FETCHED',
          payload: {
            results: [{ id: 'foo' }],
          },
        };
        nextState = resourceReducer(state, action);
      });
      it('should return nextState for `currentQueryResult`', () => {
        expect(nextState).toEqual({
          currentVisible: null,
          currentQueryResult: action.payload,
        });
      });
    });
  });
  describe('PRODUCT_CREATED', () => {
    describe('with custom `mergeData`', () => {
      beforeEach(() => {
        mergeData = jest.fn(value => value);
        resourceReducer = createResourceReducer({
          constantsPrefix: {
            plural: 'PRODUCTS',
            single: 'PRODUCT',
          },
          mergeData,
        });
        state = { currentVisible: { id: 'visible-foo' } };
        action = { type: 'PRODUCT_CREATED', payload: { id: 'foo' } };
        nextState = resourceReducer(state, action);
      });
      it('should call `mergeData`', () => {
        expect(mergeData).toHaveBeenCalledTimes(1);
      });
      it('should call `mergeData` with `payload` and `state.currentVisible`', () => {
        expect(mergeData).toHaveBeenCalledWith(
          action.payload,
          state.currentVisible
        );
      });
    });
  });
  describe('PRODUCT_UPDATED', () => {
    describe('with custom `mergeData`', () => {
      beforeEach(() => {
        mergeData = jest.fn(value => value);
        resourceReducer = createResourceReducer({
          constantsPrefix: {
            plural: 'PRODUCTS',
            single: 'PRODUCT',
          },
          mergeData,
        });
        state = { currentVisible: { id: 'visible-foo' } };
        action = { type: 'PRODUCT_UPDATED', payload: { id: 'foo' } };
        nextState = resourceReducer(state, action);
      });
      it('should call `mergeData`', () => {
        expect(mergeData).toHaveBeenCalledTimes(1);
      });
      it('should call `mergeData` with `payload` and `state.currentVisible`', () => {
        expect(mergeData).toHaveBeenCalledWith(
          action.payload,
          state.currentVisible
        );
      });
    });
  });
  describe('PRODUCT_DELETED', () => {
    describe('with state', () => {
      beforeEach(() => {
        state = { currentVisible: { id: 'visible-foo' } };
        action = { type: 'PRODUCT_DELETED' };
        nextState = resourceReducer(state, action);
      });
      it('should return nextState with empty `currentVisible`', () => {
        expect(nextState).toEqual({
          currentVisible: null,
        });
      });
    });
    describe('without state', () => {
      beforeEach(() => {
        state = undefined;
        action = { type: 'PRODUCT_DELETED' };
        nextState = resourceReducer(state, action);
      });
      it('should return initial state', () => {
        expect(nextState).toEqual({
          currentVisible: null,
          currentQueryResult: expect.any(Object),
        });
      });
    });
  });
});
