## `CustomFieldTypeDefinitionsConnector`

A Connector that injects the custom field definitions for the requested resources. Whenever is called, it injects a new object `customFieldTypeDefinitionsFetcher` as prop containing all the custom field definitions for the provided resources and information about loading state.

Where the key in the object is the custom field definition name and the value is an object containing the custom field definition label and the custom field definition type. The label is just a string, this is a result of the GraphQL query which is already retrieving the label in the corresponding locale.

## Usage

```js
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';

<CustomFieldTypeDefinitionsConnector resources={['order']}>
  {({ customFieldTypeDefinitionsFetcher }) => (
    <MyAwesomeComponent
      customFieldTypeDefinitionsFetcher={customFieldTypeDefinitionsFetcher}
    />
  )}
</CustomFieldTypeDefinitionsConnector>;
```

## API

### Example

For instance if we want to get all the custom field type definitions set in the project for channels we can get them by adding the following:

```js
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';

<CustomFieldTypeDefinitionsConnector resources={['channel']}>
  {({ customFieldTypeDefinitionsFetcher }) => (
    <MyAwesomeComponent
      customFieldTypeDefinitionsFetcher={customFieldTypeDefinitionsFetcher}
    />
  )}
</CustomFieldTypeDefinitionsConnector>;
```

Another case can be getting all the custom field type definitions for custom line items and line items. We can do it easily by adding:

```js
<CustomFieldTypeDefinitionsConnector
  resources={['line-item', 'custom-line-item']}
>
  {({ customFieldTypeDefinitionsFetcher }) => (
    <MyAwesomeComponent
      customFieldTypeDefinitionsFetcher={customFieldTypeDefinitionsFetcher}
    />
  )}
</CustomFieldTypeDefinitionsConnector>
```

In case invalid resources are passed, an error will popup with the invalid one.

```js
<CustomFieldTypeDefinitionsConnector resources={['channel', 'custom-channel']}>
  {({ customFieldTypeDefinitionsFetcher }) => (
    <MyAwesomeComponent
      customFieldTypeDefinitionsFetcher={customFieldTypeDefinitionsFetcher}
    />
  )}
</CustomFieldTypeDefinitionsConnector>
```

This will throw an error. Whenever we have a typo, an error is thrown informing about the resource which is not correctly set.

### Arguments

- `resources` (`string[]`): Names of the resources we want to get the custom fields type definitions. You can find all the available resources [here](https://dev.commercetools.com/http-api-projects-custom-fields.html#customizable-resources)

## Utilities

The connector offers some utilities for transforming and parsing data so can be used in forms and send it afterwards in the correct shape.

### `restDocToForm`

Transforms the custom object coming from a REST request to a form shape.

This should be used inside `docToFormValues` if the connector injects data coming from a REST request.

> NOTE: Temporary utility until we have all entities in the GraphQL schema.

```js
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';

CustomFieldTypeDefinitionsConnector.restDocToForm({
  custom: {
    type: {
      id: 'test',
      obj: { key: 'test1': fieldDefinitions: [...], name: {...} }
    },
    fields: { customField1: 'one', customField2: 'two'}
});
// -> {
//   fields: { customField1: 'one', customField2: 'two' },
//   type: { id: 'test', key: 'test1': fieldDefinitions: [...], name: {...} }
// }
```

### `graphQlDocToForm`

Transforms the custom object coming from GraphqQL to a form shape.

```js
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';

CustomFieldTypeDefinitionsConnector.graphQlDocToForm({
  id: 'test',
  key: 'test1',
  nameAllLocales: [...],
  fieldDefinitions: [...]
});
// -> {
//   fields: {},
//   type: { id: 'test', key: 'test1': fieldDefinitions: [...], name: {...} }
// }
```

### `formToRestDoc`

Transforms a form shape custom object to the original REST shape of the document (channel, order, ...).

The usage should be (if possible) inside `formValuesToDoc`. It's useful for building the custom object for `sync-actions`

```js
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';

CustomFieldTypeDefinitionsConnector.formToRestDoc({
  type: {
    id: 'tes t',
    key: 'test1',
    fieldDefinitions: [...],
    name: {...}
   },
   fields: { customField1: 'one', customField2: 'two'}
});
// -> {
//   fields: { customField1: 'one', customField2: 'two'},
//   type: {
//      id: 'test',
//      typeId: 'type',
//      obj: { key: 'test1': fieldDefinitions: [...], name: {...} }
//  }
```

### `formToGraphQlDoc`

Transforms a form shape custom object to the original GraphQL shape of the document (channel, order, ...).

```js
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';

CustomFieldTypeDefinitionsConnector.formToGraphQlDoc({
  type: {
    id: 'test',
    key: 'test1',
    fieldDefinitions: [...],
    name: {...}
   },
   fields: { customField1: 'one', customField2: 'two'}
});
// -> {
//   fields: { customField1: 'one', customField2: 'two'},
//   type: {
//      id: 'test',
//      typeId: 'type',
//      obj: { key: 'test1': fieldDefinitions: [...], name: {...} }
//  }
```

### `createEmptyCustomFields`

Creates an empty custom object to be used in forms.

This should be used in a `createInitialValues`, `docToFormValues` or if you want to reset the `custom` attribute of an entity in a form.

```js
import CustomFieldTypeDefinitionsConnector from '@commercetools-local/core/components/custom-field-type-definitions-connector';

CustomFieldTypeDefinitionsConnector.formToGraphQlDoc({
  type: {
    id: 'test',
    key: 'test1',
    fieldDefinitions: [...],
    name: {...}
   },
   fields: { customField1: 'one', customField2: 'two'}
});
// -> {
//   fields: [{ name: 'customField1', value: 'one }, { name: 'customField2', value: 'two }],
//   typeId: 'test',
// }
```
