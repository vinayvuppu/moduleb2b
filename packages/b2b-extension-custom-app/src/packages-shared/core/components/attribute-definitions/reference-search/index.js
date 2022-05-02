// Disabled reference-search for product due to inaccurate results coming
// from the API. We need to put the support for this type on hold atm
// import productConfig from './product'
import categoryConfig from './category';
import cartDiscountConfig from './cart-discount';
import createReferenceSearch from './reference-search';

// const ProductReferenceSearch = createReferenceSearch(productConfig)
export const CategoryReferenceSearch = createReferenceSearch(categoryConfig);
export const CartDiscountReferenceSearch = createReferenceSearch(
  cartDiscountConfig
);

export default function getReferenceSearchComponentByType(typeId) {
  switch (typeId) {
    case 'category':
      return CategoryReferenceSearch;
    case 'cart-discount':
      return createReferenceSearch(cartDiscountConfig);
    default:
      return undefined;
  }
}
