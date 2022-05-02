const fetch = require('node-fetch');

const COMPANY_MS_URL = process.env.COMPANY_MS_URL;

const fetchResource = async (url, { method = 'GET', headers, body } = {}) => {
  const response = await fetch(url, {
    method,
    ...(headers && { headers }),
    ...(body && { body: JSON.stringify(body) })
  });
  const data = await response.json();

  if (response.ok) {
    return data;
  }
  throw data;
};

const createCompany = async companyDraft => {
  return fetchResource(COMPANY_MS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: companyDraft
  }).catch(err => {
    console.log('Error creating company', err);
  });
};

const removeCompany = async id => {
  console.log(`${COMPANY_MS_URL}/${id}`);
  return fetchResource(`${COMPANY_MS_URL}/${id}`, {
    method: 'DELETE'
  }).catch(err => {
    console.log('Error removing company', err);
  });
};

const findCompanies = async query => {
  let queryString = '';
  if (query) {
    queryString = `?${Object.keys(query)
      .map(key => `${key}=${query[key]}`)
      .join('&')}`;
  }
  return fetchResource(`${COMPANY_MS_URL}${queryString || ''}`);
};

const getCompany = async id => {
  console.log(`${COMPANY_MS_URL}/${id}`);
  return fetchResource(`${COMPANY_MS_URL}/${id}`, {
    method: 'GET'
  }).catch(err => {
    console.log('Error removing company', err);
  });
};

module.exports = {
  getCompany,
  createCompany,
  findCompanies,
  removeCompany
};
