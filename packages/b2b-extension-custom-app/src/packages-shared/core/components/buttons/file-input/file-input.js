import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styles from './file-input.mod.css';
import messages from './messages';

const FileInput = props => (
  <label>
    <span className={styles.button}>
      <input
        className={styles.input}
        type="file"
        accept={props.acceptTypes}
        name={props.name}
        onChange={props.onChange}
        multiple={props.allowMultiple}
      />
      {props.children}
    </span>
  </label>
);

FileInput.displayName = 'FileInput';
FileInput.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  acceptTypes: PropTypes.string.isRequired,
  name: PropTypes.string,
  allowMultiple: PropTypes.bool,
};
FileInput.defaultProps = {
  children: <FormattedMessage {...messages.chooseFile} />,
  allowMultiple: false,
  acceptTypes: 'image/png,image/jpeg,image/gif',
};
export default FileInput;
