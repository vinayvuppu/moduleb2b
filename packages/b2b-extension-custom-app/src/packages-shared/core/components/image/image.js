import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import NoImageIcon from '@commercetools-frontend/assets/images/camera.svg';
import BrokenIcon from '@commercetools-frontend/assets/images/camera-crossed.svg';
import ExternalIcon from '@commercetools-frontend/assets/images/camera-chain.svg';
import BrokenExternalIcon from '@commercetools-frontend/assets/images/camera-chain-broken.svg';
import styles from './image.mod.css';

const imgExtRegex = /.[^.]+$/;

class Image extends React.PureComponent {
  static displayName = 'Image';

  static propTypes = {
    /** The url of the image to display */
    url: PropTypes.string.isRequired,
    /** The size of the image to show.
     * Only affects images hosted on the following domains:
     * rackcdn.com, commercetools.de, commercetools.com
     */
    size: PropTypes.oneOf(['thumb', 'small', 'medium', 'large', 'zoom']),
    className: PropTypes.string,
    regex: PropTypes.shape({
      search: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp),
      ]),
      replace: PropTypes.string,
      flags: PropTypes.string,
    }),
    useExternalIconAsFallback: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    size: 'thumb',
    useExternalIconAsFallback: true,
  };

  state = {
    src: formatUrl(this.props),
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ src: formatUrl(nextProps) });
  }

  handleError = () => {
    const isExternal = !isInternal(this.props.url);
    this.setState({
      src: isExternal ? BrokenExternalIcon : BrokenIcon,
    });
  };

  render() {
    const imageStyle = classnames(this.props.className, styles.image);
    return (
      <img
        className={imageStyle}
        src={this.state.src}
        onError={this.handleError}
      />
    );
  }
}

export default Image;

function formatUrl(props) {
  const { useExternalIconAsFallback, url, size, regex } = props;

  if (isInternalPlaceholder(url)) return url;

  if (isInternal(url)) {
    // We expect the url to end with an img extension
    const ext = url.match(imgExtRegex)[0];
    return url.replace(imgExtRegex, `-${size}${ext}`);
  }

  if (regex && regex.search && regex.replace && regex.flag) {
    const { search, replace, flag } = regex;
    // is `search` an instance of RegExp?
    // return a replaced string
    if (search instanceof RegExp) return url.replace(search, replace);

    const searchToReplace = new RegExp(search, flag);
    return url.replace(searchToReplace, replace);
  }

  // isInternal or explicitly skip fallback?
  // return url as is.
  if (!useExternalIconAsFallback) return url;

  return url.replace(url, ExternalIcon);
}

function isInternal(url) {
  return (
    url.includes('rackcdn.com') ||
    url.includes('commercetools.de') ||
    url.includes('commercetools.com')
  );
}

function isInternalPlaceholder(url) {
  return url.includes(NoImageIcon) || url.substring(0, 4) === 'data';
}
