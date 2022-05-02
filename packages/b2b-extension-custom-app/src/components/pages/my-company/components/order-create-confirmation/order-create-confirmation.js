import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  TruckIcon,
  PaperBillInvertedIcon,
  CollapsiblePanel,
  Spacings,
  Text,
  Card,
} from '@commercetools-frontend/ui-kit';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import OrderCreateItemsTable from '../order-create-items-table';
import OrderTotalsLastRow from '../order-totals-last-row';
import { getGrossPriceWithoutShipping } from '../../utils/order-prices';
import AddressSummary from '../address-summary';
import { selectAllLineItems } from '../../utils/cart-selectors';
import replaceLocationWhenDraftIsMissing from '../../utils/replace-location-when-draft-is-missing';
import styles from './order-create-confirmation.mod.css';
import messages from './messages';

export class OrderCreateConfirmation extends React.PureComponent {
  static displayName = 'OrderCreateConfirmation';

  static propTypes = {
    renderSaveToolbarStep: PropTypes.func.isRequired,
    // connected
    allLineItems: PropTypes.array.isRequired,
    cartDraft: PropTypes.shape({
      shippingAddress: PropTypes.object,
      billingAddress: PropTypes.object,
      shippingInfo: PropTypes.shape({
        shippingMethodName: PropTypes.string.isRequired,
        price: PropTypes.object.isRequired,
      }),
    }),
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  render() {
    const hasItems = this.props.allLineItems.length > 0;

    return (
      <Spacings.Stack scale="m">
        <Text.Headline as="h2">
          <FormattedMessage {...messages.title} />
        </Text.Headline>
        <Spacings.Stack>
          <Text.Body>
            <FormattedMessage {...messages.checkDetailsLabel} />
          </Text.Body>
          <Text.Body>
            <FormattedMessage {...messages.editLabel} />
          </Text.Body>
        </Spacings.Stack>
        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              <FormattedMessage {...messages.itemsPanelTitle} />
            </CollapsiblePanel.Header>
          }
        >
          {hasItems ? (
            <OrderCreateItemsTable omitColumns={['originalPrice']}>
              <OrderTotalsLastRow
                total={formatMoney(
                  getGrossPriceWithoutShipping(this.props.cartDraft),
                  this.props.intl
                )}
              />
            </OrderCreateItemsTable>
          ) : (
            <FormattedMessage {...messages.noItems} />
          )}
        </CollapsiblePanel>
        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              <FormattedMessage {...messages.confirmationPanelTitle} />
            </CollapsiblePanel.Header>
          }
        >
          <div className={styles.container}>
            <Spacings.Stack scale="m">
              <Card>
                <Spacings.Inline scale="xl">
                  <Spacings.Stack>
                    <Spacings.Inline alignItems="center" scale="xs">
                      <Text.Headline as="h3">
                        <FormattedMessage {...messages.shippingToLabel} />
                      </Text.Headline>
                      <TruckIcon />
                    </Spacings.Inline>
                    {/* In case of order duplicate can happen that we try to
                     * copy from an order with no shipping address defined
                     */}
                    {this.props.cartDraft.shippingAddress ? (
                      <AddressSummary
                        address={this.props.cartDraft.shippingAddress}
                      />
                    ) : (
                      <FormattedMessage {...messages.noShippingAddress} />
                    )}
                  </Spacings.Stack>
                  <Spacings.Stack>
                    <Spacings.Inline alignItems="center" scale="xs">
                      <Text.Headline as="h3">
                        <FormattedMessage {...messages.billingToLabel} />
                      </Text.Headline>
                      <PaperBillInvertedIcon />
                    </Spacings.Inline>
                    {/* In case of order duplicate can happen that we try to
                     * copy from an order with no billing address defined
                     */}
                    {this.props.cartDraft.billingAddress ? (
                      <AddressSummary
                        address={this.props.cartDraft.billingAddress}
                      />
                    ) : (
                      <FormattedMessage {...messages.noBillingAddress} />
                    )}
                  </Spacings.Stack>
                </Spacings.Inline>
              </Card>
              <Card>
                <Spacings.Stack>
                  <Text.Headline as="h3">
                    <FormattedMessage {...messages.shippingMethodTitle} />
                  </Text.Headline>
                  {/* In case of order duplicate can happen that we try to
                   * copy from an order with `shippingInfo` that no longer
                   * exists in the API, leading to a new cart without this
                   * information.
                   */}
                  {this.props.cartDraft.shippingInfo ? (
                    <Spacings.Inline scale="xs">
                      <Text.Body isBold={true}>
                        {this.props.cartDraft.shippingInfo.shippingMethodName}
                      </Text.Body>
                      <Text.Body>
                        {formatMoney(
                          this.props.cartDraft.shippingInfo.price,
                          this.props.intl
                        )}
                      </Text.Body>
                    </Spacings.Inline>
                  ) : (
                    <FormattedMessage {...messages.noShippingMethod} />
                  )}
                </Spacings.Stack>
              </Card>
            </Spacings.Stack>
          </div>
        </CollapsiblePanel>
        {this.props.renderSaveToolbarStep()}
      </Spacings.Stack>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  allLineItems: selectAllLineItems(ownProps.cartDraft),
});

export default compose(
  connect(mapStateToProps),
  injectIntl,
  replaceLocationWhenDraftIsMissing
)(OrderCreateConfirmation);
