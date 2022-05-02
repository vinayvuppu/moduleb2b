import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import startCase from 'lodash.startcase';
import { Link, withRouter, matchPath } from 'react-router-dom';
import styles from './tab-header.mod.css';

const pathWithoutSearch = path => path.split('?')[0];

// Suggested from https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md#link
const LinkWrapper = ({ to, ...props }) => {
  const Component = to ? Link : 'a';

  const toProp = props.state ? { pathname: to, state: props.state } : to;

  return <Component {...{ ...props, to: toProp }}>{props.children}</Component>;
};
LinkWrapper.displayName = 'LinkWrapper';
LinkWrapper.propTypes = {
  to: PropTypes.any,
  state: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export const TabHeader = props => (
  <li
    className={classnames(
      styles['header-list-item'],
      {
        [styles['header-list-item--active']]: Boolean(
          matchPath(props.location.pathname, {
            // strip the search, otherwise the path won't match
            path: pathWithoutSearch(props.to),
            exact: props.exact,
            strict: false,
          })
        ),
      },
      { [styles['header-list-item--disabled']]: props.isDisabled }
    )}
    data-track-event="click"
    data-track-component={startCase(props.name)}
    data-testid={`header-list-item-${props.name}`}
  >
    <LinkWrapper
      to={props.isDisabled ? null : props.to}
      state={props.state}
      className={
        props.isDisabled ? styles['tab-text--disabled'] : styles['tab-text']
      }
    >
      {props.children}
    </LinkWrapper>
  </li>
);

TabHeader.displayName = 'TabHeader';
TabHeader.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  to: PropTypes.any.isRequired,
  state: PropTypes.object,
  isDisabled: PropTypes.bool,
  exact: PropTypes.bool,
  // Injected
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired })
    .isRequired,
};
TabHeader.defaultProps = {
  isDisabled: false,
  exact: false,
};

export default withRouter(TabHeader);
