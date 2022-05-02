import { mapDataToProps } from './conversions';

const createData = customData => ({
  employeeQuery: {
    loading: false,
    employee: {
      id: 'id-1',
      custom: {
        customFieldsRaw: [{ name: 'my-custom', value: 1 }],
        type: {
          id: 'type-id',
          key: 'my-type',
          nameAllLocales: [
            {
              locale: 'en',
              value: 'name',
            },
          ],
          fieldDefinitions: [
            {
              name: 'test',
              required: false,
              type: 'String',
              labelAllLocales: [
                {
                  locale: 'en',
                  value: 'Hey',
                },
              ],
            },
          ],
        },
      },
    },
    ...customData,
  },
});

describe('mapDataToProps', () => {
  let data;
  let props;
  describe('when loading', () => {
    beforeEach(() => {
      data = createData({ loading: true });
      props = mapDataToProps(data);
    });
    it('should return an undefined employee', () => {
      expect(props).toEqual({
        employeeQuery: expect.objectContaining({
          employee: undefined,
        }),
      });
    });
  });
  describe('when loaded but no custom fields', () => {
    beforeEach(() => {
      data = createData({
        loading: false,
        employee: {
          custom: null,
        },
      });
      props = mapDataToProps(data);
    });
    it('should return an undefined `custom` attribute for the employee', () => {
      expect(props).toEqual({
        employeeQuery: expect.objectContaining({
          employee: expect.objectContaining({
            custom: null,
          }),
        }),
      });
    });
  });

  describe('when loaded and with custom fields', () => {
    beforeEach(() => {
      data = createData();
      props = mapDataToProps(data);
    });
    it('should return a `custom` attribute for the employee', () => {
      expect(props).toEqual({
        employeeQuery: expect.objectContaining({
          employee: expect.objectContaining({
            custom: {
              fields: { 'my-custom': 1 },
              type: {
                typeId: 'type',
                id: 'type-id',
                obj: {
                  key: 'my-type',
                  name: { en: 'name' },
                  fieldDefinitions: [
                    {
                      name: 'test',
                      required: false,
                      type: 'String',
                      label: { en: 'Hey' },
                    },
                  ],
                },
              },
            },
          }),
        }),
      });
    });
    describe('when the type is `LocalizedEnum`', () => {
      beforeEach(() => {
        data = createData({
          employee: {
            id: 'id-1',
            custom: {
              customFieldsRaw: [{ name: 'my-custom', value: 1 }],
              type: {
                id: 'type-id',
                key: 'my-type',
                nameAllLocales: [
                  {
                    locale: 'en',
                    value: 'name',
                  },
                ],
                fieldDefinitions: [
                  {
                    name: 'test',
                    required: false,
                    type: {
                      name: 'LocalizedEnum',
                      values: [
                        {
                          key: 'option 1',
                          labelAllLocales: [
                            {
                              locale: 'en',
                              value: 'Option1',
                            },
                          ],
                        },
                      ],
                    },
                    labelAllLocales: [
                      {
                        locale: 'en',
                        value: 'Hey',
                      },
                    ],
                  },
                ],
              },
            },
          },
        });
        props = mapDataToProps(data);
      });
      it('should return a `custom` attribute for the employee with localized option values', () => {
        expect(props).toEqual({
          employeeQuery: expect.objectContaining({
            employee: expect.objectContaining({
              custom: {
                fields: { 'my-custom': 1 },
                type: {
                  typeId: 'type',
                  id: 'type-id',
                  obj: {
                    key: 'my-type',
                    name: { en: 'name' },
                    fieldDefinitions: [
                      {
                        name: 'test',
                        required: false,
                        type: {
                          name: 'LocalizedEnum',
                          values: [
                            {
                              key: 'option 1',
                              label: { en: 'Option1' },
                            },
                          ],
                        },
                        label: { en: 'Hey' },
                      },
                    ],
                  },
                },
              },
            }),
          }),
        });
      });
    });
  });
});
