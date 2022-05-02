import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './basic-table.mod.css';

export const getColumnAlignmentClassname = align => {
  if (align === 'center') return styles['column-aligned-center'];
  if (align === 'right') return styles['column-aligned-right'];
  return styles['column-aligned-left'];
};

export class BasicTable extends React.PureComponent {
  static displayName = 'BasicTable';

  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        /* The unique key of the columns that is used to identify your data. */
        key: PropTypes.string.isRequired,
        /* The horizontal alignment of the table column content */
        align: PropTypes.oneOf(['left', 'center', 'right']),
        /* The label of the column that will be shown in the column header. */
        label: PropTypes.node,
        style: PropTypes.object,
      })
    ),
    items: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    ).isRequired,
    itemRenderer: PropTypes.func.isRequired,
    components: PropTypes.shape({
      header: PropTypes.node,
      footer: PropTypes.node,
    }),
  };

  static defaultProps = { components: {} };

  render() {
    return (
      <div className={styles['table-container']}>
        <table className={styles.table}>
          {this.props.components.header && (
            <tbody>
              <tr>
                <td
                  className={styles.component}
                  colSpan={this.props.columns.length}
                >
                  {this.props.components.header}
                </td>
              </tr>
            </tbody>
          )}
          <thead>
            <tr>
              {this.props.columns.map(columnDefinition => (
                <th
                  className={classnames(
                    styles['column-header'],
                    getColumnAlignmentClassname(columnDefinition.align)
                  )}
                  key={columnDefinition.key}
                >
                  <div style={columnDefinition.style}>
                    {columnDefinition.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.items.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {this.props.columns.map(columnDefinition => (
                  <td
                    key={columnDefinition.key}
                    className={classnames(
                      styles.cell,
                      getColumnAlignmentClassname(columnDefinition.align)
                    )}
                  >
                    <div style={columnDefinition.style}>
                      {this.props.itemRenderer({
                        rowIndex,
                        columnKey: columnDefinition.key,
                      })}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {this.props.components.footer && (
            <tbody>
              <tr>
                <td
                  className={styles.component}
                  colSpan={this.props.columns.length}
                >
                  {this.props.components.footer}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    );
  }
}

export default BasicTable;
