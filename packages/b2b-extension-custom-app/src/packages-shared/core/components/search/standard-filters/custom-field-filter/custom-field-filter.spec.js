import React from 'react';
import { shallow } from 'enzyme';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../../../test-utils';
import SingleFilter from '../single-filter';
import RangeFilter from '../range-filter';
import {
  DateSingleFilter,
  DateRangeFilter,
  DateTimeSingleFilter,
  DateTimeRangeFilter,
  TimeSingleFilter,
  TimeRangeFilter,
} from '../date-filters';
import { TextSingleFilter } from '../text-filter';
import { LocalizedTextSingleFilter } from '../localized-text-filter';
import { FILTER_TYPES, FIELD_TYPES } from '../../../../constants';
import {
  mapCustomFieldDefinitionsToOptions,
  mapEnumValuesToOptions,
  getEnumValueLabel,
  mapLocalizedEnumValuesToOptions,
  CustomFieldFilter,
  renderTypeFilter,
  renderInput,
} from './custom-field-filter';

const languages = ['en', 'de', 'es'];
const currencies = ['EUR', 'USD'];

const customFieldDefinitions = [
  {
    label: { en: 'Boolean Label' },
    name: 'BooleanField',
    type: {
      name: FIELD_TYPES.Boolean,
    },
  },
  {
    label: { en: 'String Label' },
    name: 'StringField',
    type: {
      name: FIELD_TYPES.String,
    },
  },
  {
    label: { en: 'LocalizedString Label' },
    name: 'LocalizedStringField',
    type: {
      name: FIELD_TYPES.LocalizedString,
    },
  },
  {
    label: { en: 'Enum Label' },
    name: 'EnumField',
    type: {
      name: FIELD_TYPES.Enum,
      values: [
        { key: 'enum0', label: 'Enum0' },
        { key: 'enum1', label: 'Enum1' },
      ],
    },
  },
  {
    label: { en: 'LocalizedEnum Label' },
    name: 'LocalizedEnumField',
    type: {
      name: FIELD_TYPES.LocalizedEnum,
      values: [
        { key: 'lEnum0', labelAllLocales: [{ value: 'LEnum0', locale: 'en' }] },
        { key: 'lEnum1', labelAllLocales: [{ value: 'LEnum1', locale: 'en' }] },
      ],
    },
  },
  {
    label: { en: 'Number Label' },
    name: 'NumberField',
    type: {
      name: FIELD_TYPES.Number,
    },
  },
  {
    label: { en: 'Date Label' },
    name: 'DateField',
    type: {
      name: FIELD_TYPES.Date,
    },
  },
  {
    label: { en: 'DateTime Label' },
    name: 'DateTimeField',
    type: {
      name: FIELD_TYPES.DateTime,
    },
  },
  {
    label: { en: 'Time Label' },
    name: 'TimeField',
    type: {
      name: FIELD_TYPES.Time,
    },
  },
  {
    label: { en: 'Money Label' },
    name: 'MoneyField',
    type: {
      name: FIELD_TYPES.Money,
    },
  },
  {
    label: { en: 'Reference Label' },
    name: 'ReferenceField',
    type: {
      name: FIELD_TYPES.Reference,
      referenceTypeId: 'zone',
    },
  },
  {
    label: { en: 'Set Label' },
    name: 'SetField',
    type: {
      name: FIELD_TYPES.Set,
      elementType: {
        name: FIELD_TYPES.Boolean,
      },
    },
  },
];

const renderCustomFieldDefinitions = {
  BooleanField: {
    label: { en: 'Boolean Label' },
    name: 'BooleanField',
    type: {
      name: FIELD_TYPES.Boolean,
    },
  },
  StringField: {
    label: { en: 'String Label' },
    name: 'StringField',
    type: {
      name: FIELD_TYPES.String,
    },
  },
  LocalizedStringField: {
    label: { en: 'LocalizedString Label' },
    name: 'LocalizedStringField',
    type: {
      name: FIELD_TYPES.LocalizedString,
    },
  },
  EnumField: {
    label: { en: 'Enum Label' },
    name: 'EnumField',
    type: {
      name: FIELD_TYPES.Enum,
      values: [
        { key: 'enum0', label: 'Enum0' },
        { key: 'enum1', label: 'Enum1' },
      ],
    },
  },
  LocalizedEnumField: {
    label: { en: 'LocalizedEnum Label' },
    name: 'LocalizedEnumField',
    type: {
      name: FIELD_TYPES.LocalizedEnum,
      values: [
        { key: 'lEnum0', labelAllLocales: [{ value: 'LEnum0', locale: 'en' }] },
        { key: 'lEnum1', labelAllLocales: [{ value: 'LEnum1', locale: 'en' }] },
      ],
    },
  },
  NumberField: {
    label: { en: 'Number Label' },
    name: 'NumberField',
    type: {
      name: FIELD_TYPES.Number,
    },
  },
  DateField: {
    label: { en: 'Date Label' },
    name: 'DateField',
    type: {
      name: FIELD_TYPES.Date,
    },
  },
  DateTimeField: {
    label: { en: 'DateTime Label' },
    name: 'DateTimeField',
    type: {
      name: FIELD_TYPES.DateTime,
    },
  },
  TimeField: {
    label: { en: 'Time Label' },
    name: 'TimeField',
    type: {
      name: FIELD_TYPES.Time,
    },
  },
  MoneyField: {
    label: { en: 'Money Label' },
    name: 'MoneyField',
    type: {
      name: FIELD_TYPES.Money,
    },
  },
  ReferenceField: {
    label: { en: 'Reference Label' },
    name: 'ReferenceField',
    type: {
      name: FIELD_TYPES.Reference,
      referenceTypeId: 'zone',
    },
  },
  SetField: {
    label: { en: 'Set Label' },
    name: 'SetField',
    type: {
      name: FIELD_TYPES.Set,
      elementType: {
        name: FIELD_TYPES.Boolean,
      },
    },
  },
};

const createTestProps = custom => ({
  customFieldDefinitions,
  onUpdateFilter: jest.fn(),
  intl: intlMock,
  currencies,
  languages,
  ...custom,
});

const createRenderTestProps = custom => ({
  onUpdateValue: jest.fn(),
  intl: intlMock,
  hasError: {},
  currencies,
  languages,
  ...custom,
});

describe('utils', () => {
  let expected;
  let result;
  describe('mapCustomFieldDefinitionsToOptions', () => {
    beforeEach(() => {
      result = mapCustomFieldDefinitionsToOptions(
        renderCustomFieldDefinitions,
        intlMock.locale,
        languages
      );
      expected = [
        { value: 'BooleanField', label: 'Boolean Label' },
        { value: 'StringField', label: 'String Label' },
        { value: 'LocalizedStringField', label: 'LocalizedString Label' },
        { value: 'EnumField', label: 'Enum Label' },
        { value: 'LocalizedEnumField', label: 'LocalizedEnum Label' },
        { value: 'NumberField', label: 'Number Label' },
        { value: 'DateField', label: 'Date Label' },
        { value: 'DateTimeField', label: 'DateTime Label' },
        { value: 'TimeField', label: 'Time Label' },
        { value: 'MoneyField', label: 'Money Label' },
        { value: 'ReferenceField', label: 'Reference Label' },
        { value: 'SetField', label: 'Set Label' },
      ];
    });

    it('should map custom fields definitions to options', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('mapEnumValuesToOptions', () => {
    beforeEach(() => {
      result = mapEnumValuesToOptions(
        renderCustomFieldDefinitions.EnumField.type.values
      );
      expected = [
        { value: 'enum0', label: 'Enum0' },
        { value: 'enum1', label: 'Enum1' },
      ];
    });

    it('should map enum values to options', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('getEnumValueLabel', () => {
    beforeEach(() => {
      result = getEnumValueLabel('enum0', [
        { value: 'enum0', label: 'Enum0' },
        { value: 'enum1', label: 'Enum1' },
      ]);
      expected = 'Enum0';
    });

    it('should return label of the enum type', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('mapLocalizedEnumValuesToOptions', () => {
    beforeEach(() => {
      result = mapLocalizedEnumValuesToOptions(
        renderCustomFieldDefinitions.LocalizedEnumField.type.values,
        languages,
        intlMock.locale
      );
      expected = [
        { value: 'lEnum0', label: 'LEnum0 (EN)' },
        { value: 'lEnum1', label: 'LEnum1 (EN)' },
      ];
    });

    it('should map localized enum values to options', () => {
      expect(result).toEqual(expected);
    });
  });
});

describe('CustomFieldFilter', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomFieldFilter {...props} />);
  });

  describe('statics', () => {
    describe('defaultProps', () => {
      it('should default disabled to `false`', () => {
        expect(CustomFieldFilter.defaultProps.disabled).toEqual(false);
      });

      it('should default hideTypes to `[]`', () => {
        expect(CustomFieldFilter.defaultProps.hideTypes).toEqual([]);
      });
    });
  });

  describe('rendering', () => {
    describe('SingleFilter', () => {
      it('should render a single filter', () => {
        expect(wrapper).toRender(SingleFilter);
      });

      it('should render a single filter with a `renderInput` function', () => {
        expect(wrapper).toHaveProp('renderInput', expect.any(Function));
      });

      it('should render a single filter with the given `value`', () => {
        expect(wrapper).toHaveProp('value', props.value);
      });

      it('should render a single filter with the given `error`', () => {
        expect(wrapper).toHaveProp('error', props.error);
      });

      it('should render a single filter with the given `onUpdateValue`', () => {
        expect(wrapper).toHaveProp('onUpdateValue', props.onUpdateFilter);
      });
    });
  });
});

describe('renderInput', () => {
  let wrapper;
  let onUpdateValue;
  beforeEach(() => {
    onUpdateValue = jest.fn();
    wrapper = shallow(
      <div>
        {renderInput({
          value: {
            target: 'BooleanField',
            type: {
              name: 'Boolean',
            },
            value: true,
          },
          onUpdateValue,
          customFieldDefinitions: renderCustomFieldDefinitions,
          intl: intlMock,
          languages,
          currencies,
        })}
      </div>
    );
  });

  it('should render a SelectInput component', () => {
    expect(wrapper).toRender(SelectInput);
  });

  it('should contain the passed value as prop', () => {
    expect(wrapper.find(SelectInput)).toHaveProp('value', 'BooleanField');
  });

  describe('callback', () => {
    beforeEach(() => {
      wrapper.find(SelectInput).prop('onChange')({
        target: { value: 'BooleanField' },
      });
    });

    it('should trigger the onChange callback', () => {
      expect(onUpdateValue).toHaveBeenCalledTimes(1);
    });

    it('should trigger the onChange callback passing the selected value', () => {
      expect(onUpdateValue).toHaveBeenCalledWith({
        target: 'BooleanField',
        type: { name: 'Boolean' },
      });
    });
  });
});

describe('renderTypeFilter', () => {
  let props;
  let wrapper;
  let customField;

  describe('Boolean', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.BooleanField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `SingleFilter` as boolean filter', () => {
      expect(wrapper).toRender(SingleFilter);
    });
  });

  describe('String', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.StringField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `TextSingleFilter` as string filter', () => {
      expect(wrapper).toRender(TextSingleFilter);
    });
  });

  describe('LocalizedString', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.LocalizedStringField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `LocalizedTextSingleFilter` as localized string filter', () => {
      expect(wrapper).toRender(LocalizedTextSingleFilter);
    });
  });

  describe('Enum', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.EnumField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `SingleFilter` as enum filter', () => {
      expect(wrapper).toRender(SingleFilter);
    });
  });

  describe('LocalizedEnum', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.LocalizedEnumField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `SingleFilter` as localized enum filter', () => {
      expect(wrapper).toRender(SingleFilter);
    });
  });

  describe('Number', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.NumberField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `SelectInput` as option dropdown', () => {
      expect(wrapper).toRender(SelectInput);
    });

    it('should render a `SingleFilter` as number filter', () => {
      expect(wrapper).toRender(SingleFilter);
    });

    describe('when filter type is `range`', () => {
      beforeEach(() => {
        customField = renderCustomFieldDefinitions.NumberField;
        props = createRenderTestProps({
          filterValue: {
            target: customField.name,
            type: customField.type,
            option: FILTER_TYPES.range,
          },
        });
        wrapper = shallow(renderTypeFilter(props));
      });

      it('should render a `RangeFilter` as number filter', () => {
        expect(wrapper).toRender(RangeFilter);
      });
    });
  });

  describe('Date', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.DateField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `SelectInput` as option dropdown', () => {
      expect(wrapper).toRender(SelectInput);
    });

    it('should render a `DateSingleFilter` as date filter', () => {
      expect(wrapper).toRender(DateSingleFilter);
    });

    describe('when filter type is `range`', () => {
      beforeEach(() => {
        customField = renderCustomFieldDefinitions.DateField;
        props = createRenderTestProps({
          filterValue: {
            target: customField.name,
            type: customField.type,
            option: FILTER_TYPES.range,
          },
        });
        wrapper = shallow(renderTypeFilter(props));
      });

      it('should render a `DateRangeFilter` as number filter', () => {
        expect(wrapper).toRender(DateRangeFilter);
      });
    });
  });

  describe('DateTime', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.DateTimeField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `SelectInput` as option dropdown', () => {
      expect(wrapper).toRender(SelectInput);
    });

    it('should render a `DateTimeSingleFilter` as date filter', () => {
      expect(wrapper).toRender(DateTimeSingleFilter);
    });

    describe('when filter type is `range`', () => {
      beforeEach(() => {
        customField = renderCustomFieldDefinitions.DateTimeField;
        props = createRenderTestProps({
          filterValue: {
            target: customField.name,
            type: customField.type,
            option: FILTER_TYPES.range,
          },
        });
        wrapper = shallow(renderTypeFilter(props));
      });

      it('should render a `DateTimeRangeFilter` as number filter', () => {
        expect(wrapper).toRender(DateTimeRangeFilter);
      });
    });
  });

  describe('Time', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.TimeField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `SelectInput` as option dropdown', () => {
      expect(wrapper).toRender(SelectInput);
    });

    it('should render a `TimeSingleFilter` as date filter', () => {
      expect(wrapper).toRender(TimeSingleFilter);
    });

    describe('when filter type is `range`', () => {
      beforeEach(() => {
        customField = renderCustomFieldDefinitions.TimeField;
        props = createRenderTestProps({
          filterValue: {
            target: customField.name,
            type: customField.type,
            option: FILTER_TYPES.range,
          },
        });
        wrapper = shallow(renderTypeFilter(props));
      });

      it('should render a `TimeRangeFilter` as number filter', () => {
        expect(wrapper).toRender(TimeRangeFilter);
      });
    });
  });

  describe('Money', () => {
    beforeEach(() => {
      customField = renderCustomFieldDefinitions.MoneyField;
      props = createRenderTestProps({
        filterValue: {
          target: customField.name,
          type: customField.type,
        },
      });
      wrapper = shallow(renderTypeFilter(props));
    });

    it('should render a `SelectInput` as option dropdown', () => {
      expect(wrapper).toRender(SelectInput);
    });

    it('should render a `SingleFilter` as date filter', () => {
      expect(wrapper).toRender(SingleFilter);
    });

    describe('when filter type is `range`', () => {
      beforeEach(() => {
        customField = renderCustomFieldDefinitions.MoneyField;
        props = createRenderTestProps({
          filterValue: {
            target: customField.name,
            type: customField.type,
            option: FILTER_TYPES.range,
          },
        });
        wrapper = shallow(renderTypeFilter(props));
      });

      it('should render a `RangeFilter` as number filter', () => {
        expect(wrapper).toRender(RangeFilter);
      });
    });
  });
});
