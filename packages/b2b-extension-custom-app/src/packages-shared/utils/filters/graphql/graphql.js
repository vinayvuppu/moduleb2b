import flatMap from 'lodash.flatmap';
import has from 'lodash.has';

/**
 * @param Object config config object matching fieldName => dataTypes
 * @param Object filters all filters keyed by fieldName
 *
 * eg.
 *
  {
    config: {
      createdOn: GraphqlDateProcessor,
      level: GraphQlNumberProcessor,
    },
    filters: {
      createdOn: [
        { type: 'equalTo', value: '2016-07-01' }
      ],
      level: [
        {
          type: 'range',
          value: { from: '1', to: '5' }
        }
      ],
    }
  }
 *
 */
export default function graphqlQueryBuilder({ config, filters }) {
  const builtFilters = flatMap(filters, (filter, fieldName) => {
    if (!has(config, fieldName))
      throw new Error(
        'fieldType required in `config` param of `graphqlQueryBuilder`'
      );

    const filterConfig = config[fieldName];
    // a filter transformer may return an array, string or null
    return filterConfig.transform(filterConfig.key, filter);
  });

  return builtFilters.filter(Boolean);
}
