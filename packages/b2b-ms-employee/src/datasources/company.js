const { RESTDataSource } = require('apollo-datasource-rest');

class Company extends RESTDataSource {
  constructor({ url }) {
    super();
    this.baseURL = url;
  }

  willSendRequest() {}

  async getCompany(id) {
    return this.get(`${id}`);
  }
}
module.exports = {
  Company
};
