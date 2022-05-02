/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { FormattedMessage, useIntl } from 'react-intl';
import { getSymbolFromCurrency } from '@commercetools-frontend/l10n';

import * as globalActions from '@commercetools-frontend/actions-global';

import {
  CollapsiblePanel,
  Table,
  Spacings,
  IconButton,
  EditIcon,
  MoneyInput,
  PrimaryButton,
  LoadingSpinner,
  Card,
  Constraints,
  RadioInput,
  NumberInput,
  Text,
} from '@commercetools-frontend/ui-kit';
import { FormDialog } from '@commercetools-frontend/application-components';
import { transformLocalizedFieldToString } from '@commercetools-local/utils/graphql';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { DOMAINS } from '@commercetools-frontend/constants';

import {
  useApplicationContext,
  ProjectExtensionProviderForImageRegex,
} from '@commercetools-frontend/application-shell-connectors';

import OrderItemTableProductCell from '../../../my-company/components/order-item-table-product-cell';
import OrderItemTableUnitPriceCell from '../../../my-company/components/order-item-table-unit-price-cell';
import OrderItemTableUnitGrossPriceCell from '../../../my-company/components/order-item-table-unit-gross-price-cell';
import OrderItemTableUnitNetPriceCell from '../../../my-company/components/order-item-table-unit-net-price-cell';
import OrderItemTableTaxRateCell from '../../../my-company/components/order-item-table-tax-rate-cell';
import OrderItemTableSubtotalPriceCell from '../../../my-company/components/order-item-table-subtotal-price-cell';
import OrderItemTableTotalPriceCell from '../../../my-company/components/order-item-table-total-price-cell';

import messages from './messages';
import createColumnDefinitions from './column-definitions';
import styles from './quote-items-panel.mod.css';
import { QUOTE_TYPES } from '../../constants';
import roundHalfEven from '../../utils/round-half-even';

const PRICE_DISCOUNT_TYPE = {
  PROPOSAL: 'proposal',
  PERCENTAGE: 'percentage',
  AMOUNT: 'amount',
};

export const QuoteItemsPanel = props => {
  const intl = useIntl();

  const [lineItems, setLineItems] = useState(props.quote?.lineItems);
  const [isLoading, setIsLoading] = useState(false);

  const [price, setPrice] = useState();

  const [priceDiscountType, setPriceDiscountType] = useState(
    PRICE_DISCOUNT_TYPE.PROPOSAL
  );

  const defaultAmountValue = {
    currencyCode: 'USD',
    amount: '0',
  };

  const [percentageValue, setPercentageValue] = useState('');
  const [amountValue, setAmountValue] = useState(defaultAmountValue);

  useEffect(() => {
    if (props.quote?.percentageDiscount) {
      setPriceDiscountType(PRICE_DISCOUNT_TYPE.PERCENTAGE);
      setPercentageValue((props.quote?.percentageDiscount * 100).toFixed(0));
      setAmountValue({
        currencyCode: 'USD',
        amount: '0',
      });
    } else if (props.quote?.amountDiscount) {
      setPriceDiscountType(PRICE_DISCOUNT_TYPE.AMOUNT);
      setAmountValue(
        MoneyInput.parseMoneyValue(props.quote?.amountDiscount, intl.locale)
      );
      setPercentageValue('');
    } else {
      setPriceDiscountType(PRICE_DISCOUNT_TYPE.PROPOSAL);
      setPercentageValue('');
      setAmountValue({
        currencyCode: 'USD',
        amount: '0',
      });
    }
    setLineItems(props.quote?.lineItems);
  }, [intl.locale, props.quote]);

  const { currencies } = useApplicationContext(({ project }) => ({
    currencies: project.currencies,
  }));

  const currencySymbol = getSymbolFromCurrency(
    props.quote.totalPrice.currencyCode,
    currencies
  );

  const isTaxIncludedInPrice = props.quote.lineItems.some(
    lineItem => lineItem.taxRate && lineItem.taxRate.includedInPrice
  );

  const calculateNewTotal = ({
    newPriceDiscountType,
    newAmountValue,
    newPercentageValue,
    newLineItems,
    updatedLineItemsTable,
  }) => {
    let newTotal;

    const oldTotalPrice =
      props.quote.originalTotalPrice || props.quote.totalPrice;

    if (newPriceDiscountType === PRICE_DISCOUNT_TYPE.AMOUNT) {
      const amountDiscount = MoneyInput.convertToMoneyValue(
        newAmountValue,
        intl.locale
      );

      newTotal = {
        ...oldTotalPrice,
        centAmount:
          oldTotalPrice.centAmount - (amountDiscount?.centAmount || 0),
      };
    } else if (newPriceDiscountType === PRICE_DISCOUNT_TYPE.PERCENTAGE) {
      newTotal = {
        ...oldTotalPrice,
        centAmount: newLineItems.reduce((acc, li) => {
          const liPrice = li?.originalPrice || li.price.value;

          const newCentAmount =
            newPercentageValue > 0
              ? roundHalfEven(
                  liPrice.centAmount - liPrice.centAmount * newPercentageValue
                )
              : liPrice.centAmount;

          return acc + newCentAmount * li.quantity;
        }, 0),
      };
    } else if (newPriceDiscountType === PRICE_DISCOUNT_TYPE.PROPOSAL) {
      if (updatedLineItemsTable) {
        newTotal = {
          ...oldTotalPrice,
          centAmount: newLineItems.reduce(
            (acc, li) => acc + li.totalPrice.centAmount,
            0
          ),
        };
      } else {
        newTotal = {
          ...oldTotalPrice,
          centAmount: newLineItems.reduce(
            (acc, li) =>
              acc +
              (li?.originalPrice || li.price.value).centAmount * li.quantity,
            0
          ),
        };
      }
    }

    props.onUpdateOriginalTotalPrice(newTotal);
  };

  const changePriceDiscountTypeHandler = event => {
    const newPriceDiscountType = event.target.value;

    setPriceDiscountType(newPriceDiscountType);

    calculateNewTotal({
      newPriceDiscountType,
      newAmountValue: amountValue,
      newPercentageValue: percentageValue / 100,
      newLineItems: lineItems,
    });

    if (
      newPriceDiscountType === PRICE_DISCOUNT_TYPE.PROPOSAL ||
      newPriceDiscountType === PRICE_DISCOUNT_TYPE.AMOUNT
    ) {
      const newLi = lineItems.map(li => ({
        ...li,
        tempOriginalPrice: undefined,
        price: {
          value: li.originalPrice || li.price.value,
        },
        totalPrice: {
          ...li.totalPrice,
          centAmount:
            (li.originalPrice || li.price.value).centAmount * li.quantity,
        },
        isEditing: false,
        isModified: false,
      }));

      setLineItems(newLi);
    } else {
      setLineItems(props.quote.lineItems);
    }
  };

  const amountDiscountHandler = moneyEvent => {
    const newAmountValue = {
      amount: moneyEvent.target.name.endsWith('.amount')
        ? moneyEvent.target.value
        : amountValue.amount,
      currencyCode: moneyEvent.target.name.endsWith('.currencyCode')
        ? moneyEvent.target.value
        : amountValue.currencyCode,
    };

    setAmountValue(newAmountValue);

    calculateNewTotal({
      newPriceDiscountType: PRICE_DISCOUNT_TYPE.AMOUNT,
      newAmountValue,
    });
  };

  const percentageDiscountHandler = event => {
    const newPercentageValue = Math.round(event.target.value);
    setPercentageValue(newPercentageValue);

    calculateNewTotal({
      newPriceDiscountType: PRICE_DISCOUNT_TYPE.PERCENTAGE,
      newPercentageValue: newPercentageValue / 100,
      newLineItems: lineItems,
    });
  };

  const createPriceChangeHandler = lineItem => moneyEvent => {
    setPrice({
      amount: moneyEvent.target.name.endsWith('.amount')
        ? moneyEvent.target.value || '0'
        : price.amount,
      currencyCode: moneyEvent.target.name.endsWith('.currencyCode')
        ? moneyEvent.target.value
        : lineItem.price.value.currencyCode,
    });
  };

  // const lineItemsTotalPrice = useMemo(
  //   () => ({
  //     ...props.quote.totalPrice,
  //     centAmount: lineItems.reduce(
  //       (acc, li) => acc + li.totalPrice.centAmount,
  //       0
  //     ),
  //   }),
  //   [lineItems, props.quote.totalPrice]
  // );

  const createOnApplyChangeHandler = id => () => {
    const newPrice = MoneyInput.convertToMoneyValue(price, intl.locale);

    const newLineItems = lineItems.map(li =>
      li.id === id
        ? {
            ...li,
            tempOriginalPrice: {
              ...(li.tempOriginalPrice || li.price.value),
            },
            price: {
              value: newPrice,
            },
            totalPrice: {
              ...newPrice,
              centAmount: newPrice.centAmount * li.quantity,
            },
            isEditing: false,
            isModified: true,
          }
        : { ...li, isEditing: false }
    );

    setLineItems(newLineItems);
    setPrice();
    calculateNewTotal({
      newPriceDiscountType: PRICE_DISCOUNT_TYPE.PROPOSAL,
      newLineItems,
      updatedLineItemsTable: true,
    });
  };

  const createEditHandler = (lineItem, id) => event => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    setPrice(MoneyInput.parseMoneyValue(lineItem.price.value, intl.locale));

    setLineItems(
      lineItems.map(li =>
        li.id === id ? { ...li, isEditing: true } : { ...li, isEditing: false }
      )
    );
  };

  const onCancelEditHandler = () => {
    setPrice();
    setLineItems(lineItems.map(li => ({ ...li, isEditing: false })));
  };

  const renderItem = ({ rowIndex, columnKey }) => {
    const lineItem = lineItems[rowIndex];
    const id = lineItems[rowIndex].id;

    switch (columnKey) {
      case 'name': {
        return (
          <OrderItemTableProductCell
            data-testid="line-item-name"
            useExternalIconAsFallback={false}
            lineItem={{
              ...lineItem,
              name: transformLocalizedFieldToString(lineItem.nameAllLocales),
            }}
            isCustomLineItem={false}
          />
        );
      }
      case 'originalPrice':
        if (lineItem.isModified && !lineItem.originalPrice) {
          return (
            <div
              className={classnames({
                [styles['item-modified']]: lineItem.isModified,
              })}
            >
              {formatMoney(lineItem.tempOriginalPrice, intl)}
            </div>
          );
        }
        return lineItem.originalPrice ? (
          <div
            className={classnames({
              [styles['item-modified']]: lineItem.isModified,
            })}
          >
            {formatMoney(lineItem.originalPrice, intl)}
          </div>
        ) : (
          <div
            className={classnames({
              [styles['item-modified']]: lineItem.isModified,
            })}
          >
            {formatMoney(lineItem.price.value, intl)}
          </div>
        );

      case 'price':
        return (
          <Fragment>
            <div
              className={classnames({
                [styles['item-modified']]: lineItem.isModified,
              })}
            >
              <OrderItemTableUnitPriceCell
                lineItem={lineItem}
                isCustomLineItem={false}
              />
            </div>
            {lineItem.isEditing && (
              <FormDialog
                title={intl.formatMessage(messages.changeUnitPriceLabel)}
                isOpen={lineItem.isEditing}
                onPrimaryButtonClick={createOnApplyChangeHandler(id)}
                isPrimaryButtonDisabled={
                  price.amount ===
                  MoneyInput.parseMoneyValue(lineItem.price.value, intl.locale)
                    .amount
                }
                onSecondaryButtonClick={onCancelEditHandler}
              >
                <Spacings.Inline>
                  <MoneyInput
                    value={price}
                    name="price"
                    horizontalConstraint="m"
                    onChange={createPriceChangeHandler(lineItem)}
                    currencies={currencies}
                  />
                </Spacings.Inline>
              </FormDialog>
            )}
          </Fragment>
        );

      case 'grossPrice':
        return (
          <div
            className={classnames({
              [styles['item-modified']]: lineItem.isModified,
            })}
          >
            <OrderItemTableUnitGrossPriceCell
              lineItem={lineItem}
              isCustomLineItem={false}
            />
          </div>
        );
      case 'netPrice':
        return (
          <div
            className={classnames({
              [styles['item-modified']]: lineItem.isModified,
            })}
          >
            <OrderItemTableUnitNetPriceCell
              lineItem={lineItem}
              isCustomLineItem={false}
            />
          </div>
        );
      case 'quantity':
        return (
          <div
            className={classnames({
              [styles['item-modified']]: lineItem.isModified,
            })}
          >
            {lineItem.quantity}
          </div>
        );
      case 'taxRate':
        return (
          <div
            className={classnames({
              [styles['item-modified']]: lineItem.isModified,
            })}
          >
            <OrderItemTableTaxRateCell taxRate={lineItem.taxRate} />
          </div>
        );
      case 'subtotalPrice':
        return (
          <div
            className={classnames({
              [styles['item-modified']]: lineItem.isModified,
            })}
          >
            <OrderItemTableSubtotalPriceCell
              lineItem={{ ...lineItem, discountedPricePerQuantity: [] }}
              isCustomLineItem={false}
            />
          </div>
        );
      case 'totalPrice':
        return (
          <div
            className={classnames({
              [styles['item-modified']]: lineItem.isModified,
            })}
          >
            <OrderItemTableTotalPriceCell
              lineItem={lineItem}
              isCustomLineItem={false}
            />
          </div>
        );

      case 'actions':
        return (
          <Spacings.Inline scale="m">
            {QUOTE_TYPES.SUBMITTED === props.quote.quoteState &&
              priceDiscountType === PRICE_DISCOUNT_TYPE.PROPOSAL && (
                <IconButton
                  icon={<EditIcon />}
                  label={intl.formatMessage(messages.approvalButton)}
                  onClick={createEditHandler(lineItem, id)}
                />
              )}
          </Spacings.Inline>
        );

      default:
        return null;
    }
  };

  const handleUpdateQuoteItems = async () => {
    await props.updateQuoteItems(
      lineItems.filter(lineItem => lineItem.isModified)
    );
  };

  const handleUpdateQuoteAddAmountDiscount = async () => {
    await props.addAmountDiscount(
      MoneyInput.convertToMoneyValue(amountValue),
      intl.locale
    );
  };

  const handleUpdateQuoteAddPercentageDiscount = async () => {
    await props.addPercentageDiscount(percentageValue / 100);
  };

  const handleOnClickSaveButton = async () => {
    setIsLoading(true);
    try {
      if (priceDiscountType === PRICE_DISCOUNT_TYPE.PROPOSAL) {
        await handleUpdateQuoteItems();
      }
      if (priceDiscountType === PRICE_DISCOUNT_TYPE.AMOUNT) {
        await handleUpdateQuoteAddAmountDiscount();
      }
      if (priceDiscountType === PRICE_DISCOUNT_TYPE.PERCENTAGE) {
        await handleUpdateQuoteAddPercentageDiscount();
      }

      props.showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.updateSuccess),
      });
      setIsLoading(false);
    } catch (error) {
      props.showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.updateError),
      });
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    if (priceDiscountType === PRICE_DISCOUNT_TYPE.PERCENTAGE) {
      return (
        percentageValue !== '' &&
        percentageValue !== (props.quote?.percentageDiscount * 100).toFixed(0)
      );
    }
    if (priceDiscountType === PRICE_DISCOUNT_TYPE.AMOUNT) {
      return (
        amountValue.amount !==
        MoneyInput.parseMoneyValue(props.quote?.amountDiscount, intl.locale)
          .amount
      );
    }
    if (priceDiscountType === PRICE_DISCOUNT_TYPE.PROPOSAL) {
      return !!lineItems.find(li => li.isModified);
    }
    return false;
  };

  return (
    <CollapsiblePanel
      data-testid="quote-employee-panel"
      header={
        <CollapsiblePanel.Header>
          <FormattedMessage {...messages.panelTitle} />
        </CollapsiblePanel.Header>
      }
      headerControls={
        props.isAuthorized &&
        QUOTE_TYPES.SUBMITTED === props.quote.quoteState &&
        hasChanges() && (
          <PrimaryButton
            label={intl.formatMessage(messages.save)}
            onClick={handleOnClickSaveButton}
            isDisabled={isLoading}
          />
        )
      }
    >
      <ProjectExtensionProviderForImageRegex>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Constraints.Horizontal constraint="scale">
            <Spacings.Stack>
              {props.isAuthorized && (
                <Constraints.Horizontal constraint="xl">
                  <Card>
                    <Text.Headline as="h3" className={styles.changePricesLabel}>
                      {intl.formatMessage(messages.changePrices)}
                    </Text.Headline>
                    <div className={styles.changePricesRadioButton}>
                      <RadioInput.Group
                        onChange={changePriceDiscountTypeHandler}
                        name="priceDiscountType"
                        value={priceDiscountType}
                        isDisabled={
                          QUOTE_TYPES.SUBMITTED !== props.quote.quoteState
                        }
                      >
                        <RadioInput.Option value={PRICE_DISCOUNT_TYPE.AMOUNT}>
                          <Spacings.Inline
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <div>
                              {intl.formatMessage(messages.amountDiscount)}
                            </div>
                            <MoneyInput
                              value={
                                priceDiscountType === PRICE_DISCOUNT_TYPE.AMOUNT
                                  ? amountValue
                                  : defaultAmountValue
                              }
                              name={PRICE_DISCOUNT_TYPE.AMOUNT}
                              horizontalConstraint="m"
                              onChange={amountDiscountHandler}
                              currencies={currencies}
                              isDisabled={
                                priceDiscountType !==
                                  PRICE_DISCOUNT_TYPE.AMOUNT ||
                                QUOTE_TYPES.SUBMITTED !== props.quote.quoteState
                              }
                            />
                          </Spacings.Inline>
                        </RadioInput.Option>
                        <RadioInput.Option
                          value={PRICE_DISCOUNT_TYPE.PERCENTAGE}
                        >
                          <Spacings.Inline
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <div>
                              {intl.formatMessage(messages.percentageDiscount)}
                            </div>
                            <NumberInput
                              value={
                                priceDiscountType ===
                                PRICE_DISCOUNT_TYPE.PERCENTAGE
                                  ? percentageValue
                                  : ''
                              }
                              placeholder={intl.formatMessage(
                                messages.percentagePlaceholder
                              )}
                              name={PRICE_DISCOUNT_TYPE.PERCENTAGE}
                              min={1}
                              max={100}
                              step={1}
                              horizontalConstraint="m"
                              onChange={percentageDiscountHandler}
                              isDisabled={
                                priceDiscountType !==
                                  PRICE_DISCOUNT_TYPE.PERCENTAGE ||
                                QUOTE_TYPES.SUBMITTED !== props.quote.quoteState
                              }
                            />
                          </Spacings.Inline>
                        </RadioInput.Option>
                        <RadioInput.Option value={PRICE_DISCOUNT_TYPE.PROPOSAL}>
                          <Spacings.Inline alignItems="center">
                            <div>
                              {intl.formatMessage(messages.proposalPrice)}
                            </div>
                          </Spacings.Inline>
                        </RadioInput.Option>
                      </RadioInput.Group>
                    </div>
                  </Card>
                </Constraints.Horizontal>
              )}
              <Table
                items={lineItems}
                columns={createColumnDefinitions(
                  intl,
                  currencySymbol,
                  isTaxIncludedInPrice,
                  props.quote.quoteState,
                  props.isAuthorized
                )}
                rowCount={lineItems.length}
                itemRenderer={renderItem}
                shouldFillRemainingVerticalSpace={false}
              />
            </Spacings.Stack>
          </Constraints.Horizontal>
        )}
      </ProjectExtensionProviderForImageRegex>
    </CollapsiblePanel>
  );
};

QuoteItemsPanel.displayName = 'QuoteItemsPanel';
QuoteItemsPanel.propTypes = {
  quote: PropTypes.object,
  updateQuoteItems: PropTypes.func.isRequired,
  addAmountDiscount: PropTypes.func.isRequired,
  addPercentageDiscount: PropTypes.func.isRequired,
  onUpdateOriginalTotalPrice: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
};

export default connect(null, mapDispatchToProps)(QuoteItemsPanel);
