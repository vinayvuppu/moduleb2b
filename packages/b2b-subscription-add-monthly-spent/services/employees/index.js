const { client, requestBuilder } = require('../../plugins/commercetools');

const getEmployee = async id => {
  try {
    const response = await client.execute({
      uri: requestBuilder.customers.parse({ id }).build(),
      method: 'GET'
    });

    return response.body;
  } catch (error) {
    console.error('getEmployee error: ', error);
    throw error;
  }
};

const updateEmployee = async (id, actions, version) => {
  try {
    const response = await client.execute({
      uri: requestBuilder.customers.parse({ id }).build(),
      method: 'POST',
      body: {
        version,
        actions
      }
    });

    return response.body;
  } catch (error) {
    console.error('updateEmployee error: ', error);
    throw error;
  }
};

module.exports = {
  getEmployee,
  updateEmployee
};
