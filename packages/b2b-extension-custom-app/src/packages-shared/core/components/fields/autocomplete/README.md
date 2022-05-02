## Autocomplete

This component can be used as either a synchronous or asynchronous autocomplete.

### Synchronous use

Simply have the `loadItems` prop return an array of options and it will be done
synchronously. It will receive the current value of the text field so you can do
any filtering of items that you want here

### Asynchronous use

Just have the `loadItems` prop returns a promise and do everything else as
usual.

### All options

| Property             | Type        | Required | Values               | Default | Description                                                                                                                                                                                                                      |
| -------------------- | ----------- | -------- | -------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onChange             | function    | ✅       |                      |         | triggered when an option has been selected, will be called with the new value.                                                                                                                                                   |
| onFocus              | function    |          |                      |         | handle focus events on the control                                                                                                                                                                                               |
| onBlur               | function    |          |                      |         | handle blur events on the control                                                                                                                                                                                                |
| loadItems            | function    | ✅       |                      |         | Should either return an array of items, or a promise that resolves to the array of items you wish to load into the autocomplete dropdown. The shape of the items is not important as it's defined by the `mapItemToOption` prop. |
| mapItemToOption      | function    | ✅       |                      |         | will receive an item and should map it to the shape: `{ value: string, label: string | ReactNode }`                                                                                                                              |
| mapValueToItem       | function    | ✅       |                      |         | will receive a value and should map it back to the corresponding item                                                                                                                                                            |
| renderItem           | function    |          |                      |         | allows custom item rendering, if not specified then just the label will be rendered                                                                                                                                              |
| filterOption         | function    |          |                      |         | defines a function to filter options while searching. The function has the following signature: `(value: any, search: string) => boolean`                                                                                        |
| autoload             | boolean     |          |                      | `false` | to determine if the options should be loaded as soon as the component is mounted                                                                                                                                                 |
| maxMenuHeight        | number      |          |                      |         |                                                                                                                                                                                                                                  |
| placeholderLabel     | string      |          |                      |         |                                                                                                                                                                                                                                  |
| name                 | string      |          |                      |         |                                                                                                                                                                                                                                  |
| value                | string      |          |                      |         |                                                                                                                                                                                                                                  |
| isMulti              | boolean     |          |                      | `false` | to handle multiple selections                                                                                                                                                                                                    |
| isClearable          | boolean     |          |                      | `false` |                                                                                                                                                                                                                                  |
| className            | string      |          |                      |         |                                                                                                                                                                                                                                  |
| disabled             | boolean     |          |                      | `false` |                                                                                                                                                                                                                                  |
| menuPortalTarget     | HTMLElement |          |                      |         | Dom element to portal the select menu to                                                                                                                                                                                         |
| menuPortalZIndex     | HTMLElement |          |                      |         | z-index value for the menu portal                                                                                                                                                                                                |
| horizontalConstraint | string      |          | `s, m, l, xl, scale` | `scale` | Horizontal size limit of the input fields                                                                                                                                                                                        |

### Example use

```js
const options = [
  { id: 'py_001', name: 'python' },
  { id: 'jas_001', name: 'javascript' },
  { id: 'jav_001', name: 'java' },
  { id: 'ru_001', name: 'ruby' },
  { id: 'hask_001', name: 'haskell' },
  { id: 'lis_001', name: 'lisp' },
  { id: 'elm_001', name: 'elm' },
];

const LanguagesAutocomplete = props => (
  <Autocomplete
    value={props.value}
    loadItems={value => options.filter(option => option.name.startsWith(value))}
    onChange={props.onChange}
    mapItemToOption={item => ({ value: item.id, label: item.name })}
    mapValueToItem={value => options.find(option => option.id === value)}
    renderItem={item => <div>{item.label}</div>}
  />
);
```
