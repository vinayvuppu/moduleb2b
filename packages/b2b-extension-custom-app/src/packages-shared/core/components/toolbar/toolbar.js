import PropTypes from 'prop-types';
import React from 'react';
import { Text, Spacings } from '@commercetools-frontend/ui-kit';
import classnames from 'classnames';
import styles from './toolbar.mod.css';

const Toolbar = props => (
  <div className={classnames(styles.container, props.containerClassName)}>
    <Spacings.Stack scale="s">
      <div className={props.titleClassName}>
        <Text.Headline as="h2">{props.title}</Text.Headline>
      </div>
      {props.subtitle && (
        <Text.Subheadline as="h5">{props.subtitle}</Text.Subheadline>
      )}
    </Spacings.Stack>
    {props.controls && (
      <div className={props.controlsClassName}>{props.controls}</div>
    )}
  </div>
);

Toolbar.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  controls: PropTypes.node,
  titleClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  controlsClassName: PropTypes.string,
};

Toolbar.displayName = 'Toolbar';

export default Toolbar;
