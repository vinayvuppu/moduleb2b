import { cleanDefaultShippingAndBilling } from './converter';

const fetchResource = async (url, { method = 'GET', headers, body } = {}) => {
  const response = await fetch(url, {
    method,
    ...(headers && { headers }),
    ...(body && { body: JSON.stringify(body) }),
  });
  const data = await response.json();

  if (response.ok) {
    return data;
  }
  throw data;
};

export const getCompanies = async ({ url, query }) => {
  let queryString;
  if (query) {
    queryString = `?${Object.keys(query)
      .map(key => `${key}=${query[key]}`)
      .join('&')}`;
  }
  return fetchResource(`${url}${queryString || ''}`);
};

export const getCompany = async ({ url, id }) => {
  return fetchResource(`${url}/${id}`);
};

export const deleteCompany = async ({ url, id }) => {
  return fetchResource(`${url}/${id}`, { method: 'DELETE' });
};

export const createCompany = async ({ url, payload }) => {
  return fetchResource(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
};

export const updateCompany = async ({ url, payload }) => {
  return fetchResource(`${url}/${payload.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: cleanDefaultShippingAndBilling(payload),
  });
};

export const setDefaultBillingAddress = async ({ url, id, addressId }) => {
  return fetchResource(`${url}/${id}/setDefaultBillingAddress`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { addressId },
  });
};

export const setDefaultShippingAddress = async ({ url, id, addressId }) => {
  return fetchResource(`${url}/${id}/setDefaultShippingAddress`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { addressId },
  });
};
