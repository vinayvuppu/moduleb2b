import { PropTypes } from 'prop-types';
import React from 'react';
import { createPortal } from 'react-dom';
import { compose } from 'recompose';
import requiredIf from 'react-required-if';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { Spacings, Tooltip } from '@commercetools-frontend/ui-kit';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import formatDiscount from '@commercetools-local/utils/formats/discount';
import localize from '@commercetools-local/utils/localize';
import truncate from '@commercetools-local/utils/truncate';
import { PRECISION_TYPES } from '@commercetools-local/utils/constants';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  getSelectedPrice,
  getDiscountValue,
} from '@commercetools-local/utils/prices';
import styles from './order-item-table-product-discount.mod.css';
import { DISCOUNT_VALUE_TYPES } from '../../../../constants/misc';
import messages from './messages';

const Portal = props => createPortal(props.children, document.body);

export class OrderItemTableProductDiscount extends React.PureComponent {
  static displayName = 'OrderItemTableProductDiscount';

  static propTypes = {
    lineItem: PropTypes.shape({
      // We are expecting only LineItem, not CustomLineItem
      isModified: PropTypes.bool,
      originalPrice: PropTypes.object,
      price: PropTypes.shape({
        discounted: PropTypes.shape({
          discount: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.objectOf(PropTypes.string),
            value: PropTypes.shape({
              type: PropTypes.oneOf(Object.values(DISCOUNT_VALUE_TYPES)),
              money: requiredIf(
                PropTypes.shape({
                  currencyCode: PropTypes.string.isRequired,
                  centAmount: PropTypes.number.isRequired,
                }),
                props => props.type === DISCOUNT_VALUE_TYPES.ABSOLUTE
              ),
              permyriad: requiredIf(
                PropTypes.number,
                props => props.type === DISCOUNT_VALUE_TYPES.RELATIVE
              ),
            }),
          }),
          value: PropTypes.shape({
            currencyCode: PropTypes.string.isRequired,
            centAmount: requiredIf(
              PropTypes.number,
              props => props.type === PRECISION_TYPES.centPrecision
            ),
            preciseAmount: requiredIf(
              PropTypes.number,
              props => props.type === PRECISION_TYPES.highPrecision
            ),
          }),
        }),
        value: PropTypes.shape({
          currencyCode: PropTypes.string.isRequired,
          centAmount: requiredIf(
            PropTypes.number,
            props => props.type === PRECISION_TYPES.centPrecision
          ),
          preciseAmount: requiredIf(
            PropTypes.number,
            props => props.type === PRECISION_TYPES.highPrecision
          ),
        }).isRequired,
      }),
    }).isRequired,
    language: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  getProductDiscountDetails = discount => {
    if (!discount) return '';
    const discountName = truncate(
      localize({
        obj: discount,
        key: 'name',
        language: this.props.language,
        fallbackOrder: this.props.languages,
        fallback: discount.id,
      }),
      50
    );

    const discountValue = discount?.value
      ? `(${formatDiscount(
          discount.value,
          this.props.lineItem.price.value.currencyCode,
          this.props.intl
        )})`
      : '';
    return `${discountName}${discountValue}`;
  };

  render() {
    const selectedPrice = getSelectedPrice(this.props.lineItem.price);
    // eslint-disable-next-line no-nested-ternary
    return this.props.lineItem.price.discounted ? (
      <Spacings.Stack scale="xs" {...filterDataAttributes(this.props)}>
        <span className={styles['regular-price-block']}>
          <FormattedMessage
            {...messages.wasPrice}
            values={{
              price: formatMoney(
                this.props.lineItem.price.value,
                this.props.intl
              ),
            }}
          />
        </span>
        <span className={styles['discounted-price']}>
          {formatMoney(selectedPrice.value, this.props.intl)}
        </span>
        <Tooltip
          off={!this.props.lineItem.price.discounted?.discount?.id}
          title={this.getProductDiscountDetails(
            this.props.lineItem.price.discounted?.discount
          )}
          components={{ TooltipWrapperComponent: Portal }}
          placement="right-start"
        >
          <div className={styles['discount-text']}>
            <FormattedMessage
              {...messages.productDiscount}
              values={{
                discount: formatMoney(
                  getDiscountValue(this.props.lineItem.price, this.props.intl),
                  this.props.intl
                ),
              }}
            />
          </div>
        </Tooltip>
      </Spacings.Stack>
    ) : this.props.lineItem.originalPrice || this.props.lineItem.isModified ? (
      formatMoney(selectedPrice.value, this.props.intl)
    ) : (
      NO_VALUE_FALLBACK
    );
  }
}

export default compose(
  withApplicationContext(applicationContext => ({
    language: applicationContext.dataLocale,
    languages: applicationContext.project.languages,
  })),
  injectIntl
)(OrderItemTableProductDiscount);
