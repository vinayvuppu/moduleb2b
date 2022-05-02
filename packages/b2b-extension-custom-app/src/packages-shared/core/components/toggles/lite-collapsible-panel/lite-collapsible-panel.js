import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import {
  AngleDownIcon,
  AngleRightIcon,
  CollapsibleMotion,
  IconButton,
  Text,
} from '@commercetools-frontend/ui-kit';
import styles from './lite-collapsible-panel.mod.css';
import messages from './messages';

export const PlainLiteCollapsiblePanel = React.forwardRef((props, ref) => (
  <div className={styles.container}>
    <div className={styles.header}>
      <IconButton
        label={
          props.isOpen
            ? props.intl.formatMessage(messages.collapse)
            : props.intl.formatMessage(messages.expand)
        }
        isToggleButton={false}
        icon={
          props.isOpen ? (
            <AngleDownIcon size="medium" />
          ) : (
            <AngleRightIcon size="medium" />
          )
        }
        onClick={props.onToggle}
        size="small"
      />
      <div className={styles['title-wrapper']} onClick={props.onToggle}>
        <Text.Subheadline as="h5">
          <span className={styles.title}>{props.title}</span>{' '}
          {props.secondaryTitle}
        </Text.Subheadline>
      </div>
      {props.headerControls && (
        <div className={styles['header-controls']}>{props.headerControls}</div>
      )}
    </div>
    <div style={props.style}>
      <div ref={ref} className={styles.content}>
        {props.children}
      </div>
    </div>
  </div>
));

PlainLiteCollapsiblePanel.displayName = 'PlainLiteCollapsiblePanel';
PlainLiteCollapsiblePanel.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  headerControls: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  secondaryTitle: PropTypes.node,
  // HoC
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
};

export const LiteCollapsiblePanel = ({
  title,
  headerControls,
  children,
  intl,
  secondaryTitle,
}) => (
  <CollapsibleMotion>
    {({ isOpen, toggle, containerStyles, registerContentNode }) => (
      <PlainLiteCollapsiblePanel
        ref={registerContentNode}
        style={containerStyles}
        title={title}
        headerControls={headerControls}
        isOpen={isOpen}
        onToggle={toggle}
        intl={intl}
        secondaryTitle={secondaryTitle}
      >
        {children}
      </PlainLiteCollapsiblePanel>
    )}
  </CollapsibleMotion>
);
LiteCollapsiblePanel.displayName = 'LiteCollapsiblePanel';
LiteCollapsiblePanel.propTypes = {
  title: PropTypes.node.isRequired,
  headerControls: PropTypes.node,
  secondaryTitle: PropTypes.node,
  children: PropTypes.node.isRequired,
  // HoC
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
};

export default injectIntl(LiteCollapsiblePanel);
