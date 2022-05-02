const { createRequestBuilder } = require('@commercetools/api-request-builder');
const client = require('../client');

const getQueryParams = query => {
  const { where, whereOperator, expand, page, perPage } = query || {};
  let { sort, sortBy, sortDirection } = query || {};
  if (!sort || !sort.length) {
    sort = [];
  }
  if (sortBy) {
    sort.push({ by: sortBy, direction: sortDirection });
  }

  return {
    where: [...(where && where.length ? where : [])],
    sort,
    ...(whereOperator && { whereOperator }),
    ...(page && { page: parseInt(page, 10) }),
    ...(perPage && { perPage: parseInt(perPage, 10) }),
    expand: [...(expand && expand.length ? expand : [])]
  };
};

const createFind = entity => query => {
  const projectKey = process.env.CT_PROJECT_KEY;
  const service = createRequestBuilder({ projectKey })[entity];

  const getRequest = {
    uri: service.parse(getQueryParams(query)).build(),
    method: 'GET'
  };
  return client.execute(getRequest).then(response => response.body);
};

const createFindAll = entity => async query => {
  const find = createFind(entity);

  const perPage = 500; // Max number of items per request in commercetools
  const params = {
    ...query,
    page: 1,
    perPage
  };

  const response = await find(params);
  const { results, total } = response;

  if (total > perPage) {
    const pagesLeft = Math.ceil(total / perPage) - 1;
    const requests = [...Array(pagesLeft).keys()].map((currentValue, index) =>
      find({ ...params, page: index + 2 })
    );
    const responses = await Promise.all(requests);

    return {
      total,
      limit: total,
      offset: 0,
      count: total,
      results: [
        ...results,
        ...responses.reduce(
          (accumulator, currentValue) => [
            ...accumulator,
            ...currentValue.results
          ],
          []
        )
      ]
    };
  }

  return response.results;
};

const createDeleteEntity = entity => ({ id, version }) => {
  const projectKey = process.env.CT_PROJECT_KEY;
  const service = createRequestBuilder({ projectKey })[entity];

  const request = {
    uri: service.parse({ id, version }).build(),
    method: 'DELETE'
  };

  return client.execute(request).then(response => response.body);
};

const createUpdateEntity = entity => ({ id, version, actions }) => {
  const projectKey = process.env.CT_PROJECT_KEY;
  const service = createRequestBuilder({ projectKey })[entity];

  const request = {
    uri: service.parse({ id, version }).build(),
    method: 'POST',
    body: JSON.stringify({ version, actions })
  };

  return client.execute(request).then(response => response.body);
};

const createAddEntity = entity => draft => {
  const projectKey = process.env.CT_PROJECT_KEY;
  const service = createRequestBuilder({ projectKey })[entity];

  const getRequest = {
    uri: service.parse({}).build(),
    method: 'POST',
    body: JSON.stringify(draft)
  };
  return client
    .execute(getRequest)
    .then(response => response.body)
    .catch(err => console.log(`Error creating ${entity}`, JSON.stringify(err)));
};

const createService = entity => {
  return {
    getAll: createFindAll(entity),
    findEntity: createFind(entity),
    deleteEntity: createDeleteEntity(entity),
    createEntity: createAddEntity(entity),
    updateEntity: createUpdateEntity(entity)
  };
};

module.exports = createService;
