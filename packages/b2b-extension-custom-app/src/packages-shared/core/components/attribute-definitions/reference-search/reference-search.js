import PropTypes from 'prop-types';
import React from 'react';
import { withApollo } from 'react-apollo';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import capitalizeFirst from '../../../../utils/capitalize-first';
import Autocomplete from '../../fields/autocomplete';
import styles from './reference-search.mod.css';

export function ItemCache(initialItems) {
  return {
    items: { ...initialItems },
    get(id) {
      return this.items[id] || null;
    },
    set(id, item) {
      this.items[id] = item;
    },
    has(id) {
      return Boolean(this.get(id));
    },
  };
}

// This is a hashmap of loaded items used to map a value to an item
const cache = new ItemCache();

export function createReferenceSearch({
  type,
  loadItems,
  getItemById,
  mapItemToOption,
  renderItem,
  labels,
  filterOption,
  itemCache = cache,
}) {
  class ReferenceSearch extends React.PureComponent {
    static displayName = `${capitalizeFirst(type)}ReferenceSearch`;

    static propTypes = {
      definition: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      selectedLanguage: PropTypes.string.isRequired,
      languages: PropTypes.arrayOf(PropTypes.string).isRequired,
      onChangeValue: PropTypes.func.isRequired,
      onBlur: PropTypes.func,
      hasError: PropTypes.bool,
      isClearable: PropTypes.bool,
      value: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),

      client: PropTypes.object.isRequired,
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,

      disabled: PropTypes.bool,
    };

    static defaultProps = {
      disabled: false,
      hasError: false,
      isClearable: false,
    };

    state = {
      value: null,
      hasLoadedValue: false,
      hasBeenFocused: false,
    };

    // Used to debounce load items requests
    loadItemsTimeout = null;

    /**
     * The first time the component mounts we check to see if the api object
     * the value refers to exists. In subsequent prop changes, the value will
     * come from an api object that has already been loaded so we know for sure
     * that it exists and don't need to do this check again
     */

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillMount() {
      // value passed in and item not in cache, load it
      if (this.props.value && !itemCache.has([this.props.value.id]))
        getItemById(this.props.value.id, this.props.client).then(item => {
          itemCache.set(this.props.value.id, item);
          this.setState({ value: item, hasLoadedValue: true });
        });
      else if (this.props.value)
        // value passed in and item exists in cache
        this.setState({
          value: itemCache.get(this.props.value.id),
          hasLoadedValue: true,
        });
      // no value, set to null
      else this.setState({ value: null, hasLoadedValue: true });
    }

    /**
     * The value we get here will be an object reference , so we check our
     * itemCache to find the real object
     */

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value)
        this.setState({
          value: nextProps.value ? itemCache.get(nextProps.value.id) : null,
        });
    }

    mapValueToItem = value => itemCache.get(value) || null;

    handleLoadItems = text => {
      if (this.loadItemsTimeout) clearTimeout(this.loadItemsTimeout);

      const loadItemsPromise = new Promise(resolve => {
        this.loadItemsTimeout = setTimeout(() => {
          loadItems(text, this.props.selectedLanguage, this.props.client).then(
            items => {
              items.forEach(item => {
                itemCache.set(item.id, item);
              });
              resolve(items);
            }
          );
        }, 300);
      });

      return loadItemsPromise;
    };

    handleChange = value => {
      if (value)
        this.props.onChangeValue({
          name: this.props.definition.name,
          value: {
            id: value,
            typeId: type,
          },
        });
      else
        this.props.onChangeValue({
          name: this.props.definition.name,
          value: null,
        });
    };

    renderOption = option =>
      renderItem(this.mapValueToItem(option.id), {
        language: this.props.selectedLanguage,
        languages: this.props.languages,
        formatMessage: this.props.intl.formatMessage,
      });

    render() {
      const valueHasBeenDeleted =
        this.props.value && this.state.hasLoadedValue && !this.state.value;

      return (
        this.state.hasLoadedValue && (
          <div>
            {valueHasBeenDeleted && (
              <div className={styles['missing-label']}>
                {this.props.intl.formatMessage(labels.isMissing)}
              </div>
            )}
            <Autocomplete
              onChange={this.handleChange}
              onFocus={() => this.setState({ hasBeenFocused: true })}
              hasError={this.props.hasError}
              onBlur={this.props.onBlur}
              value={this.state.value || this.props.value || null}
              noResultsLabel={this.props.intl.formatMessage(labels.noResults)}
              placeholderLabel={this.props.intl.formatMessage(
                labels.placeholder
              )}
              searchPromptLabel={this.props.intl.formatMessage(
                labels.searchPrompt
              )}
              loadItems={this.handleLoadItems}
              mapItemToOption={item =>
                mapItemToOption(item, {
                  language: this.props.selectedLanguage,
                  languages: this.props.languages,
                })
              }
              mapValueToItem={this.mapValueToItem}
              renderItem={this.renderOption}
              filterOption={filterOption}
              disabled={this.props.disabled}
              isClearable={this.props.isClearable}
            />
          </div>
        )
      );
    }
  }

  return ReferenceSearch;
}

export default compose(injectIntl, withApollo, createReferenceSearch);
