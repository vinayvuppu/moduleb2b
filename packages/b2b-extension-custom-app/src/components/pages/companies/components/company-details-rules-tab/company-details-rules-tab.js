import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import * as globalActions from '@commercetools-frontend/actions-global';

import { DOMAINS } from '@commercetools-frontend/constants';
import messages from './messages';

import CompanyRulesForm from '../company-rules-form';
import {
  docToFormValues,
  formValuesToDoc,
} from '../company-details-general-tab/conversions';

export const CompanyDetailsRulesTab = props => {
  const { formatMessage, locale } = useIntl();

  const createHandleUpdateCompany = memoize(execute => (draft, formikBag) => {
    props.hideAllPageNotifications();

    return execute(formValuesToDoc(draft))
      .then(updatedCompany => {
        props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: formatMessage(messages.companyUpdated, {
            name: updatedCompany.name,
          }),
        });
        formikBag.setSubmitting(false);
      })
      .catch(errors => {
        formikBag.setErrors(errors?.errors[0]);
        formikBag.setSubmitting(false);
        props.showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: errors?.errors[0].title,
        });
      });
  });
  return (
    <CompanyRulesForm
      initialValues={docToFormValues(props.companyFetcher.company, locale)}
      isSaveToolbarAlwaysVisible={false}
      onSubmit={createHandleUpdateCompany(props.companyUpdater.execute)}
      onCancel={() => {}}
    />
  );
};

CompanyDetailsRulesTab.displayName = 'CompanyDetailsRulesTab';

CompanyDetailsRulesTab.propTypes = {
  companyFetcher: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    company: PropTypes.object,
  }),
  companyUpdater: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    execute: PropTypes.func.isRequired,
  }),
  // connect
  showNotification: PropTypes.func.isRequired,
  hideAllPageNotifications: PropTypes.func.isRequired,
};

export default connect(null, {
  showNotification: globalActions.showNotification,
  hideAllPageNotifications: globalActions.hideAllPageNotifications,
})(CompanyDetailsRulesTab);
