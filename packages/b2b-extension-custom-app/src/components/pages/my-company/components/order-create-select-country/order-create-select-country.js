import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import sortBy from 'lodash.sortby';
import { getIn } from 'formik';
import { Switch, Route } from 'react-router';
import differenceBy from 'lodash.differenceby';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withCountries } from '@commercetools-frontend/l10n';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import * as globalActions from '@commercetools-frontend/actions-global';
import {
  Constraints,
  Label,
  Spacings,
  Text,
  SelectInput,
} from '@commercetools-frontend/ui-kit';
import { sharedMessages } from '@commercetools-frontend/i18n';
import { Notification } from '@commercetools-frontend/react-notifications';
import { FormDialog } from '@commercetools-frontend/application-components';
import localize from '@commercetools-local/utils/localize';
import messages from './messages';

export const mapCountriesToOptions = (projectCountries, countries) =>
  sortBy(
    projectCountries.map(country => ({
      label: `${countries[country.toLowerCase()]} - ${country}`,
      value: country,
    })),
    'label'
  );

export class OrderCreateSelectCountry extends React.Component {
  static displayName = 'OrderCreateSelectCountry';
  static defaultProps = {
    isChange: false,
  };
  static propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    isChange: PropTypes.bool.isRequired,
    cartDraft: PropTypes.shape({
      id: PropTypes.string.isRequired,
      lineItems: PropTypes.array.isRequired,
      version: PropTypes.number.isRequired,
      country: PropTypes.string,
    }).isRequired,
    cartUpdater: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      execute: PropTypes.func.isRequired,
    }),

    // routerProps
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      state: PropTypes.shape({
        availableCountries: PropTypes.array,
      }).isRequired,
    }).isRequired,

    // actions
    onActionError: PropTypes.func.isRequired,

    // withApplicationContext
    projectDataLocale: PropTypes.string.isRequired,
    project: PropTypes.shape({
      languages: PropTypes.arrayOf(PropTypes.string).isRequired,
      countries: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,

    // withCountries
    countries: PropTypes.objectOf(PropTypes.string).isRequired,
    // injectIntl
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  constructor(props) {
    super(props);
    let country = null;

    if (props.cartDraft.country) {
      country = props.cartDraft.country;
    }

    if (!country) {
      const availableCountries = getIn(
        props.location,
        'state.availableCountries',
        []
      );

      if (availableCountries.length === 1) {
        country = availableCountries[0];
      }
    }
    this.state = {
      country,
      previousCountry: null,
      removedLineItems: [],
      cartDraft: this.props.cartDraft,
    };
  }

  setCountry = event => {
    this.setState({ country: event.target.value });
  };

  handleRevertCountryForCart = () => {
    const actions = [
      {
        action: 'setCountry',
        country: this.state.previousCountry,
      },
    ].concat(
      this.state.removedLineItems.map(lineItem => ({
        action: 'addLineItem',
        sku: lineItem.variant.sku,
        quantity: lineItem.quantity,
      }))
    );
    this.props.cartUpdater.execute(actions).then(
      () => {
        this.props.handleCloseModal();
      },
      error => {
        this.props.onActionError(error, 'OrderCreateSelectCountry/updateCart');
      }
    );
  };

  handleSetCountryForCart = country => {
    const actions = [
      {
        action: 'setCountry',
        country,
      },
    ];
    return this.props.cartUpdater.execute(actions).then(
      updatedCart => {
        const cart = updatedCart.data.updateCart;
        const removedLineItems = differenceBy(
          this.state.cartDraft.lineItems,
          cart.lineItems,
          'id'
        );

        if (removedLineItems.length > 0) {
          this.setState({
            previousCountry: this.state.cartDraft.country,
            removedLineItems,
          });
        }

        if (removedLineItems.length > 0) {
          this.props.history.push({
            pathname: `${this.props.location.pathname}/confirm`,
            state: this.props.location.state,
          });
        } else {
          this.props.handleCloseModal();
        }
      },
      error => {
        this.props.onActionError(error, 'OrderCreateSelectCountry/updateCart');
      }
    );
  };

  render() {
    const availableCountries = getIn(
      this.props.location,
      'state.availableCountries',
      []
    );

    return (
      <Switch>
        <Route
          path={this.props.match.path}
          exact
          render={() => (
            <FormDialog
              title={
                this.props.isChange
                  ? this.props.intl.formatMessage(messages.changeTitle)
                  : this.props.intl.formatMessage(messages.title)
              }
              isOpen={true}
              onClose={this.props.handleCloseModal}
              onSecondaryButtonClick={this.props.handleCloseModal}
              onPrimaryButtonClick={() =>
                this.handleSetCountryForCart(this.state.country)
              }
              isPrimaryButtonDisabled={
                !this.state.country || this.props.cartUpdater.isLoading
              }
              labelPrimary={messages.saveButton}
            >
              <Spacings.Stack scale="m">
                <Text.Detail>
                  {this.props.isChange ? (
                    <FormattedMessage {...messages.changeSubtitle1} />
                  ) : (
                    <FormattedMessage {...messages.subTitle1} />
                  )}
                </Text.Detail>
                <Spacings.Stack>
                  <Label isRequiredIndicatorVisible={true} isBold={true}>
                    <FormattedMessage {...messages.countryLabel} />
                  </Label>
                  <Constraints.Horizontal constraint="s">
                    <SelectInput
                      options={mapCountriesToOptions(
                        availableCountries.length > 0
                          ? availableCountries
                          : this.props.project.countries,
                        this.props.countries
                      )}
                      isDisabled={availableCountries.length === 1}
                      menuPortalTarget={document.body}
                      menuPortalZIndex={1001}
                      value={this.state.country}
                      onChange={this.setCountry}
                    />
                  </Constraints.Horizontal>
                </Spacings.Stack>
                <Text.Detail>
                  <FormattedMessage {...messages.subTitle2} />
                </Text.Detail>
              </Spacings.Stack>
            </FormDialog>
          )}
        />
        <Route
          path={`${this.props.match.path}/confirm`}
          exact
          render={() => (
            <FormDialog
              title={this.props.intl.formatMessage(messages.confirmTitle)}
              isOpen={true}
              onClose={this.props.handleCloseModal}
              labelSecondary={sharedMessages.revert}
              labelPrimary={messages.confirmButton}
              onSecondaryButtonClick={this.handleRevertCountryForCart}
              onPrimaryButtonClick={this.props.handleCloseModal}
            >
              <Spacings.Stack scale="m">
                <Notification domain="side" type="warning" fixed>
                  <FormattedMessage {...messages.confirmSubtitle1} />
                </Notification>

                {this.state.removedLineItems.map(lineItem => (
                  <div key={lineItem.id}>
                    <Text.Body isBold>
                      {`${
                        typeof lineItem.name === 'string'
                          ? lineItem.name
                          : localize({
                              obj: lineItem,
                              key: 'name',
                              language: this.props.projectDataLocale,
                              fallbackOrder: this.props.project.languages,
                            })
                      } (SKU: ${lineItem.variant.sku})
                          `}
                    </Text.Body>
                  </div>
                ))}
                <Text.Detail>
                  <FormattedMessage {...messages.confirmSubtitle2} />
                </Text.Detail>
              </Spacings.Stack>
            </FormDialog>
          )}
        />
      </Switch>
    );
  }
}

const mapDispatchToProps = {
  onActionError: globalActions.handleActionError,
};

export default compose(
  withApplicationContext(applicationContext => ({
    projectDataLocale: applicationContext.dataLocale,
    user: {
      locale: applicationContext.user.locale,
    },
    project: {
      countries: applicationContext.project.countries,
      languages: applicationContext.project.languages,
    },
  })),
  injectIntl,
  connect(null, mapDispatchToProps),
  withCountries(ownProps => ownProps.user.locale)
)(OrderCreateSelectCountry);
