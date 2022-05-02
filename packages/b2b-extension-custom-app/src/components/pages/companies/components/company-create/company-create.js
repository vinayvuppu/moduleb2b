import PropTypes from 'prop-types';
import React from 'react';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';
import View from '@commercetools-local/core/components/view';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import ViewHeader from '@commercetools-local/core/components/view-header';
import TabContainer from '@commercetools-local/core/components/tab-container';
import CompanyForm from '../company-form';
import { formValuesToDoc } from './conversions';
import { createCompany } from '../../api';
import messages from './messages';

const initialValues = {
  name: '',
  logo: '',
  channels: [],
  addresses: [],
  requiredApprovalRoles: [],
};

export const CompanyCreate = props => {
  const { formatMessage } = useIntl();
  const { projectKey } = useParams();
  const history = useHistory();
  const {
    environment: { apiUrl },
  } = useApplicationContext();

  const handleSubmit = async (companyDraft, formikBag) => {
    try {
      props.hideAllPageNotifications();
      const company = await createCompany({
        url: apiUrl,
        payload: formValuesToDoc(companyDraft),
      });
      formikBag.setSubmitting(false);
      formikBag.resetForm();
      history.push(oneLineTrim`
      /${projectKey}
      /b2b-extension
      /companies
      /${company.id}
    `);
      props.showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: formatMessage(messages.companyCreated, {
          name: company.name,
        }),
      });
    } catch (error) {
      formikBag.setErrors(error);
      formikBag.setSubmitting(false);

      props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: error?.errors[0]?.title,
      });
    }
  };

  const handleCancel = () => {
    history.push(oneLineTrim`
      /${projectKey}
      /b2b-extension
      /companies
    `);
  };

  return (
    <div data-track-component="CompanyCreate">
      <View>
        <ViewHeader title={formatMessage(messages.title)} />
        <TabContainer>
          <CompanyForm
            initialValues={initialValues}
            isSaveToolbarAlwaysVisible={false}
            onSubmit={(draft, formikBag) => handleSubmit(draft, formikBag)}
            onCancel={handleCancel}
          />
        </TabContainer>
      </View>
    </div>
  );
};

CompanyCreate.propTypes = {
  showNotification: PropTypes.func.isRequired,
  hideAllPageNotifications: PropTypes.func.isRequired,
};
CompanyCreate.displayName = 'CompanyCreate';

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
  hideAllPageNotifications: globalActions.hideAllPageNotifications,
};

export default connect(null, mapDispatchToProps)(CompanyCreate);
