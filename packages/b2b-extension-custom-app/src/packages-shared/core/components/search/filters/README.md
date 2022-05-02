# `<Filters/>`

This is the internal documentation of the Filters component. To see which props
are accepted by `<Filters/>` read the [Search Documentation](../README.md).

All the Filters component does is composing together multiple other components,
that do the actual work:

## `<FiltersContainer/>`

- FAC that
  - gives a list of active fields and their filters { fieldName: [filter,
    filter] }
  - passes a callback to update a fields filter value

If all the values for a field are removed, it is considered inactive and should
be rendered in the field Select dropdown

## `<FieldFilters/>`

- wraps a field in section styles
- also renders a label and a remove button for field

For removing a field entirely, the FiltersSection should call the updateValue
callback with an empty array or null
