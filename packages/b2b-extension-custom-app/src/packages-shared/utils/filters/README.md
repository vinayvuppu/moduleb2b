# Processing Filters

This set of utilities are used to convert objects that describe filters into
string filters suitable for graphql endpoints, REST endpoints, etc. They are
split into 2 levels of processing

## API Reference

### `graphqlQueryBuilder(options)`

This is the main method used to build _filters_ for graphql.

#### Named arguments (options)

- `config` _(Object)_: a configuration object describing the how the filter
  should be transformed into a query

```js
const filterConfig = {
  // The identifier of the filter
  createdOn: {
    // The key used in the actual query
    key: 'createdAt',
    // A function that builds the query string for the given filter type.
    // It accepts 2 arguments:
    // - key: the key defined in the config above
    // - values: the list of values for the given filter. A value consists in `{ type, value }`
    // Returns a string.
    transform: (key, values) => `${key}: ${values.map(...)}`,
  },
  missingExternalId: {
    key: 'externalId',
    transform: (key/* , values */) => `${key}:missing`,
  },
}
```

- `filters` _(Object)_: an object with all the given filter values

```js
const filters = {
  // The identifier of the filter
  createdOn: [
    { type: 'equalTo', value: '2016-07-01' },
    { type: 'range', value: { from: '2016-01-01', to: '2016-02-01' } },
  ],
  missingExternalId: [{ type: 'missing', value: null }],
};
```

## Available filter transformers

- `dateTransformer`
- `numberTransformer`
- `missingTransformer`
- `missingLocaleTransformer`
