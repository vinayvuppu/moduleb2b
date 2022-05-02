require('dotenv').config();

const BPromise = require('bluebird');

const {
  getAllProducts
} = require('./commercetools/services/product-projections')();

const { updateProduct } = require('./commercetools/services/products')();

const { findCompanies, getCompany } = require('./companies');

const run = async () => {
  const companiesResponse = await findCompanies({ all: true });

  const productsResponse = await getAllProducts();

  const companies = (
    await BPromise.map(
      companiesResponse.results,
      company => getCompany(company.id),
      {
        concurrency: 5
      }
    )
  ).filter(company => company.customerGroup !== undefined);

  const groups = Math.ceil(productsResponse.total / companies.length) - 1;

  const companiesProducts = companies.map((company, index) => ({
    company,
    products: productsResponse.results.slice(
      index * groups,
      index * groups + groups
    )
  }));

  const actions = [];
  companiesProducts.forEach(companyProduct => {
    const { company, products } = companyProduct;

    products.forEach(product => {
      const productActions = [];
      [product.masterVariant, ...product.variants].forEach(variant => {
        const price = variant.prices.find(
          pr => pr.value.currencyCode === 'USD'
        ); // just the first price for now

        if (price) {
          productActions.push({
            action: 'changePrice',
            priceId: price.id,
            staged: false,
            price: {
              ...price,
              customerGroup: {
                typeId: 'customer-group',
                id: company.customerGroup.id
              }
            }
          });
        }
      });
      actions.push({
        product: product.id,
        version: product.version,
        actions: productActions
      });
    });
  });

  await BPromise.map(
    actions,
    action => {
      console.log('Updating product', action.product);
      return updateProduct({
        id: action.product,
        version: action.version,
        actions: action.actions
      }).catch(error => {
        console.log(JSON.stringify(error, null, 4));
      });
    },
    {
      concurrency: 10
    }
  );
};

return run();
