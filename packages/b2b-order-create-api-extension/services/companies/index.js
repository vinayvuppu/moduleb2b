/* eslint-disable no-console */

const fetch = require('node-fetch');
const functions = require('firebase-functions');
const {
  company: { url }
} = functions.config();

const getCompany = async id => {
  try {
    const response = await fetch(`${url}/${id}`);
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getCompany
};
