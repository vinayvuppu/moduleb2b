import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { Spacings } from '@commercetools-frontend/ui-kit';
import styles from './selectable-panel.mod.css';

export default class SelectablePanel extends React.PureComponent {
  static displayName = 'SelectablePanel';

  static propTypes = {
    header: PropTypes.node.isRequired,
    controls: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool,
  };

  static defaultProps = {
    isOpen: false,
    mode: 'edit',
  };

  render() {
    return (
      <div className={styles['editable-form-box']}>
        <div
          className={classnames({
            [styles.title]: this.props.isOpen,
            [styles['collapsed-title']]: !this.props.isOpen,
          })}
        >
          {this.props.header}
          {this.props.controls}
        </div>
        {this.props.isOpen && (
          <Spacings.Inset scale="s">{this.props.children}</Spacings.Inset>
        )}
      </div>
    );
  }
}
