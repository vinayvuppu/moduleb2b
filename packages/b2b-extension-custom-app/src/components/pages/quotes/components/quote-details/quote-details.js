import PropTypes from 'prop-types';
import React, { useState, Fragment, useContext } from 'react';
import { connect } from 'react-redux';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { useIntl, FormattedMessage } from 'react-intl';
import { useRouteMatch, useHistory } from 'react-router-dom';

import {
  LoadingSpinner,
  Spacings,
  SecondaryButton,
  ReviewIcon,
  Text,
  PrimaryButton,
  CheckInactiveIcon,
  CartIcon,
} from '@commercetools-frontend/ui-kit';
import { RestrictedByPermissions } from '@commercetools-frontend/permissions';

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import BackToList from '@commercetools-local/core/components/back-to-list';
import * as globalActions from '@commercetools-frontend/actions-global';
import View from '@commercetools-local/core/components/view';
import ViewHeader from '@commercetools-local/core/components/view-header';
import TabHeader from '@commercetools-local/core/components/tab-header';
import TabContainer from '@commercetools-local/core/components/tab-container';
import {
  PageNotFound,
  ConfirmationDialog,
} from '@commercetools-frontend/application-components';
import { DOMAINS } from '@commercetools-frontend/constants';
import { ORDER_CREATE_TAB_NAMES } from '../../../my-company/components/order-create/constants';
import { PERMISSIONS } from '../../../../../constants';
import messages from './messages';
import { QUOTE_TYPES, QUOTE_DETAILS_TAB_NAMES } from '../../constants';

import EmployeeDetailsConnector from '../../../my-company/components/employee-detail-connector';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context/context';

export const QuoteDetails = props => {
  const intl = useIntl();
  const routeMatch = useRouteMatch();
  const history = useHistory();
  const { formatMessage } = intl;

  const [confirmDialogOpen, setConfirmDialog] = useState(false);
  const [quoteStateAction, setQuoteStateAction] = useState();

  const closeDialog = () => {
    setConfirmDialog(false);
    setQuoteStateAction();
  };

  const openApproveDialog = () => {
    setQuoteStateAction(QUOTE_TYPES.APPROVED);
    setConfirmDialog(true);
  };

  const openRejectDialog = () => {
    setQuoteStateAction(QUOTE_TYPES.DECLINED);
    setConfirmDialog(true);
  };

  const handleGoPlaceOrder = () => {
    history.push(
      oneLineTrim(
        `/${routeMatch.params.projectKey}
        /b2b-extension
        /my-company
        /orders/new
        /${ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS}`
      ),
      { quote: props.quote }
    );
  };

  const handleEditQuote = () => {
    history.push(
      oneLineTrim(
        `/${routeMatch.params.projectKey}
        /b2b-extension
        /my-company
        /quotes/new
        /${ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS}`
      ),
      { quote: props.quote }
    );
  };

  const handleRequestQuote = async () => {
    try {
      await props.updateQuoteState(QUOTE_TYPES.SUBMITTED);
      props.showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: formatMessage(messages.submittedSuccess),
      });
    } catch (e) {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: formatMessage(messages.submittedError),
      });
    }
  };

  const handleUpdateQuoteState = async () => {
    try {
      await props.updateQuoteState(quoteStateAction);
      props.showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: formatMessage(
          QUOTE_TYPES.APPROVED === quoteStateAction
            ? messages.approveSuccess
            : messages.rejectSuccess
        ),
      });
    } catch (error) {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: formatMessage(messages.updateQuoteError),
      });
    }
    closeDialog();
  };

  if (props.isLoading) return <LoadingSpinner />;

  if (!props.quote) return <PageNotFound />;

  return (
    <div data-track-component="QuoteDetail">
      <View>
        <ViewHeader
          title={formatMessage(messages.title, {
            quoteNumber: props.quote.quoteNumber,
          })}
          backToList={
            <RestrictedByPermissions permissions={[PERMISSIONS.ViewOrders]}>
              <BackToList
                to={props.goToListRoute}
                label={formatMessage(messages.backToList)}
              />
            </RestrictedByPermissions>
          }
          commands={
            <Fragment>
              <Spacings.Inline
                scale="m"
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                {QUOTE_TYPES.INITIAL === props.quote.quoteState &&
                  props.hasCompany && (
                    <RestrictedByPermissions
                      permissions={[PERMISSIONS.ManageOrders]}
                    >
                      <Fragment>
                        <SecondaryButton
                          label={formatMessage(messages.editQuote)}
                          onClick={handleEditQuote}
                        />
                        <PrimaryButton
                          label={formatMessage(messages.submitQuote)}
                          onClick={handleRequestQuote}
                        />
                      </Fragment>
                    </RestrictedByPermissions>
                  )}
                {QUOTE_TYPES.APPROVED === props.quote.quoteState &&
                  props.hasCompany && (
                    <RestrictedByPermissions
                      permissions={[PERMISSIONS.ManageOrders]}
                    >
                      <SecondaryButton
                        iconLeft={<CartIcon />}
                        label={formatMessage(messages.placeOrder)}
                        onClick={handleGoPlaceOrder}
                      />
                    </RestrictedByPermissions>
                  )}
                {QUOTE_TYPES.SUBMITTED === props.quote.quoteState && (
                  <RestrictedByPermissions
                    permissions={[
                      PERMISSIONS.ManageCompanies,
                      PERMISSIONS.ManageOrders,
                    ]}
                  >
                    <Fragment>
                      <SecondaryButton
                        iconLeft={<ReviewIcon />}
                        label={formatMessage(messages.approvalButton)}
                        onClick={openApproveDialog}
                      />
                      <PrimaryButton
                        iconLeft={<CheckInactiveIcon />}
                        tone="urgent"
                        label={formatMessage(messages.rejectButton)}
                        onClick={openRejectDialog}
                      />
                    </Fragment>
                  </RestrictedByPermissions>
                )}
              </Spacings.Inline>
            </Fragment>
          }
        >
          <TabHeader
            key={QUOTE_DETAILS_TAB_NAMES.GENERAL}
            name={QUOTE_DETAILS_TAB_NAMES.GENERAL}
            to={`${routeMatch.url}/${QUOTE_DETAILS_TAB_NAMES.GENERAL}`}
          >
            {formatMessage(messages.tabGeneral)}
          </TabHeader>
          <TabHeader
            key={QUOTE_DETAILS_TAB_NAMES.COMMENTS}
            name={QUOTE_DETAILS_TAB_NAMES.COMMENTS}
            to={`${routeMatch.url}/${QUOTE_DETAILS_TAB_NAMES.COMMENTS}`}
          >
            {formatMessage(messages.tabComments)}
          </TabHeader>
        </ViewHeader>
        <TabContainer>
          {props.children({
            hasCompany: props.hasCompany,
            employeeEmail: props.employeeEmail,
          })}
        </TabContainer>
      </View>
      <ConfirmationDialog
        title={formatMessage(messages.confirmUpdateTitle)}
        isOpen={confirmDialogOpen}
        labelPrimary={
          quoteStateAction === QUOTE_TYPES.APPROVED
            ? messages.approvalButton
            : messages.rejectButton
        }
        onClose={closeDialog}
        onCancel={closeDialog}
        onConfirm={handleUpdateQuoteState}
      >
        <Text.Body>
          <FormattedMessage {...messages.confirmDeleteMessage} />
        </Text.Body>
      </ConfirmationDialog>
    </div>
  );
};

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
};

const QuoteDetailsWrapper = props => {
  const {
    project: { key },
  } = useApplicationContext();
  const { apolloClient } = useContext(B2BApolloClientContext);
  return (
    <EmployeeDetailsConnector projectKey={key} apolloClient={apolloClient}>
      {({ employeeFetcher: { isLoading, employee } }) =>
        isLoading ? (
          <LoadingSpinner />
        ) : (
          <QuoteDetails
            {...props}
            hasCompany={Boolean(employee)}
            employeeEmail={employee?.email}
          />
        )
      }
    </EmployeeDetailsConnector>
  );
};
QuoteDetailsWrapper.displayName = 'QuoteDetailsWrapper';

QuoteDetails.displayName = 'QuoteDetails';
QuoteDetails.propTypes = {
  quoteId: PropTypes.string.isRequired,
  quote: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  projectKey: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  updateQuoteState: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  goToListRoute: PropTypes.string.isRequired,
  hasCompany: PropTypes.bool.isRequired,
  employeeEmail: PropTypes.string,
};

export default connect(null, mapDispatchToProps)(QuoteDetailsWrapper);
