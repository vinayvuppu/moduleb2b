# Search

## Example setup

```jsx
import SearchContainer from '@commercetools-local/core/components/search/search-container';
import Filters from '@commercetools-local/core/components/search/filters';
import SearchFilterContainer from '@commercetools-local/core/components/search/search-filter-container';
import FilterSearchBar from '@commercetools-local/core/components/search/filter-search-bar';
import {
  createNumberDefinitionsMap,
  createDateDefinitionsMap,
  createReferenceDefinitionsMap,
  createMissingDefinitionsMap,
  createMissingInDefinitionsMap,
} from '@commercetools-local/core/components/search/standard-filter-definitions';

const fieldDefinitions = intl => ({
  createdAt: {
    label: 'Created at',
    filterTypes: createReferenceDefinitionsMap(intl),
  },
  category: {
    label: 'Category',
    filterTypes: {
      equalTo: {
        filterComponent: CategoryFilter,
        tagComponent: CategoryFilterTag,
        label: 'is',
      },
    },
  },
});
const MySearch = props => {
  const intl = useIntl();
  return (
    <SearchContainer onUpdateSearch={handleUpdateSearch}>
      {({ onUpdateSearchText, onUpdateFilters }) => (
        <SearchFilterContainer>
          {({ isEditMode, toggleFilters }) => (
            <div>
              <FilterSearchBar
                onInputChange={onUpdateSearchText}
                initialValue={state.text}
                isFilterButtonActive={isEditMode}
                onToggleFilterButton={toggleFilters}
              />
              <Filters
                onUpdateFilters={onUpdateFilters}
                fieldDefinitions={createAvailableFilters(intl)}
                filteredFields={state.filters}
                isEditMode={isEditMode}
                onToggleEditMode={toggleFilters}
              />
            </div>
          )}
        </SearchFilterContainer>
      )}
    </SearchContainer>
  );
};
```

## API

## `<SearchContainer/>`

This component holds all the state of a search and provides several useful
callback functions to its FAC including:

- `onUpdateSearchText`: Used for updating the search string.
- `onUpdateFilters`: Used for all updates to filters.

## `<Filters/>`

Pre-composed Filters setup.

### Props

| Property         | Type                                          | Required? | Description                                                                                                                             |
| :--------------- | :-------------------------------------------- | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------- |
| fieldDefinitions | [FieldDefinitions](#field-definitions)        |     ✓     | The definition of which fields can be filtered by which filter types                                                                    |
| filteredFields   | [FilteredFieldValues](#filtered-field-values) |     ✓     | The current filter values grouped (keyed) by field name                                                                                 |
| isEditMode       | PropTypes.bool                                |     ✓     | Indicates whether to show the edit view or the tag view                                                                                 |
| onToggleEditMode | function                                      |     ✓     | Is called whenever to switch from edit to view mode or the other way around: `(): void`                                                 |
| onUpdateFilters  | function                                      |     ✓     | Is called whenever a filter value changes. Should implement the following interface: `(filteredFieldValues: FilteredFieldValues): void` |

### <a name="field-definitions">

</a> `FieldDefinitions` prop type shape

Shape:

```js
PropTypes.objectOf(
  PropTypes.shape({
    label: PropTypes.string,
    filterTypes: PropTypes.objectOf(PropTypes.shape({
      filterComponent: PropTypes.func.isRequired,
      tagComponent: PropTypes.func.isRequired,
      validator: PropTypes.func,
      label: PropTypes.string.isRequired,
      canBeAppliedMultipleTimes: PropTypes.bool, // default `true`
    })).isRequired,
  })
),
```

Example:

```js
{
  dateCreated: {
    range: {
      filterComponent: DateRangeFilter,
      tagComponent: DateRangeTag,
      validator: validateDate,
      label: 'Range'
    },
    moreThan: {
      filterComponent: DateSingleValueFilter,
      tagComponent: DateSingleValueTag,
      label: 'After'
    },
  },
  level: {
    range: {
      filterComponent: LevelRangeFilter,
      tagComponent: LevelRangeTag,
      validator: validateNumber,
      label: 'Between'
    },
    moreThan: {
      filterComponent: LevelSingleValueFilter,
      tagComponent: LevelSingleValueTag,
      label: 'More than'
    },
  },
}
```

#### Filter and Tag components

You need to specify a _filter_ and _tag_ component that should be rendered for
each filter type. The _filter_ component is rendered when the filters are open,
the _tag_ component when they are collapsed.

#### Validating filters

Additionally, you can optionally specify a validation function that will get
called with the type of filter and the filter value. If you return a string or
an object in the same shape as the filter value from this function, it will be
displayed as an error on the corresponding input in the filter. If a value is
valid, simply return nothing from the validator function.

#### Standard filter configurations

There is a number of [standard filter components](#standard-filter-components)
that you can use as filter/tag components, or you can define you own. These
components must follow the [Data Type Filters](#data-type-filters) API.

You can also generate filter definitions using the [utility
function](#creating-filter-definition) mentioned below.

### <a name="filtered-field-values">

</a> `FilteredFieldValues` prop type shape

This object represents the current state of all filters. It is contained in the
`SearchContainer` component and passed down to the `Filters` component, so you
don't need to manage this on your own. All you need to do is pass it down to the
`Filters` component.

Shape:

```js
PropTypes.objectOf(
  PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  )
);
```

Example:

```js
{
  dateCreated: [
    { type: 'range', value: { from: '01.01.2016', to: '01.01.2017' } },
  ],
  dateModified: [
    { type: 'lessThan', value: '31.05.2015' },
    { type: 'moreThan', value: '01.07.2015' },
  ],
}
```

### <a name="standard-filter-components">

</a> Standard Filter Components

There are some high level and some low level filter components than can be
grouped into these categories:

| Name              | Components                                                                                           | Description                                                                                                                                                |
| :---------------- | :--------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base Filters      | `<SingleFilter/>`, `<RangeFilter />`                                                                 | Renders either one or two filters. How a filter is rendered needs to be passed to this component from outside.                                             |
| Data Type Filters | `<DateSingleFilter/>`, `<DateRangeFilter />`, `<NumberSingleFilter />`, `<NumberRangeFilter />` etc. | Wraps a base filter for a specific data type. Data type filters are the ones you would use directly. Supported data types are: Date, Number (more to come) |

#### <a name="data-type-filters">

</a> Data Type Filters

All data type filters have the same API so they can be used by the `<Filters/>`
component.

##### Props

| Property       | Type          | Required? | Description                                                                                                                  |
| :------------- | :------------ | :-------: | :--------------------------------------------------------------------------------------------------------------------------- |
| value          | PropTypes.any |     ✓     | The value of the filter                                                                                                      |
| onUpdateFilter | function      |     ✓     | Should be called whenever the filter value changes. Should implement the following interface: `(value: PropTypes.any): void` |

#### <a name="predefined-data-types">

</a> Predefined Data Type Filter Components

Currently we have support for the following data types:

✅ Date ✅ Number ✅ Enum ❌ Money ❌ Reference ❌ Text ❌ Localized Text ❌
Boolean ❌ Enum ❌ Localized Enum ❌ Sets

Each of the supported types have a corresponding `Single` and `Range` variation
(e.g. `DateSingleFilter` and `DateRangeFilter`), except for Enum types which
only require a `Single` filter.

### <a name="creating-filter-definition">

</a> Creating a filter definition

You can create a field definition object for a given data type.

A set of predefined filters for a given data type can be generated with the
`createFilterDefinitions` utility. Supported are all the data types mentioned
[above](predefined-data-types).

`createFilterDefinitions` takes the following arguments:

- `dataType`: the data type of the filter
  - `date`
  - `number`
  - `missing`
  - `missingIn`
- `intl`: a react-intl instance
- `meta`: an optional argument that contains any additional information that the
  filter components need (e.g. `numberFormat` for data type `number`)

Example:

```js
const fieldDefinitions = {
  createdAt: createReferenceDefinitionsMap(intl),
  lastModifiedAt: createReferenceDefinitionsMap(intl),
  level: createNumberDefinitionsMap(intl, { numberFormat: 'en' }),
  missingName: createMissingInDefinitionsMap(intl, {
    options: [{ label: 'en', value: 'en' }],
  }),
  missingExternalId: createMissingDefinitions(intl),
};
```

#### Meta options

**Number Filter**

| Name         | Type    | Required | Description                                                                                                 |
| :----------- | :------ | :------- | :---------------------------------------------------------------------------------------------------------- |
| numberFormat | String  | ✓        | Format to display numbers in                                                                                |
| allowFloat   | Boolean |          | If set to false, entering a floating point number will render the filter invalid and show a warning tooltip |

**Reference Filters**

| Name     | Type     | Required | Description                                                                                       |
| :------- | :------- | :------- | :------------------------------------------------------------------------------------------------ |
| type     | String   | ✓        | Type of reference filter, currently supports `category`                                           |
| searchFn | Function | ✓        | function used to search for objects, should return a promise that resolves to an array of objects |

_Category Reference Filter_

| Name     | Type   | Required | Description                                                      |
| :------- | :----- | :------- | :--------------------------------------------------------------- |
| language | String | ✓        | Used to determine which language to display the category name in |
