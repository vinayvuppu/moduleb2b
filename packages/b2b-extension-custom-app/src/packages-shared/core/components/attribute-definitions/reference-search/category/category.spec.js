import { shallow } from 'enzyme';
import { createConfig } from './category';

const createConfigArgs = () => ({
  search: jest.fn(),
  getById: jest.fn(),
});

describe('shape', () => {
  it('should be correctly configured', () => {
    expect(createConfig(createConfigArgs())).toEqual({
      type: 'category',
      loadItems: expect.any(Function),
      getItemById: expect.any(Function),
      mapItemToOption: expect.any(Function),
      renderItem: expect.any(Function),
      labels: expect.any(Object),
      filterOption: expect.any(Function),
    });
  });
});

describe('callbacks', () => {
  const configArgs = createConfigArgs();
  const config = createConfig(configArgs);
  const apolloClient = {};
  describe('loadItems', () => {
    config.loadItems('some_text', 'en', apolloClient);

    it('should call the search function', () => {
      expect(configArgs.search).toHaveBeenCalledTimes(1);
      expect(configArgs.search).toHaveBeenCalledWith(apolloClient, {
        searchText: 'some_text',
        language: 'en',
      });
    });
  });
  describe('getItemById', () => {
    config.getItemById('some_id', apolloClient);
    it('should call the getById function', () => {
      expect(configArgs.getById).toHaveBeenCalledTimes(1);
      expect(configArgs.getById).toHaveBeenCalledWith(apolloClient, {
        categoryId: 'some_id',
      });
    });
  });
  describe('mapItemToOption', () => {
    const category = {
      id: 'something',
      name: { en: 'some english name' },
    };
    const expected = { value: 'something', label: 'some english name' };
    const actual = config.mapItemToOption(category, { language: 'en' });
    it('should map to the label with the appropriate language', () => {
      expect(actual).toEqual(expected);
    });
  });
  describe('renderItem', () => {
    let category;
    describe('without parent', () => {
      beforeEach(() => {
        category = {
          name: { en: 'some english name' },
          slug: { en: 'some_slug' },
          externalId: 'some_external_id',
        };
      });
      it('should render a category (without parent)', () => {
        const wrapper = shallow(
          config.renderItem(category, {
            language: 'en',
            formatMessage: v => v.defaultMessage,
          })
        );
        expect(wrapper.find('strong').text()).toBe('some english name');
        expect(
          wrapper
            .find('div')
            .at(1)
            .text()
        ).toBe('Slug: some_slug');
        expect(
          wrapper
            .find('div')
            .at(2)
            .text()
        ).toBe('External ID: some_external_id');
      });
    });
    describe('with parent', () => {
      beforeEach(() => {
        category = {
          name: { en: 'some english name' },
          slug: { en: 'some_slug' },
          externalId: 'some_external_id',
          parent: { name: { en: 'some_parent_name' } },
        };
      });
      it('should render a category (with parent)', () => {
        const wrapper = shallow(
          config.renderItem(category, {
            language: 'en',
            formatMessage: v => v.defaultMessage,
          })
        );
        expect(wrapper.find('strong').text()).toBe('some english name');
        expect(
          wrapper
            .find('div')
            .at(1)
            .text()
        ).toBe('Parent Category: some_parent_name');
        expect(
          wrapper
            .find('div')
            .at(2)
            .text()
        ).toBe('Slug: some_slug');
        expect(
          wrapper
            .find('div')
            .at(3)
            .text()
        ).toBe('External ID: some_external_id');
      });
    });
  });
});
