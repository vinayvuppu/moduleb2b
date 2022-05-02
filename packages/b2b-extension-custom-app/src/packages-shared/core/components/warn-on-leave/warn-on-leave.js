import PropTypes from 'prop-types';
import React from 'react';
import { Prompt, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import messages from './messages';

export class WarnOnLeave extends React.PureComponent {
  static displayName = 'WarnOnLeave';

  static propTypes = {
    // NOTE: a bit more info as "why we might need it to be a function".
    // https://github.com/commercetools/merchant-center-frontend/pull/3675#discussion_r164978424
    shouldWarn: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
      .isRequired,
    // Callback when user confirmed exit
    //
    // TODO remove onConfirmLeave workaround:
    // Usually we should be able to just use componentWillUnmount of WarnOnLeave
    // but since some components using WarnOnLeave don't get unmounted we have
    // to hack around this problem. Once all components use the router properly
    // and are unmounted when their route is left `onConfirmLeave` can be
    // called from the componentWillUnmount lifecycle hook.
    onConfirmLeave: PropTypes.func,
    // This component accepts children in case the component using WarnOnLeave
    // renders a single child, so that component can wrap its single child
    // with WarnOnLeave.
    // Example:
    //   render () { return <WarnOnLeave><input type="password"></WarnOnLeave> }
    children: PropTypes.node,
    // Injected
    history: PropTypes.shape({
      listen: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    children: null,
  };

  componentDidMount() {
    this.unlisten = this.props.history.listen(() => {
      if (this.getShouldWarn() && this.props.onConfirmLeave) {
        this.props.onConfirmLeave();
      }
    });
    window.addEventListener('beforeunload', this.setWarningMessage);
  }

  componentWillUnmount() {
    this.unlisten();
    window.removeEventListener('beforeunload', this.setWarningMessage);
  }

  setWarningMessage = event => {
    const shouldWarn = this.getShouldWarn();
    if (shouldWarn) {
      const message = this.props.intl.formatMessage(messages.version2);
      // eslint-disable-next-line no-param-reassign
      event.returnValue = message; // Gecko, Trident, Chrome 34+
      return message;
    }
    return null;
  };

  getShouldWarn = (...args) =>
    typeof this.props.shouldWarn === 'function'
      ? this.props.shouldWarn(...args)
      : this.props.shouldWarn;

  handleMessage = (...args) => {
    const shouldWarn = this.getShouldWarn(...args);
    // return undefined rather than false since false would block the
    // transition without showing a prompt
    if (!shouldWarn) return undefined;
    return typeof shouldWarn === 'string'
      ? shouldWarn
      : this.props.intl.formatMessage(messages.version1);
  };

  render() {
    return (
      <React.Fragment>
        <Prompt key="prompt" message={this.handleMessage} />
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default compose(withRouter, injectIntl)(WarnOnLeave);
