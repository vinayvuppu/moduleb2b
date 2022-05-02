import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { AsyncSelectInput } from '@commercetools-frontend/ui-kit';
import styles from './autocomplete.mod.css';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
const SafeHTMLElement = canUseDOM ? window.HTMLElement : {};

class Autocomplete extends React.PureComponent {
  static displayName = 'Autocomplete';

  static propTypes = {
    /**
     * triggered when value changes, returns item selected
     */
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    /**
     * should return a promise that resolves to an array of items,
     * or just the array of items directly
     */
    loadItems: PropTypes.func.isRequired,
    /**
     * maps items to shape: { value, label }
     */
    mapItemToOption: PropTypes.func.isRequired,
    /**
     * maps value back to an item
     */
    mapValueToItem: PropTypes.func.isRequired,

    /**
     * take in an item (return from loadItems) and render it as you wish
     */
    renderItem: PropTypes.func,

    /**
     * defines the behaviour in the select to filter the values.
     * use this function in case you want the select component to filter the
     * data. If you do not want the select to filter anything and do the filters
     * only calling the API, pass this as () => true.
     */
    filterOption: PropTypes.func,
    /**
     * If set to true, it will load the options as soon as the component mounts
     */
    autoload: PropTypes.bool,
    hasError: PropTypes.bool,
    maxMenuHeight: PropTypes.number,
    placeholderLabel: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    isMulti: PropTypes.bool,
    isClearable: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    menuPortalTarget: PropTypes.instanceOf(SafeHTMLElement),
    menuPortalZIndex: PropTypes.number,
    horizontalConstraint: PropTypes.oneOf(['s', 'm', 'l', 'xl', 'scale']),
  };

  static defaultProps = {
    isMulti: false,
    isClearable: false,
    autoload: false,
    disabled: false,
    hasError: false,
  };

  /**
   * react-select will use the returned promise to populate the select
   * options when it resolves.
   */
  handleLoadItems = value =>
    Promise.resolve(this.props.loadItems(value)).then(items =>
      items.map(item => this.props.mapItemToOption(item))
    );

  // Since we are always dealing with references here, the value is always the
  // resource `id`, thus we should return this instead of a `Reference` object.
  handleChange = event => {
    const option = this.props.isMulti
      ? event.target.value.map(item => item.value)
      : event.target.value?.value || null;
    this.props.onChange(option);
  };

  render() {
    let value = null;
    if (this.props.value)
      value = this.props.isMulti
        ? this.props.value.map(this.props.mapItemToOption)
        : this.props.mapItemToOption(this.props.value);
    return (
      <div className={classnames(this.props.className, styles.container)}>
        <AsyncSelectInput
          horizontalConstraint={this.props.horizontalConstraint}
          placeholder={this.props.placeholderLabel}
          isMulti={this.props.isMulti}
          name={this.props.name}
          value={value}
          hasError={this.props.hasError}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onChange={this.handleChange}
          loadOptions={this.handleLoadItems}
          components={{
            Option: props => (
              <AsyncSelectInput.Option {...props}>
                {this.props.renderItem
                  ? this.props.renderItem(
                      this.props.mapValueToItem(props.data.value)
                    )
                  : props.data.label}
              </AsyncSelectInput.Option>
            ),
          }}
          isClearable={this.props.isClearable}
          filterOption={this.props.filterOption}
          isDisabled={this.props.disabled}
          defaultOptions={this.props.autoload}
          maxMenuHeight={this.props.maxMenuHeight}
          menuPortalTarget={this.props.menuPortalTarget}
          menuPortalZIndex={this.props.menuPortalZIndex}
        />
      </div>
    );
  }
}

export default Autocomplete;
