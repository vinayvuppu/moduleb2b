import { updateCompany } from '.';

describe('api', () => {
  let fetchSpy;
  let response;
  beforeEach(() => {
    fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({ message: 'done' }),
      ok: true,
    });
  });
  describe('updateCompany', () => {
    beforeEach(async () => {
      response = await updateCompany({
        url: 'https://commercetools-b2b-extension.appspot.com',
        payload: { name: 'test', id: 'foo' },
      });
    });
    it('should call fetch with correct values', () => {
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://commercetools-b2b-extension.appspot.com/foo',
        {
          body: JSON.stringify({
            name: 'test',
            id: 'foo',
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
        }
      );
    });
    it('should return the correct response', () => {
      expect(response).toEqual({ message: 'done' });
    });
  });
});
