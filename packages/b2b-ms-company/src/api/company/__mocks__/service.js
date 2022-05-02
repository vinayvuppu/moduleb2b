/* eslint-disable no-unused-vars */
const service = jest.genMockFromModule('../service');

module.exports = () => {
  service.find = query =>
    jest.fn().mockResolvedValue(query.name === '404' ? {} : undefined);
  service.get = id => (id !== '404' ? { id } : undefined);
  service.create = draft =>
    jest.fn().mockResolvedValue(draft !== '500' ? {} : undefined);
  service.update = (id, draft) =>
    jest.fn().mockResolvedValue(id !== '404' ? { id: '1' } : undefined);
  service.remove = id =>
    jest.fn().mockResolvedValue(id !== '404' ? { id: '1' } : undefined);
  service.patch = company => jest.fn().mockResolvedValue(company);

  return service;
};
