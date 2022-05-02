import omit from 'lodash.omit';
import pick from 'lodash.pick';
import uniq from 'lodash.uniq';
import has from 'lodash.has';
import { PRECISION_TYPES } from '../constants';

/**
 * Transforms a list of `CustomField` into a `CustomField` object
 *
 * [{ name: 'fieldA', value: 'Hello' }] -> { fieldA: 'Hello' }
 */
export const transformCustomFieldsRawToCustomFields = customFieldsRaw => {
  if (!customFieldsRaw || customFieldsRaw.length === 0) return null;
  return customFieldsRaw.reduce(
    (customFields, customField) => ({
      ...customFields,
      [customField.name]: customField.value,
    }),
    {}
  );
};

// packages-application/application-discounts/utils/graphql-tools/transformers.js
/**
 * Transforms a list of `LocalizedField` into a `LocalizedString` object
 *
 * [{ locale: 'en', value: 'Hello' }] -> { en: 'Hello' }
 */
export const transformLocalizedFieldToString = localizedFields => {
  if (!localizedFields || localizedFields.length === 0) return null;
  return localizedFields.reduce(
    (updatedLocalizedString, field) => ({
      ...updatedLocalizedString,
      [field.locale]: field.value,
    }),
    {}
  );
};

/**
 * Given a list of localized field names to map, replace the fields in the
 * format of `LocalizedField` to a `LocalizedString` object.
 * The existing "localized" fields (the list version) will be removed.
 *
 * Arguments:
 * - `objectWithLocalizedFields`: the object with `LocalizedField` fields
 * that need to be transformed into `LocalizedStrings`
 * - `fieldNames`: is an array of objects with following shape:
 *   * `from`: the field to transform and to remove after
 *   * `to`: the target field to write the transformed shape
 *
 * Returns the transformed object without the fields `LocalizedField`
 */
export const injectTransformedLocalizedFields = (
  objectWithLocalizedFields,
  fieldNames
) => {
  const transformedObject = fieldNames.reduce(
    (updatedObjectWithTransformedLocalizedStrings, field) => ({
      ...updatedObjectWithTransformedLocalizedStrings,
      [field.to]: transformLocalizedFieldToString(
        objectWithLocalizedFields[field.from]
      ),
    }),
    objectWithLocalizedFields
  );
  return omit(
    transformedObject,
    fieldNames.map(field => field.from)
  );
};

/**
 * Transforms a `LocalizedString` object into a list of `LocalizedField`
 *
 * { en: 'Hello' } -> [{ locale: 'en', value: 'Hello' }]
 */
export const transformLocalizedStringToField = localizedString => {
  if (!localizedString || Object.keys(localizedString).length === 0) return [];
  return Object.keys(localizedString)
    .sort()
    .reduce(
      (updatedLocalizedField, locale) =>
        updatedLocalizedField.concat({
          locale,
          value: localizedString[locale],
        }),
      []
    );
};

/**
 * Creates the full definition for a localized field.
 *
 * Can be used to initialize an empty field as:
 *    createLocalizedString(['en', 'de'])
 *      => { en: '', de: '' }
 * or can be used to add empty translations to existing ones:
 *    createLocalizedString(['en', 'de'], { en: 'foo' })
 *      => { en: 'foo', de: '' }
 * However a LocalizedString can contain languages no longer defined on the
 * project, so we need to ensure to always display all languages the value holds
 *    createLocalizedString(['en'], { de: 'foo' })
 *      => { en: '', de: 'foo' }
 *
 * @param {Array} languages
 *   Array of strings of languages which should end up in the localized values.
 *   When no translation exists for a language, the value is initialized as
 *   an empty string.
 * @param {Object} existingTranslations
 *   Localized value holding translations (`{ en: String, de: String }`)
 * @return {Object}
 *   Returns a localized value holding all values of existingTranslations, and
 *   additionally contains all languages not defined in existingTranslations set
 *   to an empty string.
 */
export const createLocalizedString = (languages, existingTranslations) => {
  const allLanguages = existingTranslations
    ? uniq([...languages, ...Object.keys(existingTranslations)])
    : languages;
  return allLanguages.reduce((acc, language) => {
    acc[language] =
      existingTranslations && has(existingTranslations, language)
        ? existingTranslations[language] || ''
        : '';
    return acc;
  }, {});
};

// --- Types mapping ---

/**
 * Map category GraphQL shape with nameAllLocales to reference shape
 * Includes ancestors and parent
 *
 * @param {Object} category - A category result object from graphql
 * @return {Object} Category (as a REST API representation):
 * `{ id, obj: { id, name } }`
 */
export function transformLocalizedFieldsForCategory(
  category,
  transformationOptions = [{ from: 'nameAllLocales', to: 'name' }]
) {
  const transformedData = injectTransformedLocalizedFields(
    category,
    transformationOptions
  );
  const parent = category.parent
    ? transformLocalizedFieldsForCategory(category.parent)
    : null;
  const ancestors = category.ancestors
    ? category.ancestors.map(ancestor =>
        transformLocalizedFieldsForCategory(ancestor)
      )
    : null;
  return {
    ...transformedData,
    ...(parent ? { parent } : {}),
    ...(ancestors ? { ancestors } : {}),
  };
}

export function transformLocalizedFieldsForCartDiscount(cartDiscount) {
  const transformationOptions = [{ from: 'nameAllLocales', to: 'name' }];
  return injectTransformedLocalizedFields(cartDiscount, transformationOptions);
}

export function mapShippingRateTierToGraphQL(tiers) {
  return tiers.reduce(
    (graphQlTiers, tier) => [
      ...graphQlTiers,
      {
        [tier.type]: {
          price: tier.price
            ? {
                centAmount: tier.price.centAmount,
                currencyCode: tier.price.currencyCode,
              }
            : undefined,
          minimumCentAmount: tier.minimumCentAmount,
          value: tier.value || undefined,
          priceFunction: tier.priceFunction
            ? {
                function: tier.priceFunction.function,
                currencyCode: tier.priceFunction.currencyCode,
              }
            : undefined,
          score: tier.score,
        },
      },
    ],
    []
  );
}

/**
 * NOTE:
 * This module massages update actions produced by the JS SDK
 * to be compatible with CTP GraphQL mutations. This logic should be
 * moved into the JS SDK once discounts is fully 100% migrated to
 * GraphQL or any other plugin/app needs this functionality. Until
 * then this serves as a collective set of requirements before
 * prematurely adding a not fully working set of conversions to the
 * JS SDK.
 */

export const createAttributeTypeValue = attribute => {
  switch (attribute.type.name) {
    case 'set':
      return {
        set: {
          elementType: createAttributeTypeValue({
            type: attribute.type.elementType,
          }),
        },
      };
    case 'boolean':
    case 'date':
    case 'datetime':
    case 'ltext':
    case 'money':
    case 'number':
    case 'text':
    case 'time':
      return {
        [attribute.type.name]: {},
      };
    case 'enum':
    case 'lenum':
      return {
        [attribute.type.name]: {
          values: [],
        },
      };
    case 'reference': {
      return {
        [attribute.type.name]: {
          referenceTypeId: attribute.type.referenceTypeId,
        },
      };
    }
    default:
      return attribute.type;
  }
};
/**
 * converts the `changeValue` action to GraphQL actions variable
 * @param {Objecct} actionPayload
 */
export const convertChangeValueAction = actionPayload => {
  const valueType = actionPayload.value.type;
  const possibleTypeKeys = {
    relative: ['permyriad'],
    absolute: ['money'],
    giftLineItem: [
      'product',
      'variantId',
      'distributionChannel',
      'ResourceIdentifierInput',
    ],
  };
  const filteredValue = pick(actionPayload.value, possibleTypeKeys[valueType]);
  if (filteredValue.money)
    filteredValue.money = filteredValue.money.map(valueItem =>
      omit(valueItem, '__typename')
    );
  return {
    changeValue: {
      value: {
        [valueType]: filteredValue,
      },
    },
  };
};
/**
 * This function changes any payload after the actions have been computed.
 * Currently we only need to change the `setCustomField` action payload
 * as its dynamic content can not be typed in SDL for the mutation.
 */
const convertAction = (actionName, actionPayload) => {
  switch (actionName) {
    case 'setName':
      return {
        [actionName]: {
          name: Array.isArray(actionPayload.name)
            ? actionPayload.name
            : transformLocalizedStringToField(actionPayload.name),
        },
      };
    case 'setLineItemCustomField':
    case 'setCustomLineItemCustomField':
      return {
        [actionName]: {
          lineItemId: actionPayload.lineItemId,
          name: actionPayload.name,
          value: JSON.stringify(actionPayload.value),
        },
      };
    case 'setCustomField':
      return {
        [actionName]: {
          name: actionPayload.name,
          value: JSON.stringify(actionPayload.value),
        },
      };
    case 'setCustomType':
      return {
        [actionName]: {
          typeId: actionPayload.type?.id,
          fields: actionPayload.fields
            ? Object.entries(actionPayload.fields).map(
                ([customField, value]) => ({
                  name: customField,
                  value: JSON.stringify(value),
                })
              )
            : undefined,
        },
      };
    case 'removeLocation':
      return {
        [actionName]: {
          location: {
            country: actionPayload.location.country,
          },
        },
      };
    case 'addLocation':
      return {
        [actionName]: {
          location: {
            country: actionPayload.location.country,
          },
        },
      };
    case 'changeLabel':
      return {
        changeLabel: {
          attributeName: actionPayload.attributeName,
          label: transformLocalizedStringToField(actionPayload.label),
        },
      };
    case 'setInputTip':
      return {
        setInputTip: {
          attributeName: actionPayload.attributeName,
          inputTip: transformLocalizedStringToField(actionPayload.inputTip),
        },
      };
    case 'addAttributeDefinition':
      return {
        [actionName]: {
          attributeDefinition: {
            ...actionPayload.attribute,
            label: transformLocalizedStringToField(
              actionPayload.attribute.label
            ),
            inputTip: transformLocalizedStringToField(
              actionPayload.attribute.inputTip
            ),
            type: createAttributeTypeValue(actionPayload.attribute),
          },
        },
      };
    case 'replaceTaxRate':
      return {
        [actionName]: {
          taxRate: {
            name: actionPayload.taxRate.name,
            country: actionPayload.taxRate.country,
            includedInPrice: actionPayload.taxRate.includedInPrice,
            amount: actionPayload.taxRate.amount,
            state: actionPayload.taxRate.state,
          },
          taxRateId: actionPayload.taxRateId,
        },
      };
    case 'addZone':
      return {
        [actionName]: {
          zone: {
            id: actionPayload.zone.id,
            typeId: actionPayload.zone.typeId,
          },
        },
      };
    case 'removeZone':
      return {
        [actionName]: {
          zone: {
            id: actionPayload.zone.id,
            typeId: actionPayload.zone.typeId,
          },
        },
      };
    case 'changeTaxCategory':
      return {
        [actionName]: {
          taxCategory: {
            id: actionPayload.taxCategory.id,
            typeId: actionPayload.taxCategory.typeId,
          },
        },
      };
    case 'addShippingRate':
      return {
        [actionName]: {
          zone: {
            id: actionPayload.zone.id,
            typeId: actionPayload.zone.typeId,
          },
          shippingRate: {
            price: {
              centAmount: actionPayload.shippingRate.price.centAmount,
              currencyCode: actionPayload.shippingRate.price.currencyCode,
            },
            freeAbove: actionPayload.shippingRate.freeAbove
              ? {
                  centAmount: actionPayload.shippingRate.freeAbove.centAmount,
                  currencyCode:
                    actionPayload.shippingRate.freeAbove.currencyCode,
                }
              : undefined,
            tiers: actionPayload.shippingRate.tiers
              ? mapShippingRateTierToGraphQL(actionPayload.shippingRate.tiers)
              : undefined,
          },
        },
      };
    case 'removeShippingRate':
      return {
        [actionName]: {
          zone: {
            id: actionPayload.zone.id,
            typeId: actionPayload.zone.typeId,
          },
          shippingRate: {
            price: {
              centAmount: actionPayload.shippingRate.price.centAmount,
              currencyCode: actionPayload.shippingRate.price.currencyCode,
            },
            freeAbove: actionPayload.shippingRate.freeAbove
              ? {
                  centAmount: actionPayload.shippingRate.freeAbove.centAmount,
                  currencyCode:
                    actionPayload.shippingRate.freeAbove.currencyCode,
                }
              : undefined,
            tiers: actionPayload.shippingRate.tiers
              ? mapShippingRateTierToGraphQL(actionPayload.shippingRate.tiers)
              : undefined,
          },
        },
      };
    case 'changeValue':
      return convertChangeValueAction(actionPayload);
    // product-types -> attributes -> enum
    case 'addLocalizedEnumValue':
      return {
        [actionName]: {
          attributeName: actionPayload.attributeName,
          value: {
            ...actionPayload.value,
            label: transformLocalizedStringToField(actionPayload.value.label),
          },
        },
      };
    case 'changeLocalizedEnumValueLabel':
      return {
        [actionName]: {
          attributeName: actionPayload.attributeName,
          newValue: {
            ...actionPayload.newValue,
            label: transformLocalizedStringToField(
              actionPayload.newValue.label
            ),
          },
        },
      };
    case 'setShippingRateInputType':
      return {
        [actionName]: {
          shippingRateInputType: actionPayload.shippingRateInputType?.type
            ? {
                [actionPayload.shippingRateInputType.type]: {
                  values:
                    actionPayload.shippingRateInputType.type ===
                    'CartClassification'
                      ? actionPayload.shippingRateInputType.values.map(
                          value => ({
                            key: value.key,
                            label: value.allLocaleLabels,
                          })
                        )
                      : undefined,
                },
              }
            : undefined,
        },
      };
    case 'addCustomLineItem': {
      return {
        [actionName]: {
          slug: actionPayload.slug,
          quantity: actionPayload.quantity,
          name: transformLocalizedStringToField(actionPayload.name),
          taxCategory: actionPayload.taxCategory,
          money: {
            [actionPayload.money.type]: {
              centAmount: actionPayload.money.centAmount,
              currencyCode: actionPayload.money.currencyCode,
              ...(actionPayload.money.type ===
                PRECISION_TYPES.highPrecision && {
                preciseAmount: actionPayload.money.preciseAmount,
                fractionDigits: actionPayload.money.fractionDigits,
              }),
            },
          },
        },
      };
    }
    case 'setDataFences':
      return {
        [actionName]: {
          dataFences: actionPayload.dataFences.reduce(
            (nextDataFences, dataFence) => {
              if (dataFence.type.toLowerCase() === 'store')
                return [
                  ...nextDataFences,
                  {
                    [dataFence.type.toLowerCase()]: {
                      storeKeys: dataFence.storeKeys,
                    },
                  },
                ];
              return nextDataFences;
            },
            []
          ),
        },
      };
    default:
      return { [actionName]: actionPayload };
  }
};

export const createGraphQlUpdateActions = actions =>
  actions.reduce(
    (previousActions, { action: actionName, ...actionPayload }) => [
      ...previousActions,
      convertAction(actionName, actionPayload),
    ],
    []
  );

export const extractErrorFromGraphQlResponse = graphQlResponse => {
  if (graphQlResponse.networkError?.result?.errors?.length > 0) {
    return graphQlResponse.networkError.result.errors;
  }

  if (graphQlResponse.graphQLErrors?.length > 0) {
    return graphQlResponse.graphQLErrors;
  }

  return graphQlResponse;
};
