import {
  convertApolloNetworkStatusToLoadingState,
  convertApolloQueryDataToConnectorData,
} from './connector';

describe('convertApolloNetworkStatusToLoadingState', () => {
  describe('when networkStatus is 1 (loading)', () => {
    it('should match', () => {
      expect(convertApolloNetworkStatusToLoadingState(1)).toEqual({
        activelyRefetching: false,
        fetchingMore: false,
        initialLoading: true,
        passivelyRefetching: false,
      });
    });
  });
  describe('when networkStatus is 2 (setVariables)', () => {
    it('should match', () => {
      expect(convertApolloNetworkStatusToLoadingState(2)).toEqual({
        activelyRefetching: false,
        fetchingMore: false,
        initialLoading: false,
        passivelyRefetching: true,
      });
    });
  });
  describe('when networkStatus is 3 (fetchMore)', () => {
    it('should match', () => {
      expect(convertApolloNetworkStatusToLoadingState(3)).toEqual({
        activelyRefetching: false,
        fetchingMore: true,
        initialLoading: false,
        passivelyRefetching: false,
      });
    });
  });
  describe('when networkStatus is 4 (refetch)', () => {
    it('should match', () => {
      expect(convertApolloNetworkStatusToLoadingState(4)).toEqual({
        activelyRefetching: true,
        fetchingMore: false,
        initialLoading: false,
        passivelyRefetching: false,
      });
    });
  });
  describe('when networkStatus is 5 (unused)', () => {
    it('should match', () => {
      expect(convertApolloNetworkStatusToLoadingState(5)).toEqual({
        activelyRefetching: false,
        fetchingMore: false,
        initialLoading: false,
        passivelyRefetching: false,
      });
    });
  });
  describe('when networkStatus is 6 (poll)', () => {
    it('should match', () => {
      expect(convertApolloNetworkStatusToLoadingState(6)).toEqual({
        activelyRefetching: false,
        fetchingMore: false,
        initialLoading: false,
        passivelyRefetching: true,
      });
    });
  });
  describe('when networkStatus is 7 (ready)', () => {
    it('should match', () => {
      expect(convertApolloNetworkStatusToLoadingState(7)).toEqual({
        activelyRefetching: false,
        fetchingMore: false,
        initialLoading: false,
        passivelyRefetching: false,
      });
    });
  });
  describe('when networkStatus is 8 (error)', () => {
    it('should match', () => {
      expect(convertApolloNetworkStatusToLoadingState(8)).toEqual({
        activelyRefetching: false,
        fetchingMore: false,
        initialLoading: false,
        passivelyRefetching: false,
      });
    });
  });
});

describe('convertApolloQueryDataToConnectorData', () => {
  describe('when mapData is passed', () => {
    const fooData = { bar: true };
    let mapData;
    let result;
    beforeEach(() => {
      mapData = jest.fn(data => ({ mapped: data }));
      result = convertApolloQueryDataToConnectorData(
        {
          loading: true,
          networkStatus: 1,
          error: null,
          foo: fooData,
        },
        'foo',
        { mapData }
      );
    });
    it('should apply mapData', () => {
      expect(result).toEqual({
        error: null,
        foo: { mapped: fooData },
        isLoading: true,
        loadingState: {
          activelyRefetching: false,
          fetchingMore: false,
          initialLoading: true,
          passivelyRefetching: false,
        },
      });
    });
    it('should call mapData', () => {
      expect(mapData).toHaveBeenCalledTimes(1);
    });
  });
  describe('when loading', () => {
    it('should match', () => {
      expect(
        convertApolloQueryDataToConnectorData(
          {
            loading: true,
            networkStatus: 1,
            error: null,
            foo: {},
          },
          'foo'
        )
      ).toEqual({
        error: null,
        foo: {},
        isLoading: true,
        loadingState: {
          activelyRefetching: false,
          fetchingMore: false,
          initialLoading: true,
          passivelyRefetching: false,
        },
      });
    });
  });
  describe('when error is present', () => {
    it('should have an error', () => {
      expect(
        convertApolloQueryDataToConnectorData(
          {
            loading: true,
            networkStatus: 4,
            error: {},
            foo: null,
          },
          'foo'
        )
      ).toEqual({
        error: {},
        foo: null,
        isLoading: true,
        loadingState: {
          activelyRefetching: true,
          fetchingMore: false,
          initialLoading: false,
          passivelyRefetching: false,
        },
      });
    });
  });
});
