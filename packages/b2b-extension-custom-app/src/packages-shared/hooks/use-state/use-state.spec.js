import { createStateFetcherQueryVariables, useStateFetcher } from './use-state';

jest.mock('react-apollo', () => {
  return {
    useQuery: (query, options) => {
      if (options.variables.where === 'key="loading"') {
        return {
          loading: true,
          refetch: jest.fn(),
          data: undefined,
        };
      }
      return {
        loading: false,
        refetch: jest.fn(),
        data: {
          states: {
            total: 1,
            results: [
              {
                id: 'state-id-1',
              },
            ],
          },
        },
      };
    },
  };
});

describe('createStateFetcherQueryVariables', () => {
  it('should return the query variables', () => {
    expect(
      createStateFetcherQueryVariables({ stateKey: 'state-key-1' })
    ).toEqual({ target: 'ctp', where: 'key="state-key-1"' });
  });
});

describe('useStateFetcher', () => {
  describe('when is loading', () => {
    it('should return the data', () => {
      expect(useStateFetcher({ stateKey: 'loading' })).toEqual({
        isLoading: true,
        refetch: expect.any(Function),
        state: undefined,
      });
    });
  });
  describe('when is loaded', () => {
    it('should return the data', () => {
      expect(useStateFetcher({ stateKey: 'state-key-1' })).toEqual({
        isLoading: false,
        refetch: expect.any(Function),
        state: { id: 'state-id-1' },
      });
    });
  });
});
