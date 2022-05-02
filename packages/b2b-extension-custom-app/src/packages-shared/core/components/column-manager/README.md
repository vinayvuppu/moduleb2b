# Column Manager

## Usage

```js
import ColumnManager from '@commercetools-local/core/components/column-manager';
```

### `<ColumnManager />`

Shows a ColumnManager component to customize columns in tables. The component allows searching for available columns and order them by dragging and dropping when clicking on the Drag&Drop button which is just besides the title.

#### Usage

```js
<ColumnManager
  availableColumns={availableColumns}
  selectedColumns={this.state.selectedColumns}
  onUpdateColumns={this.handleUpdateColumns}
/>
```

The column manager also receives an array `hiddenColumns` with the columns which are in the `availableColumns` array but are not included in the `selectedColumns` one.

#### Props

| Props              | Type              | Required | Values | Default | Description                                                                                                                           |
| ------------------ | ----------------- | :------: | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `availableColumns` | array of `object` |    ✅    | -      | -       | Sets the available columns to be selected in the column manager component.                                                            |
| `selectedColumns`  | array of `object` |    ✅    | -      | -       | The selected columns to display in the table.                                                                                         |
| `hiddenColumns`    | array of `object` |    ✅    | -      | -       | The hidden columns to display in the hidden section.                                                                                  |
| `onUpdateColumns`  | `func`            |    ✅    | -      | -       | Function that is called when the selectedColumns change. This allows the developer to execute whatever is needed to update the state. |

##### availableColumns & selectedColumns

> For both props, should be an array of objects with the basic info to identify the column

| Props   | Type     | Required | Values | Default | Description                                                      |
| ------- | -------- | :------: | ------ | ------- | ---------------------------------------------------------------- |
| `key`   | `string` |    ✅    | -      | -       | The unique key of the columns that is used to identify your data |
| `label` | `string` |    ✅    | -      | -       | The label of the column that will be shown in the column header  |
