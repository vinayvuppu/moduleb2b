import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import startCase from 'lodash.startcase';
import { PrimaryButton, SelectInput } from '@commercetools-frontend/ui-kit';
import { ButtonCancel } from '../../buttons';
import FieldFilters from '../field-filters';
import messages from './messages';
import injectTracking from '../../tracking/inject-tracking';
import trackingEvents from './tracking-events';
import styles from './filters.mod.css';

export class Filters extends React.PureComponent {
  static displayName = 'Filters';

  static propTypes = {
    filteredFields: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          value: PropTypes.any,
        })
      ).isRequired
    ),

    // Describes the filter options available for each field
    fieldDefinitions: PropTypes.objectOf(
      PropTypes.shape({
        label: PropTypes.string,
        filterTypes: PropTypes.objectOf(
          PropTypes.shape({
            filterComponent: PropTypes.func.isRequired,
            tagComponent: PropTypes.func.isRequired,
            validator: PropTypes.func,
            label: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ),

    // used to render either tags (false) or filters (true)
    isEditMode: PropTypes.bool,

    // use when add rules to filter for show apply buttons
    showSaveToolbar: PropTypes.bool,

    // CALLBACKS
    onToggleEditMode: PropTypes.func.isRequired,
    onUpdateFilterForField: PropTypes.func.isRequired,
    onRemoveFilterFromField: PropTypes.func.isRequired,
    onAddFilterToField: PropTypes.func.isRequired,
    onAddField: PropTypes.func.isRequired,
    onApplyFilters: PropTypes.func.isRequired,
    onCancelFilterChanges: PropTypes.func.isRequired,
    onRemoveFilterTagFromField: PropTypes.func.isRequired,
    onClearFiltersFromField: PropTypes.func.isRequired,

    trackingPrefix: PropTypes.string,

    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    // injectTracking
    track: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isEditMode: false,
    showSaveToolbar: true,
  };

  getTrackingCategory = category =>
    [this.props.trackingPrefix, category].join('-');

  getUnfilteredFields = filteredFields =>
    Object.keys(this.props.fieldDefinitions)
      .filter(fieldName => !filteredFields[fieldName])
      .map(fieldName => ({
        value: fieldName,
        label: this.props.fieldDefinitions[fieldName].label,
      }));

  renderFieldFilters = ({
    fieldName,
    fieldFilters,
    fieldDefinition,
    onUpdateFilterForField,
    onRemoveFilterFromField,
    onAddFilterToField,
  }) => (
    <FieldFilters
      key={fieldName}
      filterOptions={fieldDefinition.filterTypes}
      filters={fieldFilters}
      label={fieldDefinition.label}
      onAddFilter={options =>
        onAddFilterToField({
          ...options,
          fieldName,
        })
      }
      onRemoveFilter={options =>
        onRemoveFilterFromField({
          ...options,
          fieldName,
        })
      }
      onUpdateFilter={options =>
        onUpdateFilterForField({
          ...options,
          fieldName,
        })
      }
    />
  );

  renderFieldTags = ({
    fieldName,
    fieldDefinition,
    fieldFilters,
    onRemoveFilterTagFromField,
  }) =>
    fieldFilters.map(({ value, type }, index) => {
      const TagComponent = fieldDefinition.filterTypes[type].tagComponent;
      return (
        <div key={index} className={styles.tag}>
          <TagComponent
            fieldLabel={fieldDefinition.label}
            filterTypeLabel={fieldDefinition.filterTypes[
              type
            ].label.toLowerCase()}
            value={value}
            onRemove={() => onRemoveFilterTagFromField({ index, fieldName })}
            onClick={() => {
              this.props.track(
                trackingEvents.viewFilter.event,
                this.getTrackingCategory(trackingEvents.viewFilter.category),
                startCase(fieldName)
              );
              this.props.onToggleEditMode();
            }}
          />
        </div>
      );
    });

  render() {
    if (
      !this.props.isEditMode &&
      Object.keys(this.props.filteredFields).length === 0
    )
      return null;

    const renderFunction = this.props.isEditMode
      ? this.renderFieldFilters
      : this.renderFieldTags;
    const fields = Object.keys(this.props.filteredFields)
      .map(fieldName =>
        renderFunction({
          fieldName,
          fieldFilters: this.props.filteredFields[fieldName],
          fieldDefinition: this.props.fieldDefinitions[fieldName],
          onUpdateFilterForField: this.props.onUpdateFilterForField,
          onRemoveFilterFromField: this.props.onRemoveFilterFromField,
          onAddFilterToField: this.props.onAddFilterToField,
          onApplyFilters: this.props.onApplyFilters,
          onRemoveFilterTagFromField: this.props.onRemoveFilterTagFromField,
        })
      )
      .filter(field => field.length !== 0);

    if (!this.props.isEditMode && fields.length === 0) return null;

    return (
      <div
        className={this.props.showSaveToolbar ? '' : styles['filters-bottom']}
      >
        <div
          className={
            this.props.isEditMode ? styles['filters-edit'] : styles.filters
          }
        >
          {/* don't render container div if there are no fields */
          fields.length > 0 && (
            <div
              className={
                this.props.isEditMode
                  ? styles['field-filters']
                  : styles['field-tags']
              }
            >
              {fields}
            </div>
          )}
          {this.props.isEditMode && (
            <div className={styles.footer}>
              <div className={styles.selectContainer}>
                <SelectInput
                  name="filters-list"
                  options={this.getUnfilteredFields(this.props.filteredFields)}
                  placeholder={this.props.intl.formatMessage(
                    messages.addFilter
                  )}
                  isSearchable={true}
                  menuPortalTarget={document.body}
                  onChange={event => {
                    this.props.onAddField({ fieldName: event.target.value });
                  }}
                  noOptionsMessage={() =>
                    this.props.intl.formatMessage(
                      messages.noMoreAvailableFields
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
        {/* TODO use the toolbar component here */
        this.props.isEditMode && this.props.showSaveToolbar && (
          <div className={styles.toolbar}>
            <ButtonCancel
              onClick={() => {
                this.props.onCancelFilterChanges();
                this.props.onToggleEditMode();
              }}
              label={this.props.intl.formatMessage(messages.cancel)}
              data-track-component="SecondaryButton"
              data-track-label="Cancel"
              data-track-event="click"
            />
            <div className={styles['button-container']}>
              <PrimaryButton
                onClick={this.props.onApplyFilters}
                label={this.props.intl.formatMessage(messages.apply)}
                data-track-component="PrimaryButton"
                data-track-label="Apply"
                data-track-event="click"
              />
              <PrimaryButton
                onClick={() => {
                  if (this.props.onApplyFilters({ removeEmptyFilters: true }))
                    this.props.onToggleEditMode();
                }}
                label={this.props.intl.formatMessage(messages.applyAndClose)}
                data-track-component="PrimaryButton"
                data-track-label="ApplyAndClose"
                data-track-event="click"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default compose(injectIntl, injectTracking)(Filters);
