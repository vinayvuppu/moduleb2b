## `CustomFieldDefinitionsConnector`

A Connector that injects the custom field definitions for the requested resources. Whenever is called, it injects a new object `customFieldDefinitionsFetcher` as prop containing all the custom field definitions for the provided resources and information about loading state. An example of this object will be:

```js
customFieldDefinitionsFetcher: {
  isLoading: false,
  customFieldDefinitions: [
    {
      name: 'definition-1-name',
      label: {
        en: 'definition-1-label-en',
        de: 'definition-1-label-de',
      },
      type: { name: 'Boolean' },
    },
    {
      name: 'definition-2-name',
      label: {
        en: 'definition-2-label-en',
        de: 'definition-2-label-de',
      },
      type: { name: 'String' },
    },
    ...
  ]
}
```

## Usage

```js
import CustomFieldDefinitionsConnector from '@commercetools-local/core/components/custom-field-definitions-connector';

<CustomFieldDefinitionsConnector resources={['customer']}>
  {({ customFieldDefinitionsFetcher }) => (
    <MyAwesomeComponent
      customFieldDefinitionsFetcher={customFieldDefinitionsFetcher}
    />
  )}
</CustomFieldDefinitionsConnector>;
```

## API

### Example

For instance if we want to get all the custom field definitions set in the project for orders we can get them by adding the following:

```js
<CustomFieldDefinitionsConnector resources={['order']}>
  {({ customFieldDefinitionsFetcher }) => (
    <MyAwesomeComponent
      customFieldDefinitionsFetcher={customFieldDefinitionsFetcher}
    />
  )}
</CustomFieldDefinitionsConnector>
```

Another case can be getting all the custom field definitions for custom line items and line items. We can do it easily by adding:

```js
<CustomFieldDefinitionsConnector resources={['line-item', 'custom-line-item']}>
  {({ customFieldDefinitionsFetcher }) => (
    <MyAwesomeComponent
      customFieldDefinitionsFetcher={customFieldDefinitionsFetcher}
    />
  )}
</CustomFieldDefinitionsConnector>
```

In case invalid resources are passed, they are ignored when querying.

```js
<CustomFieldDefinitionsConnector
  resources={['line-item', 'custom-line-item-wrong']}
>
  {({ customFieldDefinitionsFetcher }) => (
    <MyAwesomeComponent
      customFieldDefinitionsFetcher={customFieldDefinitionsFetcher}
    />
  )}
</CustomFieldDefinitionsConnector>
```

This will throw an error. Whenever we have a typo, an error is thrown informing about the resource which is not correctly set.

### Arguments

- `resources` (`string[]`): Names of the resources we want to get the custom fields definitions. You can find all the available resources [here](https://dev.commercetools.com/http-api-projects-custom-fields.html#customizable-resources)
