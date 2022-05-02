/* eslint-disable global-require, react/prop-types, react/display-name */
jest.mock('@commercetools-frontend/ui-kit', () => {
  const React = require('react');
  class MockedTable extends React.Component {
    componentDidMount() {
      if (this.props.registerMeasurementCache) {
        this.props.registerMeasurementCache({
          clearAll: () => {},
        });
      }
    }
    render() {
      return (
        <div>
          <table>
            <thead>
              <tr>
                {this.props.columns.map(column => (
                  <td key={column.key}>{column.label}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.props.items.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {this.props.columns.map(column => (
                    <td
                      key={column.key}
                      data-testid={`cell-${rowIndex}-${column.key}`}
                      onClick={() =>
                        this.props.onRowClick
                          ? this.props.onRowClick(column.key, rowIndex)
                          : null
                      }
                    >
                      {this.props.itemRenderer({
                        rowIndex,
                        columnKey: column.key,
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {this.props.children}
        </div>
      );
    }
  }
  return {
    ...jest.requireActual('@commercetools-frontend/ui-kit'),
    Table: MockedTable,
  };
});
