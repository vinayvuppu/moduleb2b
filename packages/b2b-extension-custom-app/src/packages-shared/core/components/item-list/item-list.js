import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import classnames from 'classnames';
import {
  PlusBoldIcon,
  CloseBoldIcon,
  IconButton,
  Spacings,
} from '@commercetools-frontend/ui-kit';
import keepDisplayName from '../keep-display-name';
import styles from './item-list.mod.css';
import messages from './messages';

export class ItemList extends React.Component {
  static displayName = 'ItemList';

  static propTypes = {
    itemCount: PropTypes.number.isRequired,
    renderItem: PropTypes.func.isRequired,
    getKey: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    canBeEmpty: PropTypes.bool.isRequired,
    shouldGrowItems: PropTypes.bool.isRequired,
    shouldRenderButtons: PropTypes.bool.isRequired,
    // For all new usages of ItemList we should set this prop to true and
    // have the add button in the bottom of the list
    shouldAddToBottom: PropTypes.bool.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  static defaultProps = {
    canBeEmpty: false,
    shouldGrowItems: true,
    shouldRenderButtons: true,
    shouldAddToBottom: false,
  };

  renderAddButton = ({ index }) => {
    const addButton = (
      <IconButton
        label={this.props.intl.formatMessage(messages.addValue)}
        icon={<PlusBoldIcon />}
        size="medium"
        onClick={() => this.props.onAddItem({ index })}
      />
    );
    return this.props.canBeEmpty ? (
      <Spacings.Inline>
        {addButton}
        {this.renderRemoveButton({ index })}
      </Spacings.Inline>
    ) : (
      addButton
    );
  };

  renderRemoveButton = ({ index }) => (
    <IconButton
      label={this.props.intl.formatMessage(messages.removeValue)}
      icon={<CloseBoldIcon />}
      size="medium"
      onClick={() => this.props.onRemoveItem({ index })}
    />
  );

  render() {
    const addItemIndex = this.props.shouldAddToBottom
      ? this.props.itemCount - 1
      : 0;
    return (
      <div>
        {Array.from({ length: this.props.itemCount }).map((_, index) => {
          const renderItemParams = { index };
          if (!this.props.shouldRenderButtons) {
            if (index === addItemIndex)
              renderItemParams.onAddItem = this.props.onAddItem;

            if (this.props.canBeEmpty || index !== addItemIndex)
              renderItemParams.onRemoveItem = this.props.onRemoveItem;
          }

          return (
            <div
              key={this.props.getKey({ index })}
              className={styles['item-container']}
            >
              <div
                className={classnames({
                  [styles['item-grow']]: this.props.shouldGrowItems,
                })}
              >
                {this.props.renderItem(renderItemParams)}
              </div>
              {this.props.shouldRenderButtons && (
                <div className={styles.button}>
                  {index === addItemIndex
                    ? this.renderAddButton({ index })
                    : this.renderRemoveButton({ index })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default compose(keepDisplayName(ItemList), injectIntl)(ItemList);
