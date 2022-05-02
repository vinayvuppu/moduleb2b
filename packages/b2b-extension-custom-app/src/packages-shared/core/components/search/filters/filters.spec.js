import React from 'react';
import { shallow } from 'enzyme';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import { createMountOptions, intlMock } from '../../../../test-utils';
import FieldFilters from '../field-filters';
import { Filters } from './filters';

const Filter = jest.fn();
Filter.displayName = 'Filter';

const Tag = jest.fn();
Tag.displayName = 'Tag';

const filterTypes = {
  someFilter: {
    filterComponent: Filter,
    tagComponent: Tag,
    validator: jest.fn(),
    label: 'Some Filter',
  },
  someOtherFilter: {
    filterComponent: Filter,
    tagComponent: Tag,
    validator: jest.fn(),
    label: 'Some Other Filter',
  },
};

const createTestProps = custom => ({
  filteredFields: {
    someField: [
      {
        type: 'someFilter',
        value: '2017-02-03',
      },
    ],
    someOtherField: [
      {
        type: 'someFilter',
        value: '2017-02-03',
      },
    ],
  },
  fieldDefinitions: {
    someField: {
      label: 'Some Field',
      filterTypes,
    },
    someOtherField: {
      label: 'Some Other Field',
      filterTypes,
    },
    someThirdField: {
      label: 'Some Third Field',
      filterTypes,
    },
    someFourthField: {
      label: 'Some Fourth Field',
      filterTypes,
    },
  },
  isEditMode: true,
  showSaveToolbar: true,

  // callbacks
  onToggleEditMode: jest.fn(),
  onUpdateFilterForField: jest.fn(),
  onRemoveFilterFromField: jest.fn(),
  onAddFilterToField: jest.fn(),
  onAddField: jest.fn(),
  onApplyFilters: jest.fn(),
  onCancelFilterChanges: jest.fn(),
  onRemoveFilterTagFromField: jest.fn(),
  onClearFiltersFromField: jest.fn(),
  intl: intlMock,
  track: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  describe('there are no filters ', () => {
    let props;
    let wrapper;
    let fieldFilters;
    beforeEach(() => {
      props = createTestProps({ filteredFields: {} });
      wrapper = shallow(<Filters {...props} />, createMountOptions());
      fieldFilters = wrapper.find(FieldFilters);
    });

    it('should not render field filters if there are no filters', () => {
      expect(fieldFilters).toHaveLength(0);
    });
    it('should not render `FlatButton`', () => {
      expect(wrapper.find('FlatButton')).toHaveLength(0);
    });
  });

  describe('there are filters', () => {
    let props;
    let wrapper;
    let fieldFilters;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<Filters {...props} />, createMountOptions());
      fieldFilters = wrapper.find(FieldFilters);
    });
    it('should render a FieldFilters component for each filtered field', () => {
      expect(fieldFilters).toHaveLength(2);
      expect(fieldFilters.at(0).props()).toEqual({
        label: 'Some Field',
        filterOptions: {
          someFilter: {
            label: 'Some Filter',
            tagComponent: Tag,
            filterComponent: Filter,
            validator: expect.any(Function),
          },
          someOtherFilter: {
            label: 'Some Other Filter',
            tagComponent: Tag,
            filterComponent: Filter,
            validator: expect.any(Function),
          },
        },
        filters: [
          {
            type: 'someFilter',
            value: '2017-02-03',
          },
        ],
        onAddFilter: expect.any(Function),
        onRemoveFilter: expect.any(Function),
        onUpdateFilter: expect.any(Function),
      });
    });

    describe('Dropdown that has all unfiltered fields as options', () => {
      let unfilteredFieldsSelect;
      beforeEach(() => {
        unfilteredFieldsSelect = wrapper.find(SelectInput);
      });

      it('should render', () => {
        expect(unfilteredFieldsSelect).toHaveLength(1);
      });
      it('should display unfiltered fields as options', () => {
        expect(unfilteredFieldsSelect.props()).toEqual(
          expect.objectContaining({
            options: [
              { label: 'Some Third Field', value: 'someThirdField' },
              { label: 'Some Fourth Field', value: 'someFourthField' },
            ],
            onChange: expect.any(Function),
          })
        );
      });
      it('should call onAddField when changed', () => {
        unfilteredFieldsSelect.prop('onChange')({
          target: {
            value: 'someFourthField',
          },
        });
        expect(props.onAddField).toHaveBeenCalledTimes(1);
        expect(props.onAddField).toHaveBeenLastCalledWith({
          fieldName: 'someFourthField',
        });
      });
    });

    describe('callbacks on the children of the FiltersContainer', () => {
      describe('onAddFilter', () => {
        it('should trigger the onAddFilterToField callback ', () => {
          fieldFilters.at(0).prop('onAddFilter')({ option: 'someOption' });

          expect(props.onAddFilterToField).toHaveBeenCalledTimes(1);
          expect(props.onAddFilterToField).toHaveBeenCalledWith({
            option: 'someOption',
            fieldName: 'someField',
          });
        });
      });

      describe('onRemoveFilter', () => {
        it('should trigger the onRemoveFilterFromField callback ', () => {
          fieldFilters.at(0).prop('onRemoveFilter')({ option: 'someOption' });

          expect(props.onRemoveFilterFromField).toHaveBeenCalledTimes(1);
          expect(props.onRemoveFilterFromField).toHaveBeenCalledWith({
            option: 'someOption',
            fieldName: 'someField',
          });
        });
      });

      describe('onUpdateFilter', () => {
        it('should trigger the onRemoveFilterFromField callback ', () => {
          fieldFilters.at(0).prop('onUpdateFilter')({ option: 'someOption' });

          expect(props.onUpdateFilterForField).toHaveBeenCalledTimes(1);
          expect(props.onUpdateFilterForField).toHaveBeenCalledWith({
            option: 'someOption',
            fieldName: 'someField',
          });
        });
      });
    });

    describe('toolbar', () => {
      describe('`cancel` button', () => {
        let cancelButton;
        beforeEach(() => {
          cancelButton = wrapper.find('ButtonCancel');
        });
        it('should render', () => {
          expect(cancelButton).toHaveLength(1);
          expect(cancelButton.props()).toEqual(
            expect.objectContaining({
              label: 'Search.Filters.cancel',
              onClick: expect.any(Function),
            })
          );
        });
        it('should trigger cancel button functions', () => {
          cancelButton.prop('onClick')();
          expect(props.onCancelFilterChanges).toHaveBeenCalledTimes(1);
          expect(props.onToggleEditMode).toHaveBeenCalledTimes(1);
        });
      });
      describe('apply buttons', () => {
        it('should render two buttons', () => {
          expect(wrapper.find('PrimaryButton')).toHaveLength(2);
        });
        describe('`apply` button', () => {
          let applyButton;
          beforeEach(() => {
            applyButton = wrapper.find('PrimaryButton').at(0);
          });
          it('should render', () => {
            expect(applyButton.props()).toEqual(
              expect.objectContaining({
                label: 'Search.Filters.apply',
                onClick: props.onApplyFilters,
              })
            );
          });
          it('should trigger onApplyFilters', () => {
            applyButton.prop('onClick')();
            expect(props.onApplyFilters).toHaveBeenCalledTimes(1);
          });
        });
        describe('`apply and close`', () => {
          let applyAndCloseButton;
          beforeEach(() => {
            applyAndCloseButton = wrapper.find('PrimaryButton').at(1);
          });
          it('should render', () => {
            expect(applyAndCloseButton.props()).toEqual(
              expect.objectContaining({
                label: 'Search.Filters.applyAndClose',
                onClick: expect.any(Function),
              })
            );
          });
          it('should trigger onApplyFilters and onToggleEditMode', () => {
            props.onApplyFilters.mockImplementation(() => true);
            applyAndCloseButton.prop('onClick')();
            expect(props.onApplyFilters).toHaveBeenCalledTimes(1);
            expect(props.onToggleEditMode).toHaveBeenCalledTimes(1);
          });
          it('should trigger onApplyFilters but not onToggleEditMode', () => {
            props.onApplyFilters.mockImplementation(() => false);
            applyAndCloseButton.prop('onClick')();
            expect(props.onApplyFilters).toHaveBeenCalledTimes(1);
            expect(props.onToggleEditMode).toHaveBeenCalledTimes(0);
          });
        });
      });
    });
    describe('isEditMode is false', () => {
      let tagComponent;
      beforeEach(() => {
        props = createTestProps({ isEditMode: false });
        wrapper = shallow(<Filters {...props} />, createMountOptions());
        tagComponent = wrapper.find('Tag');
      });

      it('should not render filters dropdown', () => {
        expect(wrapper.find(SelectInput)).toHaveLength(0);
      });

      it('should not render toolbar', () => {
        expect(wrapper.find('div.toolbar')).toHaveLength(0);
      });

      it('should render a Tag component for each filtered field', () => {
        expect(tagComponent).toHaveLength(2);
        expect(tagComponent.at(0).props()).toEqual({
          fieldLabel: 'Some Field',
          filterTypeLabel: 'some filter',
          value: '2017-02-03',
          onRemove: expect.any(Function),
          onClick: expect.any(Function),
        });
        expect(tagComponent.at(1).props()).toEqual({
          fieldLabel: 'Some Other Field',
          filterTypeLabel: 'some filter',
          value: '2017-02-03',
          onRemove: expect.any(Function),
          onClick: expect.any(Function),
        });
      });

      it('should update filters when removing tag', () => {
        tagComponent.at(0).prop('onRemove')();
        expect(props.onRemoveFilterTagFromField).toHaveBeenCalledTimes(1);
        expect(props.onRemoveFilterTagFromField).toHaveBeenLastCalledWith({
          index: 0,
          fieldName: 'someField',
        });
      });
    });
    describe('showSaveToolbar is false', () => {
      let filterButtons;
      beforeEach(() => {
        props = createTestProps({ showSaveToolbar: false });
        filterButtons = shallow(<Filters {...props} />, createMountOptions());
      });

      it('should not render filter buttons', () => {
        expect(filterButtons).not.toRender('PrimaryButton');
        expect(filterButtons).not.toRender('ButtonCancel');
      });
    });
  });
});
