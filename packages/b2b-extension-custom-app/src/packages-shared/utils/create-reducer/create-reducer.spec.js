import createReducer from './create-reducer';

describe('utility functions', () => {
  describe('create a reducer', () => {
    const actionHandlers = {
      ADD_TODO: (state, action) => {
        const todos = state.todos.slice();
        todos.push(action.payload);
        return {
          ...state,
          count: todos.length,
          todos,
        };
      },
    };
    const initialState = { count: 0, todos: [] };
    const reducer = createReducer(initialState, actionHandlers);

    const state1 = reducer(initialState, {
      type: 'ADD_TODO',
      payload: { id: '1', message: 'Hello' },
    });
    const state2 = reducer(state1, {
      type: 'ADD_TODO',
      payload: { id: '2', message: 'World' },
    });

    it('should update with first state', () => {
      expect(state1).toEqual({
        count: 1,
        todos: [{ id: '1', message: 'Hello' }],
      });
    });

    it('should update with second state', () => {
      expect(state2).toEqual({
        count: 2,
        todos: [
          { id: '1', message: 'Hello' },
          { id: '2', message: 'World' },
        ],
      });
    });
  });
});
