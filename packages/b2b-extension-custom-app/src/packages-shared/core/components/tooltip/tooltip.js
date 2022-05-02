import PropTypes from 'prop-types';
import React from 'react';
import requiredIf from 'react-required-if';
import classnames from 'classnames';
import isTouchDevice from 'is-touch-device';
import styles from './tooltip.mod.css';

export class Tooltip extends React.PureComponent {
  static displayName = 'Tooltip';

  static propTypes = {
    // Only useful when the parent components needs the control
    // of the display of the component which requires trigger => `force`.
    // So `display` is a required prop if the `trigger` is "force".
    display: requiredIf(PropTypes.bool, props => props.trigger === 'force'),
    position: PropTypes.oneOf(['top', 'top-right', 'bottom', 'left', 'right']),
    type: PropTypes.oneOf(['warning', 'info', 'error']),
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    autohide: PropTypes.shape({
      enabled: PropTypes.bool,
      timeout: PropTypes.number,
      onHide: PropTypes.func,
    }),
    trigger: PropTypes.oneOf([
      'click',
      'hover',
      // Should the trigger be by force,
      // We need the display prop.
      // see the `displayPropValidator`
      'force',
    ]).isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
  };

  static defaultProps = {
    position: 'top',
    type: 'warning',
    trigger: 'force',
    display: false,
    autohide: { enabled: true, timeout: 5000, onHide: noop },
  };

  state = {
    visible: this.props.trigger === 'force' ? this.props.display : false,
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { display, trigger, autohide } = nextProps;
    const nextVisible = trigger === 'force' ? display : this.state.visible;

    this.setState({ visible: nextVisible });

    if (nextVisible && autohide.enabled) this.setupTimeout();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.lifetimeTimeout = null;
  }

  componentDidMount() {
    if (this.props.autohide.enabled) setTimeout(this.setupTimeout);
  }

  componentWillUnmount() {
    this.isUnmounting = true;
    clearTimeout(this.lifetimeTimeout);
  }

  safelySetState = (...args) => {
    if (!this.isUnmounting) this.setState(...args);
  };

  onMouseEnter = () => {
    if (this.props.display && !isTouchDevice())
      this.safelySetState({ visible: true });
  };

  onMouseLeave = () => {
    if (this.props.display) this.safelySetState({ visible: false });
  };

  onClick = () => {
    this.safelySetState({ visible: true });
    this.setupTimeout();
  };

  show = () => {
    this.safelySetState({ visible: true });

    if (this.props.autohide.enabled) this.setupTimeout();
  };

  hide = () => {
    this.safelySetState({ visible: false }, () => {
      if (this.props.autohide.enabled && this.props.autohide.onHide)
        this.props.autohide.onHide();
    });
  };

  setupTimeout = () => {
    const timeoutID = setTimeout(() => {
      this.hide();
      this.lifetimeTimeout = null;
    }, this.props.autohide.timeout);
    if (this.lifetimeTimeout) clearTimeout(this.lifetimeTimeout);

    this.lifetimeTimeout = timeoutID;
  };

  renderTooltipTop = (tooltipClassName, message) => (
    <div className={tooltipClassName}>
      <div className={styles.body}>{message}</div>
      <div className={styles['arrow-shadow-top']} />
      <div className={styles['arrow-top-border']} />
      <div className={styles['arrow-top']} />
    </div>
  );

  renderTooltipTopRight = (tooltipClassName, message) => (
    <div className={tooltipClassName}>
      <div className={styles.body}>{message}</div>
      <div className={styles['arrow-shadow-top-right']} />
      <div className={styles['arrow-top-right-border']} />
      <div className={styles['arrow-top-right']} />
    </div>
  );

  renderTooltipRight = (tooltipClassName, message) => (
    <div className={tooltipClassName}>
      <div className={styles['arrow-right-border']} />
      <div className={styles['arrow-right']} />
      <div className={styles.body}>{message}</div>
    </div>
  );

  renderTooltipBottom = (tooltipClassName, message) => (
    <div className={tooltipClassName}>
      <div className={styles['arrow-bottom-border']} />
      <div className={styles['arrow-bottom']} />
      <div className={styles.body}>{message}</div>
    </div>
  );

  renderTooltipLeft = (tooltipClassName, message) => (
    <div className={tooltipClassName}>
      <div className={styles['arrow-left-border']} />
      <div className={styles['arrow-left']} />
      <div className={styles.body}>{message}</div>
    </div>
  );

  render = () => {
    const tooltipClassName = classnames(
      styles.container,
      styles[`container-${this.props.position}`],
      styles[`${this.props.type}`],
      { [styles.hide]: !this.state.visible }
    );

    const containerProps = {
      hover: {
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
      },
      force: {},
      click: { onClick: this.onClick },
    };

    let rendererFn = this.renderTooltipTop; // default position
    if (this.props.position === 'top-right')
      rendererFn = this.renderTooltipTopRight;
    if (this.props.position === 'bottom') rendererFn = this.renderTooltipBottom;
    if (this.props.position === 'left') rendererFn = this.renderTooltipLeft;
    if (this.props.position === 'right') rendererFn = this.renderTooltipRight;
    return (
      <div
        {...containerProps[this.props.trigger]}
        className={classnames(this.props.className, styles.box)}
      >
        {rendererFn(tooltipClassName, this.props.message)}
        {this.props.children}
      </div>
    );
  };
}

export default Tooltip;

function noop() {}
