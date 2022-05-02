import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CollapsiblePanel, TextField } from '@commercetools-frontend/ui-kit';
import FormBox from '@commercetools-local/core/components/form-box';
import messages from './messages';

export class CompanyInfoSubform extends React.PureComponent {
  static displayName = 'CompanyInfoSubform';

  static propTypes = {
    formik: PropTypes.shape({
      values: PropTypes.shape({
        companyName: PropTypes.string,
        vatId: PropTypes.string,
      }).isRequired,
      handleChange: PropTypes.func.isRequired,
    }).isRequired,
    canManageEmployees: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <CollapsiblePanel
        header={
          <CollapsiblePanel.Header>
            <FormattedMessage {...messages.panelTitle} />
          </CollapsiblePanel.Header>
        }
      >
        <FormBox>
          <TextField
            title={<FormattedMessage {...messages.labelCompanyName} />}
            isDisabled={!this.props.canManageEmployees}
            name="companyName"
            value={this.props.formik.values.companyName}
            onChange={this.props.formik.handleChange}
          />
        </FormBox>

        <FormBox>
          <TextField
            title={<FormattedMessage {...messages.labelVatId} />}
            isDisabled={!this.props.canManageEmployees}
            name="vatId"
            value={this.props.formik.values.vatId}
            onChange={this.props.formik.handleChange}
          />
        </FormBox>
      </CollapsiblePanel>
    );
  }
}

export default CompanyInfoSubform;
