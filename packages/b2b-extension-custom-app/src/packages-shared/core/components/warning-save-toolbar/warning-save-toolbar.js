import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import SaveToolbar from '../save-toolbar';
import WarnOnLeave from '../warn-on-leave';
import keepDisplayName from '../keep-display-name';

/*
This component should be used and placed in a component rendered by the router.
*/
export class WarningSaveToolbar extends React.PureComponent {
  static displayName = 'WarningSaveToolbar';

  static propTypes = {
    // Custom props to replace default ones
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirmLeave: PropTypes.func,

    shouldWarnOnLeave: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
      .isRequired,
    isToolbarVisible: PropTypes.bool.isRequired,
    isToolbarDisabled: PropTypes.bool,

    // called before saving, must return true to proceed
    //   beforeSaveValidator: () => Boolean
    beforeSaveValidator: PropTypes.func.isRequired,

    // Connected
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  static defaultProps = {
    isToolbarDisabled: false,
    beforeSaveValidator() {
      return true;
    },
  };

  handleSave = (...args) => {
    // don't save when contents are invalid
    if (!this.props.beforeSaveValidator()) return null;

    return this.props.onSave(...args);
  };

  render() {
    return (
      <WarnOnLeave
        shouldWarn={this.props.shouldWarnOnLeave}
        onConfirmLeave={this.props.onConfirmLeave}
      >
        <SaveToolbar
          onSave={this.handleSave}
          onCancel={this.props.onCancel}
          isVisible={this.props.isToolbarVisible}
          isDisabled={this.props.isToolbarDisabled}
        />
      </WarnOnLeave>
    );
  }
}
export default compose(
  keepDisplayName(WarningSaveToolbar),
  injectIntl
)(WarningSaveToolbar);
