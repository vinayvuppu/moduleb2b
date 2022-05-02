import PropTypes from 'prop-types';
import React from 'react';
import { Spacings, Text } from '@commercetools-frontend/ui-kit';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import QuoteCreateSummary from '../quote-create-summary';

import styles from './quote-summary-section.mod.css';
import messages from './messages';

export const QuoteSummarySection = props => {
  return (
    <div className={styles.wrapper}>
      <Spacings.Inset scale="m">
        <Spacings.Stack>
          <Text.Headline as="h2">{props.title}</Text.Headline>
          {props.quote?.totalPrice?.currencyCode && (
            <Spacings.Inline alignItems="center" scale="xs">
              <Text.Body intlMessage={messages.currency}></Text.Body>
              <Text.Detail isBold>
                {props.quote?.totalPrice?.currencyCode}
              </Text.Detail>
            </Spacings.Inline>
          )}
          {props.quote && (
            <React.Fragment>
              <Spacings.Inline alignItems="center" scale="xs">
                <Text.Body
                  intlMessage={{
                    ...messages.company,
                    values: {
                      name: <b>{props.quote.company.name}</b>,
                    },
                  }}
                />
              </Spacings.Inline>
              <Text.Body
                intlMessage={{
                  ...messages.customer,
                  values: {
                    name: <b>---</b>,
                    email: props.quote.employeeEmail,
                  },
                }}
              />
            </React.Fragment>
          )}
          {props.quote?.id && (
            <QuoteCreateSummary
              onRemoveLineItem={props.onRemoveLineItem}
              onChangeLineItemQuantity={props.onChangeLineItemQuantity}
              quote={props.quote}
            />
          )}
        </Spacings.Stack>
      </Spacings.Inset>
      <PageBottomSpacer />
    </div>
  );
};
QuoteSummarySection.displayName = 'QuoteSummarySection';
QuoteSummarySection.propTypes = {
  title: PropTypes.string.isRequired,
  quote: PropTypes.object,
  onRemoveLineItem: PropTypes.func.isRequired,
  onChangeLineItemQuantity: PropTypes.func.isRequired,
};

export default QuoteSummarySection;
