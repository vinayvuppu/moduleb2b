import { shallow } from 'enzyme';
import { createConfig } from './cart-discount';

const createConfigArgs = () => ({
  search: jest.fn(),
  getById: jest.fn(),
});

describe('shape', () => {
  it('should be correctly configured', () => {
    expect(createConfig(createConfigArgs())).toEqual({
      type: 'cart-discount',
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
      expect(configArgs.search).toHaveBeenCalledWith(apolloClient);
    });
  });
  describe('getItemById', () => {
    config.getItemById('some_id', apolloClient);
    it('should call the getById function', () => {
      expect(configArgs.getById).toHaveBeenCalledTimes(1);
      expect(configArgs.getById).toHaveBeenCalledWith(apolloClient, {
        cartDiscountId: 'some_id',
      });
    });
  });
  describe('mapItemToOption', () => {
    const cartDiscount = {
      id: 'something',
      name: { en: 'some english name' },
    };
    const expected = { value: 'something', label: 'some english name' };
    const actual = config.mapItemToOption(cartDiscount, { language: 'en' });

    it('should map to the label from the appropriate language', () => {
      expect(actual).toEqual(expected);
    });
  });
  describe('renderItem', () => {
    let cartDiscount;
    beforeEach(() => {
      cartDiscount = {
        name: { en: 'some english name' },
      };
    });
    it('should render a cart discount', () => {
      const wrapper = shallow(
        config.renderItem(cartDiscount, {
          language: 'en',
          formatMessage: v => v.defaultMessage,
        })
      );
      expect(
        wrapper
          .find({ 'data-testid': 'cart-discount-option' })
          .children()
          .children()
          .text()
      ).toBe('some english name');
    });
  });
});
