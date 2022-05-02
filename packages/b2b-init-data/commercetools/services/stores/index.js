const client = require('../../client');

module.exports = () => {
  const getAllStores = () => {
    const projectKey = process.env.CT_PROJECT_KEY;

    const getRequest = {
      uri: `/${projectKey}/stores`,
      method: 'GET'
    };
    return client.execute(getRequest).then(response => response.body.results);
  };

  const deleteStore = ({ id, version }) => {
    const projectKey = process.env.CT_PROJECT_KEY;

    const getRequest = {
      uri: `/${projectKey}/stores/${id}?version=${version}`,
      method: 'DELETE'
    };
    return client.execute(getRequest).then(response => response.body);
  };

  return {
    getAllStores: getAllStores,
    deleteStore: deleteStore
    // createStore: createStore
  };
};
