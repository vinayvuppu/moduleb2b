import React from 'react';
import { shallow } from 'enzyme';
import {
  StoresConnector,
  mapStoresDataToProps,
  mapStoresQueryToProps,
} from './stores-connector';

const createTestProps = custom => ({
  children: jest.fn().mockName('children'),
  fetchStoresQuery: {
    loading: false,
    stores: Array.from({ length: 2 }, (_, index) => ({
      key: `store-${index}`,
      name: {
        en: `Store ${index}`,
      },
    })),
  },
  ...custom,
});

describe('lifecycles', () => {
  let props;
  describe('on mount', () => {
    beforeEach(() => {
      props = createTestProps();
      shallow(<StoresConnector {...props} />);
    });
    it('should call children', () => {
      expect(props.children).toHaveBeenCalled();
    });
  });
});

describe('mapStoresQueryToProps', () => {
  const createTestQueryProps = custom => ({
    fetchStoresQuery: {
      loading: false,
      stores: {
        results: custom.stores || [],
      },
      ...custom,
    },
  });
  let query;
  describe('when loading', () => {
    beforeEach(() => {
      query = createTestQueryProps({ loading: true });
    });
    it('should return empty list as stores', () => {
      expect(mapStoresQueryToProps(query)).toEqual({
        fetchStoresQuery: {
          loading: true,
          stores: [],
        },
      });
    });
  });
});

describe('mapStoresDataToProps', () => {
  const storesData = {
    results: Array.from({ length: 2 }, (_, index) => ({
      key: `store-${index}`,
      nameAllLocales: [{ locale: 'en', value: 'foo' }],
    })),
  };

  it('should return value a list of stores with transformed name', () => {
    expect(mapStoresDataToProps(storesData)).toEqual([
      {
        key: 'store-0',
        name: { en: 'foo' },
      },
      {
        key: 'store-1',
        name: { en: 'foo' },
      },
    ]);
  });
});
