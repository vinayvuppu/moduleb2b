import createReducer from '../create-reducer';
import updateStatusInList from '../update-status-in-list';

const identity = value => value;
export default function createResourceReducer(options) {
  const {
    constantsPrefix: { plural, single },
    customHandlers,
    initialState: extendInitialState = {},
  } = options;
  const mergeData = options.mergeData || identity;

  const initialState = {
    currentQueryResult: { count: 0, offset: 0, total: 0, results: [] },
    currentVisible: null,
    ...extendInitialState,
  };

  // TODO: validate constant keys
  const actionsMap = {
    [`${plural}_FETCHED`]: (_, action) => ({
      currentQueryResult: action.payload,
    }),

    [`${single}_UPDATED_IN_LIST`]: updateStatusInList(mergeData),

    [`${single}_DELETED_IN_LIST`]: (state, { payload }) => {
      const {
        currentQueryResult: { results },
      } = state;
      return {
        currentQueryResult: {
          ...state.currentQueryResult,
          results: results.filter(({ id }) => id !== payload.id),
        },
      };
    },

    [`${single}_FETCHED`]: (_, { payload }) => ({ currentVisible: payload }),

    [`${single}_CREATED`]: ({ currentVisible }, { payload }) => ({
      currentVisible: mergeData(payload, currentVisible),
    }),

    [`${single}_UPDATED`]: ({ currentVisible }, { payload }) => ({
      currentVisible: mergeData(payload, currentVisible),
    }),

    [`${single}_DELETED`]: () => ({ currentVisible: null }),
  };

  return createReducer(initialState, Object.assign(actionsMap, customHandlers));
}
