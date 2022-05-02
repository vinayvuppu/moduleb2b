import PropTypes from 'prop-types';
import React from 'react';
import { Collapsible } from '@commercetools-frontend/ui-kit';
import localizedField from '../localized-field';
import ExpandableField from '../expandable-field';

const LocalizedTextarea = props =>
  // If there is a `onToggle` function, we assume that the toggle state
  // will be handled outside of this component (e.g. settings).
  // If not, we keep a local state using the `Collapsible` component.
  props.onToggle ? (
    <ExpandableField
      {...props}
      onKeyUp={noop} // For ThrottledField
      isExpanded={props.autoExpand || props.isExpanded}
      onToggle={props.onToggle}
    />
  ) : (
    <Collapsible isDefaultClosed={true}>
      {({ isOpen, toggle }) => (
        <ExpandableField
          {...props}
          onKeyUp={noop} // For ThrottledField
          isExpanded={isOpen}
          onToggle={toggle}
        />
      )}
    </Collapsible>
  );

LocalizedTextarea.displayName = 'LocalizedTextarea';
LocalizedTextarea.defaultProps = {
  // Returning `null` or `undefined` doesn't update the `textarea`.
  // See https://github.com/facebook/react/issues/2533
  value: '',
  isExpanded: false,
  disabled: false,
};
LocalizedTextarea.propTypes = {
  autoExpand: PropTypes.bool,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func,
  // TODO define this prop type in ExpandableField
  expandableFieldModalClassName: PropTypes.string,
  textAreaClassName: PropTypes.string,
  disabled: PropTypes.bool,
};

export default localizedField(LocalizedTextarea);

function noop() {}
