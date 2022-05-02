import React from 'react';
import { wrapDisplayName } from 'recompose';
import PropTypes from 'prop-types';
import { defaultMemoize } from 'reselect';

export default class ModalStateContainer extends React.PureComponent {
  static displayName = 'ModalStateContainer';

  static propTypes = {
    isDefaultOpen: PropTypes.bool.isRequired,
    children: PropTypes.func,
    render: PropTypes.func,
  };

  static defaultProps = {
    isDefaultOpen: false,
  };

  state = { isOpen: this.props.isDefaultOpen };

  handleClose = () => this.setState({ isOpen: false });
  handleOpen = () => this.setState({ isOpen: true });

  render() {
    if (typeof this.props.render === 'function')
      return this.props.render({
        handleOpen: this.handleOpen,
        handleClose: this.handleClose,
        isOpen: this.state.isOpen,
      });

    if (typeof this.props.children === 'function')
      return this.props.children({
        handleOpen: this.handleOpen,
        handleClose: this.handleClose,
        isOpen: this.state.isOpen,
      });

    return null;
  }
}

export const withModalState = (propName = 'modal') => WrappedComponent => {
  const createApi = defaultMemoize((isOpen, handleOpen, handleClose) => ({
    isOpen,
    handleOpen,
    handleClose,
  }));

  return class extends React.Component {
    static displayName = wrapDisplayName(WrappedComponent, 'withModalState');

    render() {
      return (
        <ModalStateContainer>
          {({ isOpen, handleOpen, handleClose }) => {
            const modalProp = {
              [propName]: createApi(isOpen, handleOpen, handleClose),
            };

            return <WrappedComponent {...this.props} {...modalProp} />;
          }}
        </ModalStateContainer>
      );
    }
  };
};
