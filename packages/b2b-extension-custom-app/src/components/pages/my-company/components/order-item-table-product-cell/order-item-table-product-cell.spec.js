import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { OrderItemTableProductCell } from './order-item-table-product-cell';

const createTestProps = props => ({
  lineItem: {
    id: 'line-item-id-1',
    name: {
      en: 'new product',
    },
    productId: 'product-id',
    variant: {
      sku: 'some-sku',
      images: [
        {
          url: 'some-image-url',
        },
      ],
    },
  },
  isCustomLineItem: false,
  language: 'en',
  languages: ['en', 'de', 'fr'],

  ...props,
});

describe('render', () => {
  describe('when the item is a line item', () => {
    describe('image', () => {
      describe('when image passed', () => {
        let props;
        let wrapper;
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<OrderItemTableProductCell {...props} />);
        });
        it('should render the ImageContainer component', () => {
          expect(wrapper).toRender('ImageContainer');
        });
        it('should render the variant image', () => {
          expect(wrapper.find('ImageContainer')).toHaveProp(
            'url',
            props.lineItem.variant.images[0].url
          );
        });
      });

      describe('when no image passed', () => {
        let props;
        let wrapper;
        beforeEach(() => {
          props = createTestProps({
            lineItem: {
              id: 'line-item-id-1',
              name: {
                en: 'new product',
              },
              productId: 'product-id',
              variant: {
                sku: 'some-sku',
                images: [],
              },
            },
            isCustomLineItem: false,
          });
          wrapper = shallow(<OrderItemTableProductCell {...props} />);
        });
        it('should render the ImageContainer', () => {
          expect(wrapper).toRender('ImageContainer');
        });
        it('should render the default image', () => {
          expect(wrapper.find('ImageContainer')).toHaveProp(
            'url',
            'test-file-stub'
          );
        });
      });
    });
    describe('product name', () => {
      describe('when the name does not require to be truncated', () => {
        let props;
        let wrapper;
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<OrderItemTableProductCell {...props} />);
        });
        it('should render the product name value', () => {
          expect(wrapper.find('span')).toHaveText('new product');
        });
      });
      describe('when the name is too long', () => {
        let props;
        let wrapper;
        beforeEach(() => {
          props = createTestProps({
            lineItem: {
              id: 'line-item-id-1',
              name: {
                en:
                  'new product with a very very very long name that should be truncated',
              },
              productId: 'product-id',
              variant: {
                sku: 'some-sku',
                images: [
                  {
                    url: 'some-image-url',
                  },
                ],
              },
            },
            isCustomLineItem: false,
          });
          wrapper = shallow(<OrderItemTableProductCell {...props} />);
        });
        it('should render the product name value truncated', () => {
          expect(wrapper.find('span')).toHaveText(
            'new product with a very very v...'
          );
        });
      });
    });
    describe('sku section', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<OrderItemTableProductCell {...props} />);
      });
      it('should render the sku message', () => {
        expect(wrapper).toRender(FormattedMessage);
      });
      it('should pass the sku as value to render the message', () => {
        expect(wrapper.find(FormattedMessage)).toHaveProp('values', {
          sku: props.lineItem.variant.sku,
        });
      });
    });
  });
  describe('when the item is a custom line item', () => {
    describe('image', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          lineItem: {
            id: 'line-item-id-1',
            name: {
              en: 'custom new product',
            },
          },
          isCustomLineItem: true,
        });
        wrapper = shallow(<OrderItemTableProductCell {...props} />);
      });
      it('should render the ImageContainer component', () => {
        expect(wrapper).toRender('ImageContainer');
      });
      it('should render the default image', () => {
        expect(wrapper.find('ImageContainer')).toHaveProp(
          'url',
          'test-file-stub'
        );
      });
    });

    describe('product name', () => {
      describe('when the name does not require to be truncated', () => {
        let props;
        let wrapper;
        beforeEach(() => {
          props = createTestProps({
            lineItem: {
              id: 'line-item-id-1',
              name: {
                en: 'custom new product',
              },
            },
            isCustomLineItem: true,
          });
          wrapper = shallow(<OrderItemTableProductCell {...props} />);
        });
        it('should render the product name value', () => {
          expect(wrapper.find('span')).toHaveText('custom new product');
        });
      });
      describe('when the name is too long', () => {
        let props;
        let wrapper;
        beforeEach(() => {
          props = createTestProps({
            lineItem: {
              id: 'line-item-id-1',
              name: {
                en:
                  'custom new product with a very very very long name that should be truncated',
              },
            },
            isCustomLineItem: true,
          });
          wrapper = shallow(<OrderItemTableProductCell {...props} />);
        });
        it('should render the product name value truncated', () => {
          expect(wrapper.find('span')).toHaveText(
            'custom new product with a very...'
          );
        });
      });
    });
    describe('sku section', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          lineItem: {
            id: 'line-item-id-1',
            name: {
              en: 'custom new product',
            },
          },
          isCustomLineItem: true,
        });
        wrapper = shallow(<OrderItemTableProductCell {...props} />);
      });
      it('should not render the sku message', () => {
        expect(wrapper).not.toRender(FormattedMessage);
      });
    });
  });
});
