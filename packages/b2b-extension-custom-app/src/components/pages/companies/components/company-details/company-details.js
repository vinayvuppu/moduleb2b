import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import { oneLineTrim } from 'common-tags';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  BinLinearIcon,
  IconButton,
  LoadingSpinner,
  Text,
  SecondaryButton,
  PlusBoldIcon,
} from '@commercetools-frontend/ui-kit';
import {
  PageNotFound,
  ConfirmationDialog,
} from '@commercetools-frontend/application-components';
import { DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';

import {
  injectAuthorized,
  RestrictedByPermissions,
} from '@commercetools-frontend/permissions';
import memoize from 'memoize-one';

import { withModalState } from '@commercetools-local/core/components/modal-state-container';
import View from '@commercetools-local/core/components/view';
import ViewHeader from '@commercetools-local/core/components/view-header';
import TabHeader from '@commercetools-local/core/components/tab-header';
import TabContainer from '@commercetools-local/core/components/tab-container';
import BackToList from '@commercetools-local/core/components/back-to-list';
import { PERMISSIONS } from '../../../../../constants';
import messages from './messages';
import styles from './company-details.mod.css';

export const TAB_NAMES = {
  GENERAL: 'general',
  RULES: 'rules',
  EMPLOYEES: 'employees',
};

export class CompanyDetails extends React.PureComponent {
  static displayName = 'CompanyDetails';

  static propTypes = {
    children: PropTypes.node.isRequired,

    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,

    projectKey: PropTypes.string.isRequired,
    companyId: PropTypes.string.isRequired,

    companyDeleter: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }).isRequired,
    companyFetcher: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      company: PropTypes.object,
    }).isRequired,

    // injectIntl
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
    // connect
    showNotification: PropTypes.func.isRequired,
    hideAllPageNotifications: PropTypes.func.isRequired,
    // withModalState
    deletionConfirmationModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      handleOpen: PropTypes.func.isRequired,
      handleClose: PropTypes.func.isRequired,
    }).isRequired,
  };

  createHandleDeleteCompany = memoize(execute => () => {
    this.props.hideAllPageNotifications();

    return execute()
      .then(deletedCompany => {
        this.props.deletionConfirmationModal.handleClose();

        this.props.showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(messages.companyDeleted, {
            name: deletedCompany.name,
          }),
        });

        this.props.history.replace(oneLineTrim`
        /${this.props.projectKey}
        /b2b-extension
        /companies
      `);
      })
      .catch(error => {
        const codeError = error?.errors?.length
          ? error.errors[0].code
          : undefined;

        this.props.showNotification({
          kind: 'error',
          domain: DOMAINS.SIDE,
          text: this.props.intl.formatMessage(
            codeError === '002'
              ? messages.companyWithEntitiesFailure
              : messages.companyDeletedFailure
          ),
        });
      });
  });

  render() {
    if (this.props.companyFetcher.isLoading) return <LoadingSpinner />;

    if (!this.props.companyFetcher.company) return <PageNotFound />;

    return (
      <div data-track-component="CompanyUpdate">
        <View>
          <ViewHeader
            title={this.props.companyFetcher.company.name}
            backToList={
              <RestrictedByPermissions
                permissions={[PERMISSIONS.ManageCompanies]}
              >
                <BackToList
                  to={oneLineTrim`
                        /${this.props.projectKey}
                        /b2b-extension
                        /companies
                      `}
                  label={this.props.intl.formatMessage(messages.backToList)}
                />
              </RestrictedByPermissions>
            }
            commands={
              <div className={styles.commands}>
                <RestrictedByPermissions
                  permissions={[PERMISSIONS.ManageCompanies]}
                >
                  <SecondaryButton
                    iconLeft={<PlusBoldIcon />}
                    data-track-component="AddEmployeeButton"
                    data-track-event="click"
                    label={this.props.intl.formatMessage(messages.addEmployee)}
                    linkTo={`/${this.props.projectKey}/b2b-extension/companies/${this.props.companyId}/employees/new`}
                    isDisabled={false}
                  />
                </RestrictedByPermissions>
                <RestrictedByPermissions
                  permissions={[PERMISSIONS.ManageCompanies]}
                >
                  <IconButton
                    label={this.props.intl.formatMessage(messages.labelDelete)}
                    icon={<BinLinearIcon />}
                    onClick={this.props.deletionConfirmationModal.handleOpen}
                  />
                </RestrictedByPermissions>
              </div>
            }
          >
            <TabHeader
              key={TAB_NAMES.GENERAL}
              name={TAB_NAMES.GENERAL}
              to={oneLineTrim`
                  /${this.props.projectKey}
                  /b2b-extension
                  /companies
                  /${this.props.companyId}
                  /${TAB_NAMES.GENERAL}
                `}
            >
              {this.props.intl.formatMessage(messages.tabGeneral)}
            </TabHeader>
            <TabHeader
              key={TAB_NAMES.RULES}
              name={TAB_NAMES.RULES}
              to={oneLineTrim`
                  /${this.props.projectKey}
                  /b2b-extension
                  /companies
                  /${this.props.companyId}
                  /${TAB_NAMES.RULES}
                `}
            >
              {this.props.intl.formatMessage(messages.tabRules)}
            </TabHeader>
            <TabHeader
              key={TAB_NAMES.EMPLOYEES}
              name={TAB_NAMES.EMPLOYEES}
              to={oneLineTrim`
                  /${this.props.projectKey}
                  /b2b-extension
                  /companies
                  /${this.props.companyId}
                  /${TAB_NAMES.EMPLOYEES}
                `}
            >
              {this.props.intl.formatMessage(messages.tabEmployees)}
            </TabHeader>
          </ViewHeader>
          <TabContainer>{this.props.children}</TabContainer>
        </View>
        {this.props.deletionConfirmationModal.isOpen && (
          <ConfirmationDialog
            title={this.props.intl.formatMessage(messages.confirmDeleteTitle)}
            isOpen={true}
            labelPrimary={messages.confirmDeleteButton}
            onClose={this.props.deletionConfirmationModal.handleClose}
            onCancel={this.props.deletionConfirmationModal.handleClose}
            onConfirm={this.createHandleDeleteCompany(
              this.props.companyDeleter.execute
            )}
          >
            <Text.Body>
              <FormattedMessage {...messages.confirmDeleteMessage} />
            </Text.Body>
          </ConfirmationDialog>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
  hideAllPageNotifications: globalActions.hideAllPageNotifications,
};

export default flowRight(
  injectAuthorized([PERMISSIONS.ManageCompanies]),
  connect(null, mapDispatchToProps),
  injectIntl,
  withModalState('deletionConfirmationModal')
)(CompanyDetails);
