import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@commercetools-frontend/ui-kit';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import ButtonClose from '../buttons/button-close';
import styles from './modal-content-layout.mod.css';

const ModalContentLayout = props => {
  const dataAttrProps = filterDataAttributes(props);
  return (
    <div className={styles.container} {...dataAttrProps}>
      <div className={styles.header}>
        {Boolean(props.onClose) && (
          <div className={styles['button-close']}>
            <ButtonClose onClick={props.onClose} />
          </div>
        )}
        <Text.Headline as="h2">{props.title}</Text.Headline>
        <div className={styles.subheader}>
          <div className={styles.subtitle}>{props.subtitle}</div>
          <div>{props.controls}</div>
        </div>
      </div>
      <div className={styles.content}>{props.children}</div>
      {props.footer && <div className={styles.footer}>{props.footer}</div>}
    </div>
  );
};
ModalContentLayout.displayName = 'ModalContentLayout';
ModalContentLayout.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  onClose: PropTypes.func,
  controls: PropTypes.node,
};

export default ModalContentLayout;
