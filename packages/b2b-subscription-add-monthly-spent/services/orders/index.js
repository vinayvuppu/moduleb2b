const { client, requestBuilder } = require('../../plugins/commercetools');

const getOrder = async id => {
  try {
    const response = await client.execute({
      uri: requestBuilder.orders.parse({ id }).build(),
      method: 'GET'
    });

    return response.body;
  } catch (error) {
    console.error('getOrder error: ', error);
    throw error;
  }
};

module.exports = {
  getOrder
};
