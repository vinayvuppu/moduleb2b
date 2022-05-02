import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Card,
  CartIcon,
  Spacings,
  Text,
  IconButton,
  CloseBoldIcon,
  EditIcon,
} from '@commercetools-frontend/ui-kit';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { transformLocalizedFieldToString } from '@commercetools-local/utils/graphql';
import * as priceUtils from '@commercetools-local/utils/prices';
import Localize from '@commercetools-local/core/components/localize';

import { selectTotalGrossPrice } from '../../../my-company/utils/cart-selectors';
import * as orderPriceUtils from '../../../my-company/utils/order-prices';
import ChangeQuantityModal from '../../../my-company/components/order-create-cart-summary/change-quantity-modal';

import styles from './quote-create-summary.mod.css';
import messages from './messages';

export const getVariantAttributes = attributes =>
  attributes.filter(
    attr => attr.attributeDefinition.attributeConstraint === 'CombinationUnique'
  );

const SummaryItem = props => (
  <Spacings.Inline justifyContent="space-between">
    {props.children}
  </Spacings.Inline>
);

SummaryItem.displayName = 'SummaryItem';
SummaryItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export const QuoteCreateSummary = props => {
  const intl = useIntl();
  const [changeQuantityOptions, setChangeQuantityOptions] = useState({
    isChangeQuantityModalOpen: false,
    changeQuantityLineItem: undefined,
  });

  const handleSelectLineItemToChangeQuantity = lineItem =>
    setChangeQuantityOptions({
      isChangeQuantityModalOpen: true,
      changeQuantityLineItem: lineItem,
    });

  const handleCloseModal = () =>
    setChangeQuantityOptions({
      isChangeQuantityModalOpen: false,
      changeQuantityLineItem: undefined,
    });

  const handleChangeQuantity = async quantity => {
    await props.onChangeLineItemQuantity({
      lineItemId: changeQuantityOptions.changeQuantityLineItem.id,
      quantity: +quantity,
    });

    handleCloseModal();
  };

  const itemsNumber = props.quote?.lineItems.length;
  const lineItems = props.quote?.lineItems || [];

  const totalGross = selectTotalGrossPrice(props.quote);
  const subtotal = orderPriceUtils.getNetPriceWithoutShipping(props.quote);

  return (
    <Card>
      <Spacings.Stack>
        <Spacings.Inline alignItems="center" scale="xs">
          <CartIcon size="medium" />
          <Text.Detail
            isBold={true}
            tone="information"
            intlMessage={{
              ...messages.itemsLabel,
              values: { items: itemsNumber },
            }}
          />
          <Text.Detail isBold={true}>
            <FormattedMessage {...messages.quoteSummaryTittle} />
          </Text.Detail>
        </Spacings.Inline>
        <div className={styles.separator} />
        {itemsNumber > 0 ? (
          lineItems.map(lineItem => (
            <SummaryItem key={lineItem.id}>
              <Spacings.Inline>
                <IconButton
                  size="small"
                  data-testid={`remove-line-item-${lineItem.id}`}
                  icon={<CloseBoldIcon />}
                  label={intl.formatMessage(messages.removeLineItem)}
                  onClick={() => props.onRemoveLineItem(lineItem.id)}
                />
                <Spacings.Stack>
                  <Text.Detail isBold={true}>
                    {typeof lineItem.name === 'string' ? (
                      lineItem.name
                    ) : (
                      <Localize
                        object={{
                          name: transformLocalizedFieldToString(
                            lineItem.nameAllLocales
                          ),
                        }}
                        objectKey="name"
                      />
                    )}
                  </Text.Detail>
                  <Text.Detail tone="secondary">
                    {lineItem.variant.sku}
                  </Text.Detail>
                </Spacings.Stack>
              </Spacings.Inline>
              <Spacings.Stack alignItems="flexEnd">
                <Text.Detail tone="secondary">
                  {formatMoney(
                    lineItem.price
                      ? priceUtils.getNetUnitPrice({
                          lineItem,
                          shouldRoundAmount: true,
                        })
                      : lineItem.money,
                    intl
                  )}
                </Text.Detail>
                <Spacings.Inline>
                  <IconButton
                    size="small"
                    icon={<EditIcon />}
                    label={intl.formatMessage(messages.changeQuantity)}
                    onClick={() =>
                      handleSelectLineItemToChangeQuantity(lineItem)
                    }
                  />
                  <Text.Detail isBold={true}>
                    <FormattedMessage
                      {...messages.quantityLabel}
                      values={{ quantity: lineItem.quantity }}
                    />
                  </Text.Detail>
                </Spacings.Inline>
                <Text.Detail isBold={true}>
                  {formatMoney(lineItem.totalPrice, intl)}
                </Text.Detail>
              </Spacings.Stack>
            </SummaryItem>
          ))
        ) : (
          <Text.Detail tone="secondary">
            <FormattedMessage {...messages.emptyQuoteLabel} />
          </Text.Detail>
        )}
        <div className={styles.separator} />
        <SummaryItem>
          <Text.Detail isBold={true}>
            <FormattedMessage {...messages.subtotalLabel} />
          </Text.Detail>
          <Text.Detail isBold={true}>
            {formatMoney(
              {
                ...subtotal,
                centAmount: subtotal.centAmount,
              },
              intl
            )}
          </Text.Detail>
        </SummaryItem>

        <div className={styles.separator} />
        <SummaryItem>
          <Text.Body isBold={true}>
            <FormattedMessage {...messages.totalLabel} />
          </Text.Body>
          <Text.Body isBold={true}>{formatMoney(totalGross, intl)}</Text.Body>
        </SummaryItem>
      </Spacings.Stack>
      {changeQuantityOptions.isChangeQuantityModalOpen && (
        <ChangeQuantityModal
          quantity={changeQuantityOptions.changeQuantityLineItem?.quantity}
          productName={changeQuantityOptions.changeQuantityLineItem?.name}
          isOpen={changeQuantityOptions.isChangeQuantityModalOpen}
          handleOnClose={handleCloseModal}
          handleOnSave={handleChangeQuantity}
        />
      )}
    </Card>
  );
};

QuoteCreateSummary.displayName = 'QuoteCreateSummary';
QuoteCreateSummary.propTypes = {
  quote: PropTypes.object.isRequired,
  onRemoveLineItem: PropTypes.func.isRequired,
  onChangeLineItemQuantity: PropTypes.func.isRequired,
};

export default QuoteCreateSummary;
