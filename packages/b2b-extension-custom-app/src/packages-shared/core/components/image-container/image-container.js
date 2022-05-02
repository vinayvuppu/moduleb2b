import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import classnames from 'classnames';
import NoImageIcon from '@commercetools-frontend/assets/images/camera.svg';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import { GetProjectExtensionImageRegex } from '@commercetools-frontend/application-shell-connectors';
import styles from './image-container.mod.css';
import Image from '../image';

// NOTE: we had to split the component into separate pieces (layout, connector)
// so that those can be used in some special cases.
// See https://github.com/commercetools/merchant-center-frontend/pull/5305#issuecomment-415685705
// Once that problem would be fixed, we can re-merge the pieces into one component.
const ImageContainer = props => (
  <div className={classnames(props.containerClassName, styles.container)}>
    <div
      className={classnames(
        props.imageContainerClassName,
        styles['image-container']
      )}
    >
      <GetProjectExtensionImageRegex
        render={({ isLoading, imageRegex }) => {
          if (isLoading) return <LoadingSpinner />;
          return (
            <Image
              className={props.imageClassName}
              {...omit(props, ['counter'])}
              regex={imageRegex && imageRegex[props.size]}
              useExternalIconAsFallback={props.useExternalIconAsFallback}
            />
          );
        }}
      />
    </div>
    {typeof props.counter === 'number' && (
      <div className={styles.counter}>{props.counter}</div>
    )}
  </div>
);
ImageContainer.displayName = 'ImageContainer';
ImageContainer.propTypes = {
  counter: PropTypes.number,
  containerClassName: PropTypes.string,
  imageContainerClassName: PropTypes.string,
  imageClassName: PropTypes.string,
  useExternalIconAsFallback: PropTypes.bool,
  url: PropTypes.string,
  // From <Image>
  size: PropTypes.oneOf(['thumb', 'small', 'medium', 'large', 'zoom']),
};

ImageContainer.defaultProps = {
  url: NoImageIcon,
  size: 'thumb',
};

export default ImageContainer;
