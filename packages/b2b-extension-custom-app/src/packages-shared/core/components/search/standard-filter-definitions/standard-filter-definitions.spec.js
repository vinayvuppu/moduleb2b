import { FILTER_TYPES } from '../../../constants';
import {
  filterTypeDateMessages,
  filterTypeNumberMessages,
  filterTypeMissingMessages,
  createDateDefinitionsMap,
  createNumberDefinitionsMap,
  createMissingDefinitionsMap,
  createMissingInDefinitionsMap,
  createReferenceDefinitionsMap,
  createTypesDefinitionsMap,
  createOptionsDefinitionsMap,
  createCreatableOptionsDefinitionsMap,
  createCustomFieldDefinitionsMap,
} from './standard-filter-definitions';

const intl = { formatMessage: message => message.id };

describe('constants', () => {
  it('export filter type keys', () => {
    expect(FILTER_TYPES).toMatchSnapshot();
  });
});

describe('messages', () => {
  it('export filter types date messages', () => {
    expect(filterTypeDateMessages).toBeDefined();
  });
  it('export filter types number messages', () => {
    expect(filterTypeNumberMessages).toBeDefined();
  });
  it('export filter types missing messages', () => {
    expect(filterTypeMissingMessages).toBeDefined();
  });
});

describe('definitions', () => {
  describe('createDateDefinitionsMap', () => {
    it('should return a standard config for a "date" field', () => {
      expect(createDateDefinitionsMap(intl)).toMatchSnapshot();
    });
  });

  describe('createNumberDefinitionsMap', () => {
    it('should return a standard config for a "numver" field', () => {
      expect(
        createNumberDefinitionsMap(intl, { numberFormat: 'en' })
      ).toMatchSnapshot();
    });
  });

  describe('createMissingDefinitionsMap', () => {
    it('should return a standard config for a "missing" field', () => {
      expect(createMissingDefinitionsMap(intl)).toMatchSnapshot();
    });
  });

  describe('createMissingInDefinitionsMap', () => {
    it('should return a standard config for a "missingIn" field', () => {
      expect(
        createMissingInDefinitionsMap(intl, {
          options: [{ label: 'en', value: 'en' }],
        })
      ).toMatchSnapshot();
    });
  });

  describe('createReferenceDefinitionsMap', () => {
    it('should return a standard config for a "reference" field', () => {
      expect(
        createReferenceDefinitionsMap(intl, {
          loadItems: jest.fn(),
          mapItemToOption: jest.fn(),
          type: 'category',
        })
      ).toMatchSnapshot();
    });
  });

  describe('createTypesDefinitionsMap', () => {
    it('should return a standard config for a "types" field', () => {
      expect(
        createTypesDefinitionsMap(intl, {
          options: [{ label: 'en', value: 'en' }],
        })
      ).toMatchSnapshot();
    });
  });

  describe('createOptionsDefinitionsMap', () => {
    it('should return a standard config for a "options" field', () => {
      expect(
        createOptionsDefinitionsMap(intl, {
          options: [
            { label: 'en', value: { key: 'value-key', label: 'value-label' } },
          ],
        })
      ).toMatchSnapshot();
    });
  });

  describe('createCreatableOptionsDefinitionsMap', () => {
    it('should return a standard config for a "creatable options" field', () => {
      expect(createCreatableOptionsDefinitionsMap(intl, {})).toMatchSnapshot();
    });
  });

  describe('createCustomFieldDefinitionsMap', () => {
    it('should return a config for a "custom field" filter', () => {
      expect(createCustomFieldDefinitionsMap(intl, {})).toMatchSnapshot();
    });
  });
});
