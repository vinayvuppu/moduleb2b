// NOTE: this component is duplicated in `app-shell/from-core`.
// It's a temporary solution to avoid importing `core` components from AppShell.
// Be careful when you change something here, remember to duplicate the changes.
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import { CloseIcon } from '@commercetools-frontend/ui-kit';
import withMouseOverState from '../../with-mouse-over-state';
import keepDisplayName from '../../keep-display-name';
import styles from './button-close.mod.css';

export const ButtonClose = props => (
  <div
    className={styles['button-close-container']}
    onMouseOver={props.handleMouseOver}
    onMouseOut={props.handleMouseOut}
    onClick={props.onClick}
    data-track-component="Close"
    data-track-event="click"
    data-testid="button-close"
    aria-label="Close dialog"
  >
    <CloseIcon size="medium" color={props.isMouseOver ? 'primary' : 'solid'} />
  </div>
);
ButtonClose.displayName = 'ButtonClose';
ButtonClose.propTypes = {
  onClick: PropTypes.func.isRequired,
  // HoC
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  isMouseOver: PropTypes.bool.isRequired,
};

export default compose(
  keepDisplayName(ButtonClose),
  withMouseOverState
)(ButtonClose);
