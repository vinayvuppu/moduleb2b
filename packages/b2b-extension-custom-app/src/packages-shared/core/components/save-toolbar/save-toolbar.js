import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import { ButtonCancel, ButtonSave } from '../buttons';
import styles from './save-toolbar.mod.css';

export const SaveToolbar = props => {
  if (!props.isVisible) return null;
  return (
    <Fragment>
      {props.isVisible && <PageBottomSpacer />}
      <div className={styles.container}>
        <ul className={styles['list-left']}>
          <li className={styles['list-item']}>
            <ButtonCancel
              onClick={props.onCancel}
              style="alternative"
              data-track-component="SaveToolbar"
              data-track-event="click"
              data-track-label="cancel"
              data-testid="save-toolbar-cancel"
            />
          </li>
        </ul>
        <ul className={styles['list-right']}>
          <li className={styles['list-item']}>
            <ButtonSave
              style="alternative"
              label={props.saveLabel}
              onClick={props.onSave}
              isDisabled={props.isDisabled}
              data-track-component="SaveToolbar"
              data-track-event="click"
              data-track-label="save"
              data-testid="save-toolbar-save"
            />
          </li>
        </ul>
      </div>
    </Fragment>
  );
};

SaveToolbar.displayName = 'SaveToolbar';
SaveToolbar.defaultProps = { isVisible: false };
SaveToolbar.propTypes = {
  isVisible: PropTypes.bool,
  isDisabled: PropTypes.bool,
  saveLabel: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SaveToolbar;
