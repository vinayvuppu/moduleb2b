import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { defaultMemoize } from 'reselect';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import oneLine from 'common-tags/lib/oneLine';
import localize from '@commercetools-local/utils/localize';
import { transformLocalizedFieldToString } from '@commercetools-local/utils/graphql';
import { SelectInput, Spacings, Text } from '@commercetools-frontend/ui-kit';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import SingleFilter from '../single-filter';
import {
  DateSingleFilter,
  DateRangeFilter,
  DateTimeSingleFilter,
  DateTimeRangeFilter,
  TimeSingleFilter,
  TimeRangeFilter,
} from '../date-filters';
import { createEnumSingleFilter } from '../enum-filters';
import {
  createNumberSingleFilter,
  createNumberRangeFilter,
} from '../number-filters';
import {
  createMoneySingleFilter,
  createMoneyRangeFilter,
} from '../money-filters';
import { TextSingleFilter } from '../text-filter';
import { LocalizedTextSingleFilter } from '../localized-text-filter';
import { FILTER_TYPES, FIELD_TYPES } from '../../../../constants';
import styles from './custom-field-filter.mod.css';
import messages from './messages';

export const mapCustomFieldDefinitionsToOptions = (
  customFieldDefinitions,
  locale,
  languages
) =>
  Object.keys(customFieldDefinitions).reduce(
    (acc, key) => [
      ...acc,
      {
        value: key,
        label: localize({
          obj: customFieldDefinitions[key],
          key: 'label',
          language: locale,
          fallbackOrder: languages,
          fallback: customFieldDefinitions[key].name,
        }),
      },
    ],
    []
  );

const mapBooleanValues = defaultMemoize(intl => [
  { value: 'true', label: intl.formatMessage(messages.trueOptionLabel) },
  { value: 'false', label: intl.formatMessage(messages.falseOptionLabel) },
]);

const getBooleanValueLabel = defaultMemoize((value, intl) =>
  value === 'true'
    ? intl.formatMessage(messages.trueOptionLabel)
    : intl.formatMessage(messages.falseOptionLabel)
);

const mapDateOptions = defaultMemoize(intl => [
  {
    value: FILTER_TYPES.lessThan,
    label: intl.formatMessage(messages.lessThan),
  },
  {
    value: FILTER_TYPES.moreThan,
    label: intl.formatMessage(messages.moreThan),
  },
  {
    value: FILTER_TYPES.equalTo,
    label: intl.formatMessage(messages.dateEqualTo),
  },
  {
    value: FILTER_TYPES.range,
    label: intl.formatMessage(messages.range),
  },
]);

const mapNumericOptions = defaultMemoize(intl => [
  {
    value: FILTER_TYPES.lessThan,
    label: intl.formatMessage(messages.lowerThan),
  },
  {
    value: FILTER_TYPES.moreThan,
    label: intl.formatMessage(messages.greaterThan),
  },
  {
    value: FILTER_TYPES.equalTo,
    label: intl.formatMessage(messages.equalTo),
  },
  {
    value: FILTER_TYPES.range,
    label: intl.formatMessage(messages.range),
  },
]);

export const mapEnumValuesToOptions = enumValues =>
  enumValues.reduce(
    (acc, value) => [
      ...acc,
      {
        value: value.key,
        label: value.label,
      },
    ],
    []
  );

export const getEnumValueLabel = (value, enumValues) =>
  enumValues.find(enumValue => enumValue.value === value).label;

export const mapLocalizedEnumValuesToOptions = (
  localizedEnumValues,
  languages,
  locale
) =>
  localizedEnumValues.reduce(
    (acc, value) => [
      ...acc,
      {
        value: value.key,
        label: oneLine`${localize({
          obj: { name: transformLocalizedFieldToString(value.labelAllLocales) },
          key: 'name',
          language: locale,
          fallbackOrder: languages,
          fallback: `${NO_VALUE_FALLBACK} (${value.key})`,
        })} (${locale.toUpperCase()})`,
      },
    ],
    []
  );

export class CustomFieldFilter extends React.PureComponent {
  static displayName = 'CustomFieldFilter';
  static propTypes = {
    customFieldDefinitions: PropTypes.array.isRequired,
    onUpdateFilter: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.shape({
        currencyCode: PropTypes.string,
        amount: PropTypes.string,
      }),
    ]),
    hideTypes: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.any,

    // withApplicationContext
    currencies: PropTypes.array.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,

    // Intl
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      .isRequired,
  };

  static defaultProps = {
    hideTypes: [],
    disabled: false,
  };

  render() {
    const customFieldDefinitions = this.props.customFieldDefinitions.reduce(
      (definitions, customField) => {
        if (
          customField.type &&
          !this.props.hideTypes.includes(customField.type.name)
        ) {
          return {
            ...definitions,
            [`${customField.name}`]: customField,
          };
        }

        return definitions;
      },
      {}
    );
    return (
      <SingleFilter
        renderInput={({ value, onUpdateValue }) =>
          renderInput({
            value,
            onUpdateValue,
            disabled: this.props.disabled,
            hasError: this.props.error,
            customFieldDefinitions,
            intl: this.props.intl,
            currencies: this.props.currencies,
            languages: this.props.languages,
          })
        }
        value={this.props.value}
        error={this.props.error?.type}
        onUpdateValue={this.props.onUpdateFilter}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
      />
    );
  }
}

export const renderTypeFilter = ({
  filterValue,
  onUpdateValue,
  intl,
  hasError,
  currencies,
  languages,
}) => {
  const { target, type, value, option } = filterValue;
  let element;
  let optionLabels;
  const inputError = hasError?.input;
  const optionError = hasError?.option;

  switch (type.name) {
    case FIELD_TYPES.Boolean:
      element = createEnumSingleFilter({ options: mapBooleanValues(intl) });
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['filter-label']}>
            <FormattedMessage {...messages.equalTo} />
          </div>
          <div className={styles['filter-input-s']}>
            {element({
              value,
              onUpdateFilter: nextValue =>
                onUpdateValue({
                  target,
                  type,
                  value: {
                    value: nextValue.value,
                    label: getBooleanValueLabel(`${nextValue.value}`, intl),
                  },
                }),
              error: inputError,
            })}
          </div>
        </Spacings.Inline>
      );
    case FIELD_TYPES.String:
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['filter-label']}>
            <FormattedMessage {...messages.equalTo} />
          </div>
          <div className={styles['filter-input-s']}>
            <TextSingleFilter
              value={value || ''}
              onUpdateFilter={nextValue =>
                onUpdateValue({ target, type, value: nextValue.target.value })
              }
              error={inputError}
            />
          </div>
        </Spacings.Inline>
      );
    case FIELD_TYPES.LocalizedString:
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['filter-label']}>
            <FormattedMessage {...messages.equalTo} />
          </div>
          <div className={styles['filter-input-s']}>
            <LocalizedTextSingleFilter
              value={value || {}}
              selectedLanguage={intl.locale}
              onUpdateFilter={nextValue =>
                onUpdateValue({
                  target,
                  type,
                  value: {
                    ...value,
                    [`${nextValue.target.language}`]: nextValue.target.value,
                  },
                })
              }
              error={inputError}
            />
          </div>
        </Spacings.Inline>
      );
    case FIELD_TYPES.Enum:
    case FIELD_TYPES.LocalizedEnum:
      optionLabels =
        type.name === 'Enum'
          ? mapEnumValuesToOptions(type.values)
          : mapLocalizedEnumValuesToOptions(
              type.values,
              languages,
              intl.locale
            );
      element = createEnumSingleFilter({
        options: optionLabels,
      });
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['filter-label']}>
            <FormattedMessage {...messages.equalTo} />
          </div>
          <div className={styles['filter-input-s']}>
            {element({
              value,
              onUpdateFilter: nextValue =>
                onUpdateValue({
                  target,
                  type,
                  value: {
                    value: nextValue.value,
                    label: getEnumValueLabel(nextValue.value, optionLabels),
                  },
                }),

              error: inputError,
            })}
          </div>
        </Spacings.Inline>
      );
    case FIELD_TYPES.Number:
      element =
        option === FILTER_TYPES.range
          ? createNumberRangeFilter({ numberFormat: intl.locale })
          : createNumberSingleFilter({ numberFormat: intl.locale });
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['filter-option']}>
            <SelectInput
              className={styles.select}
              value={option}
              options={mapNumericOptions(intl)}
              onChange={nextValue =>
                onUpdateValue({
                  target,
                  type,
                  value,
                  option: nextValue.target.value,
                })
              }
              clearable={false}
              hasError={optionError}
            />
          </div>
          <div className={styles['filter-input-s']}>
            {element({
              value,
              onUpdateFilter: nextValue =>
                onUpdateValue({
                  target,
                  type,
                  value: nextValue.target.value,
                  option,
                }),
              error: inputError,
            })}
          </div>
        </Spacings.Inline>
      );
    case FIELD_TYPES.Date:
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['filter-option']}>
            <SelectInput
              className={styles.select}
              value={option}
              options={mapDateOptions(intl)}
              onChange={nextValue =>
                onUpdateValue({
                  target,
                  type,
                  value,
                  option: nextValue.target.value,
                })
              }
              clearable={false}
              hasError={optionError}
            />
          </div>
          {option === FILTER_TYPES.range ? (
            <div className={styles['filter-input-m']}>
              <DateRangeFilter
                value={value || { from: '', to: '' }}
                onUpdateFilter={nextValue =>
                  onUpdateValue({ target, type, value: nextValue, option })
                }
                error={inputError}
              />
            </div>
          ) : (
            <div className={styles['filter-input-s']}>
              <DateSingleFilter
                value={value || ''}
                onUpdateFilter={nextValue =>
                  onUpdateValue({ target, type, value: nextValue, option })
                }
                error={inputError}
              />
            </div>
          )}
        </Spacings.Inline>
      );
    case FIELD_TYPES.DateTime:
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['filter-option']}>
            <SelectInput
              className={styles.select}
              value={option}
              options={mapDateOptions(intl)}
              onChange={nextValue =>
                onUpdateValue({
                  target,
                  type,
                  value,
                  option: nextValue.target.value,
                })
              }
              clearable={false}
              hasError={optionError}
            />
          </div>
          {option === FILTER_TYPES.range ? (
            <div className={styles['filter-input-l']}>
              <DateTimeRangeFilter
                value={value || { from: '', to: '' }}
                onUpdateFilter={nextValue =>
                  onUpdateValue({
                    target,
                    type,
                    value: nextValue.target,
                    option,
                  })
                }
                error={inputError}
              />
            </div>
          ) : (
            <div className={styles['filter-input-s']}>
              <DateTimeSingleFilter
                value={value || ''}
                onUpdateFilter={nextValue =>
                  onUpdateValue({
                    target,
                    type,
                    value: nextValue.target,
                    option,
                  })
                }
                error={inputError}
              />
            </div>
          )}
        </Spacings.Inline>
      );
    case FIELD_TYPES.Time:
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['filter-option']}>
            <SelectInput
              className={styles.select}
              value={option}
              options={mapDateOptions(intl)}
              onChange={nextValue =>
                onUpdateValue({
                  target,
                  type,
                  value,
                  option: nextValue.target.value,
                })
              }
              clearable={false}
              hasError={optionError}
            />
          </div>
          {option === FILTER_TYPES.range ? (
            <div className={styles['filter-input-m']}>
              <TimeRangeFilter
                value={value || { from: '', to: '' }}
                onUpdateFilter={nextValue =>
                  onUpdateValue({ target, type, value: nextValue, option })
                }
                error={inputError}
              />
            </div>
          ) : (
            <div className={styles['filter-input-s']}>
              <TimeSingleFilter
                value={value || ''}
                onUpdateFilter={nextValue =>
                  onUpdateValue({
                    target,
                    type,
                    value: nextValue,
                    option,
                  })
                }
                error={inputError}
              />
            </div>
          )}
        </Spacings.Inline>
      );
    case FIELD_TYPES.Money:
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['filter-option']}>
            <SelectInput
              className={styles.select}
              value={option}
              options={mapNumericOptions(intl)}
              onChange={nextValue =>
                onUpdateValue({
                  target,
                  type,
                  value: null,
                  option: nextValue.target.value,
                })
              }
              clearable={false}
              hasError={optionError}
            />
          </div>

          {option === FILTER_TYPES.range ? (
            <div className={styles['filter-input-l']}>
              {createMoneyRangeFilter()({
                value: value || {
                  from: { currencyCode: '', amount: '', currencies },
                  to: { currencyCode: '', amount: '', currencies: [] },
                },
                onUpdateFilter: nextValue =>
                  onUpdateValue({
                    target,
                    type,
                    value: {
                      ...nextValue,
                      to: {
                        ...nextValue.to,
                        currencyCode: nextValue.from.currencyCode,
                      },
                    },
                    option,
                  }),
                error: inputError,
              })}
            </div>
          ) : (
            <div className={styles['filter-input-s']}>
              {createMoneySingleFilter()({
                value: value || { currencyCode: '', amount: '', currencies },
                onUpdateFilter: nextValue =>
                  onUpdateValue({
                    target,
                    type,
                    value: nextValue,
                    option,
                  }),
                error: inputError,
              })}
            </div>
          )}
        </Spacings.Inline>
      );
    case FIELD_TYPES.Reference:
    case FIELD_TYPES.Set:
      return (
        <Spacings.Inline scale="s" alignItems="center">
          <div className={styles['not-supported']}>
            <Text.Detail>{`${type.name} filter is not suported yet`}</Text.Detail>
          </div>
        </Spacings.Inline>
      );
    default:
      throw new Error("Still not found what I'm looking for");
  }
};

/* eslint-disable react/prop-types */
export function renderInput({
  value,
  onUpdateValue,
  hasError,
  customFieldDefinitions,
  intl,
  currencies,
  languages,
  disabled,
}) {
  const { target } = value || {};
  return (
    <div className={styles['filter-container']}>
      <div className={styles['filter-selector']}>
        <SelectInput
          name="custom-field-selector"
          value={target}
          options={mapCustomFieldDefinitionsToOptions(
            customFieldDefinitions,
            intl.locale,
            languages
          )}
          onChange={nextValue =>
            onUpdateValue({
              target: nextValue.target.value,
              type: customFieldDefinitions[nextValue.target.value].type,
            })
          }
          isClearable={false}
          isDisabled={disabled}
          horizontalConstraint="xl"
        />
      </div>
      {target &&
        renderTypeFilter({
          filterValue: value,
          onUpdateValue,
          intl,
          hasError,
          currencies,
          languages,
        })}
    </div>
  );
}
renderInput.displayName = 'Input';

export default compose(
  withRouter,
  withApplicationContext(applicationContext => ({
    currencies: applicationContext.project.currencies,
    languages: applicationContext.project.languages,
  })),
  injectIntl
)(CustomFieldFilter);
