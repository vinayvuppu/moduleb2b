import { viewToDoc, docToView } from './conversions';

const createView = custom => ({
  id: 'test-id',
  name: {
    de: 'german name',
  },
  isActive: true,
  searchText: 'test-search',
  visibleColumns: ['columnA', 'columnB'],
  sorting: {
    key: 'createdAt',
    order: 'asc',
  },
  filters: {
    createdAt: [
      {
        type: 'equal',
        value: 'test-value',
      },
    ],
  },

  ...custom,
});

describe('`viewToDoc`', () => {
  let view;
  let doc;

  beforeEach(() => {
    view = createView();
    doc = viewToDoc(view);
  });

  it('should transform the `nameAllLocales`', () => {
    expect(doc).toHaveProperty(
      'nameAllLocales',
      expect.arrayContaining([
        {
          locale: 'de',
          value: view.name.de,
        },
      ])
    );
  });

  it('should have `search`', () => {
    expect(doc).toHaveProperty('search', view.searchText);
  });

  describe('with `visibleColumn`', () => {
    it('should have `table` with `visibleColumn`', () => {
      expect(doc).toHaveProperty(
        'table',
        expect.objectContaining({ visibleColumns: view.visibleColumns })
      );
    });
  });

  describe('without `visibleColumn`', () => {
    beforeEach(() => {
      view = createView({
        visibleColumns: null,
      });
      doc = viewToDoc(view);
    });

    it('should have `table` with empty `visibleColumn`', () => {
      expect(doc).toHaveProperty(
        'table',
        expect.objectContaining({ visibleColumns: [] })
      );
    });
  });

  it('should have `key` for `sort`', () => {
    expect(doc).toHaveProperty('sort.key', view.sorting.key);
  });

  it('should upper case the first letter `order` for `sort`', () => {
    expect(doc).toHaveProperty('sort.order', 'Asc');
  });

  describe('filters', () => {
    it('should upper case the filter `type`', () => {
      expect(doc).toHaveProperty(
        'filters',
        expect.arrayContaining([expect.objectContaining({ type: 'Equal' })])
      );
    });

    it('should map the `value` into the `json` property', () => {
      expect(doc).toHaveProperty(
        'filters',
        expect.arrayContaining([
          expect.objectContaining({ json: { value: 'test-value' } }),
        ])
      );
    });

    it('should have the `target`', () => {
      expect(doc).toHaveProperty(
        'filters',
        expect.arrayContaining([
          expect.objectContaining({ target: 'createdAt' }),
        ])
      );
    });
  });
});

describe('`docToView`', () => {
  let view;
  let doc;

  beforeEach(() => {
    doc = viewToDoc(createView());
    view = docToView(doc);
  });

  it('should transform the `nameAllLocales`', () => {
    expect(view).toHaveProperty(
      'name',
      expect.objectContaining({
        de: 'german name',
      })
    );
  });

  it('should have `id`', () => {
    expect(view).toHaveProperty('id', doc.id);
  });

  it('should have `searchText`', () => {
    expect(view).toHaveProperty('searchText', doc.search);
  });

  it('should have `key` for `sorting`', () => {
    expect(view).toHaveProperty('sorting.key', doc.sort.key);
  });

  it('should lowercase `order` for `sort`', () => {
    expect(view).toHaveProperty('sorting.order', 'asc');
  });

  it('should have `page`', () => {
    expect(view).toHaveProperty('page', 1);
  });

  it('should have `perPage`', () => {
    expect(view).toHaveProperty('perPage', 20);
  });

  it('should have `isActive`', () => {
    expect(view).toHaveProperty('isActive', doc.isActive);
  });

  it('should have `visibleColumns`', () => {
    expect(view).toHaveProperty('visibleColumns', doc.table.visibleColumns);
  });

  describe('filters', () => {
    it('should transform the filters to a keyed object', () => {
      expect(view).toHaveProperty('filters.createdAt');
    });

    it('should map the `value` from `json` property', () => {
      expect(view).toHaveProperty(
        'filters.createdAt',
        expect.arrayContaining([
          expect.objectContaining({ value: 'test-value' }),
        ])
      );
    });

    it('should lower the first letter of the `type`', () => {
      expect(view).toHaveProperty(
        'filters.createdAt',
        expect.arrayContaining([expect.objectContaining({ type: 'equal' })])
      );
    });
  });
});
