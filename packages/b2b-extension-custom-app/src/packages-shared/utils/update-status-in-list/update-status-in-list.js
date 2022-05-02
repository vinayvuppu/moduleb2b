export default function updateStatusInList(mergeData) {
  return (state, { payload }) => {
    const {
      currentQueryResult: { results },
    } = state;
    const index = results.findIndex(p => p.id === payload.id);
    results[index] = mergeData(payload, results[index]);
    results[index].checked = false;
    return {
      currentQueryResult: {
        ...state.currentQueryResult,
        results,
      },
    };
  };
}
