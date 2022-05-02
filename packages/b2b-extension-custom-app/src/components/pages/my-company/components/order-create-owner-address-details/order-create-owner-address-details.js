import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  CheckboxInput,
  Constraints,
  Spacings,
  TextField,
  SelectField,
} from '@commercetools-frontend/ui-kit';
import messages from './messages';

export const requiredFields = [
  'firstName',
  'country',
  'lastName',
  'streetName',
  'streetNumber',
  'city',
  'postalCode',
];

const mapCountriesToOption = countries =>
  Object.keys(countries).map(key => ({
    value: key.toUpperCase(),
    label: countries[key],
  }));

export default class OrderCreateOwnerAddressDetails extends React.PureComponent {
  static displayName = 'OrderCreateOwnerAddressDetails';

  static propTypes = {
    formik: PropTypes.shape({
      handleChange: PropTypes.func.isRequired,
      handleBlur: PropTypes.func.isRequired,
      setFieldTouched: PropTypes.func.isRequired,
      setFieldValue: PropTypes.func.isRequired,
      values: PropTypes.object.isRequired,
      errors: PropTypes.object.isRequired,
      touched: PropTypes.object.isRequired,
    }),
    isFormEditable: PropTypes.bool.isRequired,
    onSelectSameAddress: PropTypes.func,
    isSameAsBillingAddress: PropTypes.bool,
    hasActiveEdition: PropTypes.bool,
    type: PropTypes.string,
    countries: PropTypes.objectOf(PropTypes.string),
    isCompanyOwner: PropTypes.bool,
    isUniqueAddress: PropTypes.bool,
  };

  static defaultProps = {
    type: 'billing',
    isUniqueAddress: false,
  };

  renderAttributes = attributes =>
    attributes.map(attribute => {
      const hasValidation = requiredFields.includes(attribute);
      return (
        <Constraints.Horizontal key={attribute} constraint="l">
          {attribute === 'country' ? (
            <SelectField
              title={<FormattedMessage {...messages.countryLabel} />}
              name="country"
              backspaceRemovesValue={false}
              isClearable={false}
              isRequired={requiredFields.includes(attribute)}
              isDisabled={!this.props.isFormEditable}
              value={this.props.formik.values.country}
              errors={this.props.formik.errors.country}
              touched={this.props.formik.touched.country}
              onChange={this.props.formik.handleChange}
              onBlur={this.props.formik.handleBlur}
              options={mapCountriesToOption(this.props.countries)}
            />
          ) : (
            <TextField
              title={<FormattedMessage {...messages[`${attribute}Label`]} />}
              name={attribute}
              isRequired={requiredFields.includes(attribute)}
              isDisabled={!this.props.isFormEditable}
              value={this.props.formik.values[attribute]}
              errors={
                hasValidation ? this.props.formik.errors[attribute] : undefined
              }
              touched={
                hasValidation ? this.props.formik.touched[attribute] : undefined
              }
              onChange={this.props.formik.handleChange}
              onBlur={this.props.formik.handleBlur}
            />
          )}
        </Constraints.Horizontal>
      );
    });

  handleSelectSameAddress = () => {
    this.props.onSelectSameAddress(!this.props.isSameAsBillingAddress);
  };

  render() {
    return (
      <Spacings.Stack scale="s">
        <Spacings.Inset scale="xs">
          <Spacings.Stack scale="m">
            <Spacings.Inline>
              {this.renderAttributes([
                'firstName',
                'lastName',
                'phone',
                'email',
              ])}
            </Spacings.Inline>
            <Spacings.Inline>
              {this.renderAttributes([
                'company',
                'streetName',
                'streetNumber',
                'city',
              ])}
            </Spacings.Inline>
            <Spacings.Inline>
              {this.renderAttributes([
                'postalCode',
                'region',
                'country',
                'additionalStreetInfo',
              ])}
            </Spacings.Inline>
            <Spacings.Inline>
              {this.renderAttributes(['additionalAddressInfo'])}
            </Spacings.Inline>
          </Spacings.Stack>
        </Spacings.Inset>
        <Spacings.Inset scale="xs">
          {this.props.type === 'shipping' && (
            <CheckboxInput
              value={`${this.props.formik.values.id}-checkbox`}
              isChecked={this.props.isSameAsBillingAddress}
              isDisabled={
                this.props.isCompanyOwner
                  ? false
                  : (!this.props.isFormEditable &&
                      this.props.hasActiveEdition) ||
                    this.props.isSameAsBillingAddress ||
                    this.props.isUniqueAddress
              }
              onChange={this.handleSelectSameAddress}
            >
              <FormattedMessage {...messages.labelSameBillingAddress} />
            </CheckboxInput>
          )}
        </Spacings.Inset>
      </Spacings.Stack>
    );
  }
}
