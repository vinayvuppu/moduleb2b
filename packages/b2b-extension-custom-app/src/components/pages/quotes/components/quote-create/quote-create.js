import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';
import View from '@commercetools-local/core/components/view';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import SaveToolbarSteps from '@commercetools-local/core/components/save-toolbar-steps';

import OrderCreateSelectStoreAndCurrency from '../../../my-company/components/order-create-select-store-and-currency';
import QuoteSummarySection from '../quote-summary-section';
import QuoteCreateAddLineItems from '../quote-create-add-line-items';

import styles from './quote-create.mod.css';
import messages from './messages';

const none = () => {};

export const QuoteCreate = props => {
  const intl = useIntl();
  const history = useHistory();

  const { currencies } = useApplicationContext(({ project }) => ({
    currencies: project.currencies,
  }));

  const [currencySelected, setCurrencySelected] = useState(
    currencies.length === 1 ? currencies[0] : undefined
  );

  const handleRemoveLineItem = async lineItemId => {
    try {
      await props.removeLineItem({ lineItemId });
      props.showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.removeVariantSuccess),
      });
    } catch (error) {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.removeVariantFailure),
      });
    }
  };

  const handleChangeLineItem = async ({ lineItemId, quantity }) => {
    try {
      await props.changeLineItemQuantity({ lineItemId, quantity });
      props.showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.changeQuantitySuccess),
      });
    } catch (error) {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.changeQuantityFailure),
      });
    }
  };

  const handleRequestQuote = async () => {
    try {
      props.showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.quoteRequestedSuccess),
      });
      history.push(oneLineTrim`
        /${props.projectKey}
        /b2b-extension
        /my-company
        /quotes
        /${props.quote.id}
    `);
    } catch (error) {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.quoteRequestedError),
      });
    }
  };

  const handleCancel = async () => {
    history.push(oneLineTrim`
        /${props.projectKey}
        /b2b-extension
        /my-company
        /quotes
    `);
  };

  useEffect(() => {
    async function createQuote({
      currency,
      employeeId,
      employeeEmail,
      companyId,
    }) {
      await props.createQuote({
        currency,
        employeeId,
        companyId,
        employeeEmail,
      });
    }

    if (
      currencySelected &&
      props.company &&
      props.employee &&
      !props.quote?.id
    ) {
      createQuote({
        currency: currencySelected,
        employeeId: props.employee.id,
        employeeEmail: props.employee.email,
        companyId: props.company.id,
      });
    }

    // eslint-disable-next-line
  }, [props.company.id, props.employee.id, currencySelected]);

  if (!props.company || !props.employee) {
    return <LoadingSpinner />;
  }

  if (!currencySelected) {
    return (
      <OrderCreateSelectStoreAndCurrency
        projectKey={props.projectKey}
        goToOrdersList={none}
        updateCartDraft={({ currency }) => setCurrencySelected(currency)}
        updateStore={none}
        hideInitialSelectionModal={none}
      />
    );
  }

  return (
    <div data-track-component="Add Quote">
      <View>
        <div className={styles.container}>
          {props.quote && (
            <div className={styles.slider} data-testid="customers-list">
              <QuoteCreateAddLineItems
                quote={props.quote}
                company={props.company}
                projectKey={props.projectKey}
                addLineItem={props.addLineItem}
                renderSaveToolbarStep={() => (
                  <SaveToolbarSteps
                    currentStep={1}
                    totalSteps={1}
                    isVisible={props.quote?.lineItems.length > 0}
                    onSave={handleRequestQuote}
                    onCancel={handleCancel}
                  />
                )}
              />
            </div>
          )}
          <QuoteSummarySection
            quote={props.quote}
            onRemoveLineItem={handleRemoveLineItem}
            onChangeLineItemQuantity={handleChangeLineItem}
            title={intl.formatMessage(messages.quoteSummaryTitle)}
          />
        </div>
      </View>
    </div>
  );
};

QuoteCreate.displayName = 'QuoteCreate';
QuoteCreate.propTypes = {
  createQuote: PropTypes.func.isRequired,
  addLineItem: PropTypes.func.isRequired,
  removeLineItem: PropTypes.func.isRequired,
  changeLineItemQuantity: PropTypes.func.isRequired,
  quote: PropTypes.object,
  employee: PropTypes.object.isRequired,
  company: PropTypes.object.isRequired,
  projectKey: PropTypes.string.isRequired,
  showNotification: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
};

export default connect(null, mapDispatchToProps)(QuoteCreate);
