import React from 'react';
import { shallow } from 'enzyme';
import SingleFilterTag from '../single-filter-tag';
import RangeFilterTag from '../range-filter-tag';
import { FILTER_TYPES } from '../../../../constants';
import CustomFieldFilterTag, { renderValue } from './custom-field-filter-tag';

const createTestProps = custom => ({
  fieldLabel: 'BooleanField',
  filterTypeLabel: '',
  value: {
    option: FILTER_TYPES.lessThan,
    target: 'someCustomField',
    type: { name: 'Boolean' },
  },
  onRemove: jest.fn(),
  onClick: jest.fn(),
  ...custom,
});

const createRenderTestProps = custom => ({
  type: { name: 'Boolean' },
  value: { label: 'Yes', value: true },
  ...custom,
});

describe('renderValue', () => {
  let result;
  let expected;
  let filter;
  describe('Money', () => {
    beforeEach(() => {
      filter = createRenderTestProps({
        type: { name: 'Money' },
        value: { currencyCode: 'EUR', amount: '200' },
      });
      result = renderValue(filter);
      expected = 'EUR 200';
    });

    it('should render a money value', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('LocalizedString', () => {
    beforeEach(() => {
      filter = createRenderTestProps({
        type: { name: 'LocalizedString' },
        value: { en: 'some value', es: 'algun valor' },
      });
      result = renderValue(filter);
      expected = 'some value (EN) algun valor (ES)';
    });

    it('should render a localized value', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('Time', () => {
    beforeEach(() => {
      filter = createRenderTestProps({
        type: { name: 'Time' },
        value: '12:00:00.000',
      });
      result = renderValue(filter);
      expected = '12:00';
    });

    it('should render a time value', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('DateTime', () => {
    beforeEach(() => {
      filter = createRenderTestProps({
        type: { name: 'DateTime' },
        value: '2018-10-30T10:20:40.100+2',
      });
      result = renderValue(filter);
      expected = '2018-10-30 10:20';
    });

    it('should render a date time value', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('Boolean', () => {
    beforeEach(() => {
      filter = createRenderTestProps();
      result = renderValue(filter);
      expected = 'Yes';
    });

    it('should render a date time value', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('String', () => {
    beforeEach(() => {
      filter = createRenderTestProps({
        type: { name: 'String' },
        value: 'some value',
      });
      result = renderValue(filter);
      expected = 'some value';
    });

    it('should render a string value', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('Enum', () => {
    beforeEach(() => {
      filter = createRenderTestProps({
        type: { name: 'Enum' },
        value: { value: 'enumValue', label: 'enumLabel' },
      });
      result = renderValue(filter);
      expected = 'enumLabel';
    });

    it('should render a enum label', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('LocalizedEnum', () => {
    beforeEach(() => {
      filter = createRenderTestProps({
        type: { name: 'LocalizedEnum' },
        value: { value: 'localizeEnumValue', label: 'localizeEnumLabel (EN)' },
      });
      result = renderValue(filter);
      expected = 'localizeEnumLabel (EN)';
    });

    it('should render a localized enum label', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('Number', () => {
    beforeEach(() => {
      filter = createRenderTestProps({
        type: { name: 'Number' },
        value: 1000,
      });
      result = renderValue(filter);
      expected = 1000;
    });

    it('should render a number value', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('Date', () => {
    beforeEach(() => {
      filter = createRenderTestProps({
        type: { name: 'Date' },
        value: { value: '2018-10-30T00:00:00.000T+1', label: '2018-10-30' },
      });
      result = renderValue(filter);
      expected = '2018-10-30';
    });

    it('should render a date label', () => {
      expect(result).toEqual(expected);
    });
  });
});

describe('CustomFieldFilterTag', () => {
  let wrapper;
  let props;

  describe('SingleFilterTag', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CustomFieldFilterTag {...props} />);
    });

    it('should render a single filter tag', () => {
      expect(wrapper).toRender(SingleFilterTag);
    });
  });

  describe('RangeFilterTag', () => {
    beforeEach(() => {
      props = createTestProps({
        value: {
          option: FILTER_TYPES.range,
          target: 'someCustomField',
          type: { name: 'Money' },
        },
      });
      wrapper = shallow(<CustomFieldFilterTag {...props} />);
    });

    it('should render a range filter tag', () => {
      expect(wrapper).toRender(RangeFilterTag);
    });
  });
});
