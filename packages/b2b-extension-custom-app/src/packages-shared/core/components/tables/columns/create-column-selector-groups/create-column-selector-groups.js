import PropTypes from 'prop-types';
import React from 'react';
import { Text, Spacings } from '@commercetools-frontend/ui-kit';
import { defineMessages, FormattedMessage } from 'react-intl';
import createColumnSelectorList from '../create-column-selector-list';
import styles from './column-selector-groups.mod.css';

const messages = defineMessages({
  columnsHidden: {
    id: 'ColumnSelectorGroups.hidden',
    description: 'A list of all columns not visible',
    defaultMessage: 'Hidden columns',
  },
  columnsVisible: {
    id: 'ColumnSelectorGroups.visible',
    description: 'A list of all columns visible',
    defaultMessage: 'Visible columns',
  },
});

export default function createColumnSelectorGroups(types) {
  const ColumnSelectorList = createColumnSelectorList(types);

  class ColumnSelectorGroups extends React.PureComponent {
    static displayName = 'ColumnSelectorGroups';

    static propTypes = {
      groups: PropTypes.shape({
        left: PropTypes.array.isRequired,
        right: PropTypes.array.isRequired,
      }).isRequired,

      // Renders the element of the list
      // f(x) = React.Element
      itemRenderer: PropTypes.func.isRequired,

      // Handler for item moved to new position event
      onItemMove: PropTypes.func.isRequired,

      // Renders the area to drop new list item
      // f(x) = React.Element
      newItemAreaRenderer: PropTypes.func.isRequired,
    };

    renderGroups = groups =>
      groups.map(group => (
        <ColumnSelectorList
          key={group.name}
          group={group}
          itemRenderer={this.props.itemRenderer}
          onItemMove={this.props.onItemMove}
          newItemAreaRenderer={this.props.newItemAreaRenderer}
        />
      ));

    render() {
      return (
        <Spacings.Inline scale="m" justifyContent="stretch">
          <div className={styles.flex}>
            <Spacings.Stack scale="s">
              <Text.Subheadline as="h4">
                <FormattedMessage {...messages.columnsHidden} />
              </Text.Subheadline>
              {this.renderGroups(this.props.groups.left)}
            </Spacings.Stack>
          </div>
          <div className={styles.flex}>
            <Spacings.Stack scale="s">
              <Text.Subheadline as="h4">
                <FormattedMessage {...messages.columnsVisible} />
              </Text.Subheadline>
              <div className={styles['column-target']}>
                {this.renderGroups(this.props.groups.right)}
              </div>
            </Spacings.Stack>
          </div>
        </Spacings.Inline>
      );
    }
  }

  return ColumnSelectorGroups;
}
