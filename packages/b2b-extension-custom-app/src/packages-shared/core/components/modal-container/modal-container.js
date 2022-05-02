// NOTE: this component is duplicated in `app-shell/from-core`.
// It's a temporary solution to avoid importing `core` components from AppShell.
// Be careful when you change something here, remember to duplicate the changes.
import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';
import { PORTALS_CONTAINER_ID } from '@commercetools-frontend/constants';

// When running tests, we don't render the AppShell. Instead we mock the
// application context to make the data available to the application under
// test. However, this also means that the AppShell tree is not rendered,
// which contains among other things the <div id="portals-container" />
// element, used to render the modal content.
// Apparently though, when the <Modal> component unmounts between tests, it
// tries to remove the child elements within the parent selector
// ("portals-container") which may have been cleaned up by another test,
// resulting in the <Modal> to throw an NotFoundError.
// To solve this, we can simply use "document.body" as the parent selector
// instead of a specific element that will be cleaned up, resulting in
// console errors (even though the test passes). We only need to to this in
// test environment.
const parentSelector = () =>
  process.env.NODE_ENV === 'test'
    ? document.body
    : document.querySelector(`#${PORTALS_CONTAINER_ID}`);

const ModalContainer = props => (
  <Modal {...props} parentSelector={parentSelector} ariaHideApp={false}>
    {props.children}
  </Modal>
);
ModalContainer.displayName = 'ModalContainer';
ModalContainer.propTypes = {
  children: PropTypes.node,
};

export default ModalContainer;
