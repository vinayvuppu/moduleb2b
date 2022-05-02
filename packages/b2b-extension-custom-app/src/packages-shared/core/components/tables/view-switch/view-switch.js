import PropTypes from 'prop-types';
import React from 'react';

// TODO: not used at the moment
export default class extends React.PureComponent {
  // FIXME: find better naming
  static displayName = 'ViewSwitch';

  static propTypes = {
    onSwitchToView: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div {...this.props}>
        <button onClick={() => this.props.onSwitchToView('table')}>
          {'Table view'}
        </button>
        <button onClick={() => this.props.onSwitchToView('split')}>
          {'Split view'}
        </button>
      </div>
    );
  }
}
