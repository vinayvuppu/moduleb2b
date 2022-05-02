import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import * as globalActions from '@commercetools-frontend/actions-global';
import { injectIntl } from 'react-intl';
import { DOMAINS } from '@commercetools-frontend/constants';
import messages from './messages';

import CompanyForm from '../company-form';
import { docToFormValues, formValuesToDoc } from './conversions';

export class CompanyDetailsGeneralTab extends React.Component {
  static displayName = 'CompanyDetailsGeneralTab';

  static propTypes = {
    companyFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      company: PropTypes.object,
    }),
    companyUpdater: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }),
    companyDefaultShippingUpdater: PropTypes.shape({
      execute: PropTypes.func.isRequired,
    }),
    companyDefaultBillingUpdater: PropTypes.shape({
      execute: PropTypes.func.isRequired,
    }),
    // connect
    showNotification: PropTypes.func.isRequired,
    hideAllPageNotifications: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
      locale: PropTypes.string.isRequired,
    }).isRequired,
  };

  createHandleUpdateCompany = memoize(execute => (draft, formikBag) => {
    this.props.hideAllPageNotifications();

    return execute(formValuesToDoc(draft))
      .then(updatedCompany => {
        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(messages.companyUpdated, {
            name: updatedCompany.name,
          }),
        });
        formikBag.setSubmitting(false);
      })
      .catch(errors => {
        formikBag.setErrors(errors?.errors[0]);
        formikBag.setSubmitting(false);
        this.props.showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: errors?.errors[0].title,
        });
      });
  });
  createHandleUpdateDefaultShipping = memoize(execute => addressId => {
    this.props.hideAllPageNotifications();

    return execute(addressId)
      .then(updatedCompany => {
        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(messages.companyUpdated, {
            name: updatedCompany.name,
          }),
        });
      })
      .catch(errors => {
        this.props.showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: errors?.errors[0].title,
        });
      });
  });
  createHandleUpdateDefaultBilling = memoize(execute => addressId => {
    this.props.hideAllPageNotifications();

    return execute(addressId)
      .then(updatedCompany => {
        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(messages.companyUpdated, {
            name: updatedCompany.name,
          }),
        });
      })
      .catch(errors => {
        this.props.showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: errors?.errors[0].title,
        });
      });
  });

  render() {
    return (
      <CompanyForm
        initialValues={docToFormValues(
          this.props.companyFetcher.company,
          this.props.intl.locale
        )}
        isSaveToolbarAlwaysVisible={false}
        onSubmit={this.createHandleUpdateCompany(
          this.props.companyUpdater.execute
        )}
        onSetDefaultShippingAddress={this.createHandleUpdateDefaultShipping(
          this.props.companyDefaultShippingUpdater.execute
        )}
        onSetDefaultBillingAddress={this.createHandleUpdateDefaultBilling(
          this.props.companyDefaultBillingUpdater.execute
        )}
        onCancel={() => {}}
      />
    );
  }
}

export default flowRight(
  connect(null, {
    showNotification: globalActions.showNotification,
    hideAllPageNotifications: globalActions.hideAllPageNotifications,
  }),
  injectIntl
)(CompanyDetailsGeneralTab);
