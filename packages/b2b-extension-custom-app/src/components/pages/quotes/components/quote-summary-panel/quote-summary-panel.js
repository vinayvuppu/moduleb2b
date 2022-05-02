import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Spacings,
  CollapsiblePanel,
  Text,
  Label,
} from '@commercetools-frontend/ui-kit';
import FormBox from '@commercetools-local/core/components/form-box';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { subtraction } from '../../../../utils/money';

import messages from './messages';
import styles from './quote-summary-panel.mod.css';

export const QuoteSummaryPanel = props => {
  const intl = useIntl();

  const { formatMessage } = intl;

  return (
    <CollapsiblePanel
      data-testid="quote-summary-panel"
      header={
        <CollapsiblePanel.Header>
          {formatMessage(messages.panelTitle)}
        </CollapsiblePanel.Header>
      }
    >
      <div className={styles.summary}>
        <FormBox>
          <Spacings.Stack scale="m">
            <Label isBold={true}>{formatMessage(messages.quoteState)}</Label>
            <Text.Body>
              {formatMessage(messages[props.quote.quoteState]).toUpperCase()}
            </Text.Body>
          </Spacings.Stack>
        </FormBox>
        <FormBox>
          <div className={styles['price-items']}>
            <Spacings.Stack scale="m">
              <Spacings.Inline
                alignItems="center"
                justifyContent="space-between"
              >
                <Text.Detail isBold>
                  <b>{formatMessage(messages.originalTotalPrice)}</b>
                </Text.Detail>
                <Text.Detail isBold data-testid="originalTotalPrice">
                  {formatMoney(
                    props.quote.originalTotalPrice || props.quote.totalPrice,
                    intl
                  )}
                </Text.Detail>
              </Spacings.Inline>
              <Spacings.Inline
                alignItems="center"
                justifyContent="space-between"
              >
                <Text.Detail isBold intlMessage={messages.totalDiscountLabel} />
                <Text.Detail isBold data-testid="quote-discount">
                  {formatMoney(
                    props.quote.originalTotalPrice || props.totalPrice
                      ? subtraction(
                          props.quote.originalTotalPrice ||
                            props.quote.totalPrice,
                          props.totalPrice || props.quote.totalPrice
                        )
                      : { currencyCode: 'USD', centAmount: 0 },
                    intl
                  )}
                </Text.Detail>
              </Spacings.Inline>
              <Spacings.Inline
                alignItems="center"
                justifyContent="space-between"
              >
                <Text.Subheadline as="h4">
                  <b>{formatMessage(messages.totalPrice)}</b>
                  {props.quote.taxedPrice && formatMessage(messages.totalGross)}
                </Text.Subheadline>
                <Text.Subheadline
                  isBold
                  as="h4"
                  data-test-id="quote-totalPrice"
                >
                  {props.totalPrice
                    ? formatMoney(props.totalPrice, intl)
                    : formatMoney(
                        props.quote.taxedPrice
                          ? props.quote.taxedPrice.totalGross
                          : props.quote.totalPrice,
                        intl
                      )}
                </Text.Subheadline>
              </Spacings.Inline>
            </Spacings.Stack>
          </div>
        </FormBox>
      </div>
    </CollapsiblePanel>
  );
};

QuoteSummaryPanel.displayName = 'QuoteSummaryPanel';
QuoteSummaryPanel.propTypes = {
  quote: PropTypes.object,
  totalPrice: PropTypes.object,
};

export default QuoteSummaryPanel;
