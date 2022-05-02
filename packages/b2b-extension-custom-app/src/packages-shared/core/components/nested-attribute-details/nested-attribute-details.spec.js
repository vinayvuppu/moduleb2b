import React from 'react';
import { renderApp } from '@commercetools-frontend/application-shell/test-utils';
import { intlMock } from '../../../test-utils';
import { NestedAttributeDetails } from './nested-attribute-details';
import { NestedAttributesContainerProvider } from '../nested-attributes-container/nested-attributes-container-provider';

const createTestProps = custom => ({
  isSetType: true,
  typeDetails: {
    name: 'typeName',
    attributes: [
      {
        name: 'numberAttr',
        label: { en: 'Number Attribute' },
        type: { name: 'number' },
        isRequired: false,
      },
      {
        name: 'textAttr',
        label: { en: 'Text Attribute' },
        isRequired: true,
        type: { name: 'text' },
      },
      {
        name: 'material',
        label: { en: 'Material Set Attribute' },
        isRequired: false,
        type: { name: 'set', elementType: { name: 'text' } },
      },
    ],
  },
  definition: {
    label: {
      en: 'label',
    },
    type: {
      name: 'set',
    },
  },
  attribute: {
    name: 'attributeName',
    value: [[{ attr: 'val-1' }], [{ attr: 'val-2' }], [{ attr: 'val-3' }]],
  },
  isDisabled: false,
  isModalOpen: true,
  closeModal: jest.fn(),
  namePrefix: 'name-prefix',
  index: 1,
  level: 1,
  expandSettings: {},
  currencies: [],
  languages: [],
  numberFormat: 'en',
  selectedLanguage: 'en',
  language: 'en',
  updateSettings: jest.fn(),
  attributeDefinitions: [],
  attributes: [],
  onChangeValue: jest.fn(),
  handleChangeNestedAttribute: jest.fn(),
  intl: intlMock,

  ...custom,
});

const originalConsoleError = console.error;
describe('NestedAttributeDetails', () => {
  // this is required, because of the console.error with the unsupported `LabelField`
  // was causing tests to fail.
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error.mockClear();
    console.error = originalConsoleError;
  });
  describe('with open modal', () => {
    it('should show all attributes', () => {
      const props = createTestProps();
      const { queryByText } = renderApp(
        <NestedAttributesContainerProvider
          productDraft={{ id: 'mock-product-id' }}
          productAttributeDefinitions={[]}
        >
          <NestedAttributeDetails {...props} />
        </NestedAttributesContainerProvider>
      );
      expect(queryByText('Number Attribute')).toBeInTheDocument();
      expect(queryByText('Text Attribute')).toBeInTheDocument();
      expect(queryByText('Material Set Attribute')).toBeInTheDocument();
    });
  });

  describe('with closed modal', () => {
    it('should not show any attribute', () => {
      const props = createTestProps({
        isModalOpen: false,
      });
      const { queryByText } = renderApp(
        <NestedAttributesContainerProvider
          productDraft={{ id: 'mock-product-id' }}
          productAttributeDefinitions={[]}
        >
          <NestedAttributeDetails {...props} />
        </NestedAttributesContainerProvider>
      );
      expect(queryByText('Number Attribute')).not.toBeInTheDocument();
      expect(queryByText('Text Attribute')).not.toBeInTheDocument();
      expect(queryByText('Material Set Attribute')).not.toBeInTheDocument();
    });
  });
});
