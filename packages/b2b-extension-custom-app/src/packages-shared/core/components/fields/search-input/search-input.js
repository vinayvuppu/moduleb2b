import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { deepEqual } from 'fast-equals';
import classnames from 'classnames';
import { compose } from 'recompose';
import { SearchIcon } from '@commercetools-frontend/ui-kit';
import keepDisplayName from '../../keep-display-name';
import withMouseOverState from '../../with-mouse-over-state';
import ThrottledField from '../throttled-field';
import styles from './search-input.mod.css';
import messages from './messages';

export class SearchInput extends React.Component {
  static displayName = 'SearchInput';

  static propTypes = {
    initialValue: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    shouldSubmitOnInputChange: PropTypes.bool,
    placeholder: PropTypes.string,
    blockClassName: PropTypes.string,
    containerClassName: PropTypes.string,
    throttleMS: PropTypes.number,
    onChange: PropTypes.func,
    requiresResetInput: PropTypes.func,
    disabled: PropTypes.bool,
    shouldClearOnSubmit: PropTypes.bool,
    inputRef: PropTypes.func,
    iconColor: PropTypes.string,
    testId: PropTypes.string,

    // HoC
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    handleMouseOver: PropTypes.func.isRequired,
    handleMouseOut: PropTypes.func.isRequired,
    isMouseOver: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    throttleMS: 300,
  };

  state = {
    initialValue: this.props.initialValue,
    text: this.props.initialValue || '',
  };

  shouldComponentUpdate(nextProps, nextState) {
    // ignore state, since it is only use to keep track of the text in the child
    // component, in order to have it ready when the submit button is pressed
    return (
      !deepEqual(this.props, nextProps, { strict: true }) ||
      nextState.text !== this.state.text
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.initialValue !== nextProps.initialValue) {
      return {
        initialValue: nextProps.initialValue,
        text: nextProps.initialValue || '',
      };
    }
    return null;
  }

  handleInputChange = event => {
    const {
      target: { value },
    } = event;
    this.setState({ text: value }, () => {
      if (this.props.shouldSubmitOnInputChange) this.props.onSubmit(value);
      if (this.props.onChange) this.props.onChange(value);
    });
  };

  handleEnter = value => {
    this.setState({ text: this.props.shouldClearOnSubmit ? '' : value });
    this.props.onSubmit(value);
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.text);
    this.props.shouldClearOnSubmit && this.setState({ text: '' });
  };

  render() {
    return (
      <div
        className={classnames(this.props.blockClassName, styles.block)}
        data-track-component="Search"
      >
        <div
          className={classnames(
            this.props.containerClassName,
            styles.container
          )}
        >
          <div
            className={classnames(styles['input-container'], {
              [styles['input-container-hoverable']]: !this.props.disabled,
            })}
          >
            <ThrottledField
              style="primary"
              name="search-text"
              data-testid={this.props.testId || 'search-input'}
              value={this.state.text}
              placeholder={
                this.props.placeholder ||
                this.props.intl.formatMessage(messages.placeholder)
              }
              inputRef={this.props.inputRef}
              data-track-component="Text"
              data-track-event="change"
              onChange={this.handleInputChange}
              onEnter={this.handleEnter}
              onBlurValue={this.props.onBlur}
              throttleMS={this.props.throttleMS}
              disabled={this.props.disabled}
            />
          </div>
          <div
            className={classnames(styles['icon-container'], {
              [styles['icon-container-hoverable']]: !this.props.disabled,
            })}
            onClick={this.props.disabled ? null : this.handleSubmit}
            data-testid="search-button"
            data-track-component="Button"
            data-track-event="click"
            onMouseOver={this.props.handleMouseOver}
            onMouseOut={this.props.handleMouseOut}
          >
            <SearchIcon
              color={
                this.props.iconColor ||
                (this.props.isMouseOver && !this.props.disabled)
                  ? 'primary'
                  : 'solid'
              }
              size="big"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  keepDisplayName(SearchInput),
  withMouseOverState,
  injectIntl
)(SearchInput);
