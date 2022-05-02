import { defineMessages } from 'react-intl';
import { withProps } from 'recompose';
import validateDate from '../../../../utils/filters/validation/date';
import validateNumber from '../../../../utils/filters/validation/number';
import validateCustomField from '../../../../utils/filters/validation/custom-field';
import {
  validateSingleOptionEnum,
  validateMultiOptionEnum,
} from '../../../../utils/filters/validation/enum';
import { FILTER_TYPES } from '../../../constants';
import { TextSingleFilter } from '../standard-filters/text-filter';
import {
  DateSingleFilter,
  DateRangeFilter,
} from '../standard-filters/date-filters';
import {
  DateSingleFilterTag,
  DateRangeFilterTag,
} from '../standard-filter-tags/date-filter-tags';
import {
  createNumberSingleFilter,
  createNumberRangeFilter,
} from '../standard-filters/number-filters';
import { createEnumSingleFilter } from '../standard-filters/enum-filters';
import { createCreatableEnumSingleFilter } from '../standard-filters/creatable-enum-filters';
import {
  NumberSingleFilterTag,
  NumberRangeFilterTag,
} from '../standard-filter-tags/number-filter-tags';
import TextSingleFilterTag from '../standard-filter-tags/text-filter-tags';
import {
  EnumSingleFilterTag,
  EnumSingleOptionFilterTag,
} from '../standard-filter-tags/enum-filter-tags';
import createCategoryReferenceSingleFilter from '../standard-filters/category-reference-filter';
import createCustomerGroupReferenceSingleFilter from '../standard-filters/customer-group-reference-filter';
import createStoreReferenceSingleFilter from '../standard-filters/store-reference-filter';
import createCompanyReferenceSingleFilter from '../standard-filters/company-reference-filter';
import createStateReferenceSingleFilter from '../standard-filters/state-reference-filter';
import CustomFieldFilter from '../standard-filters/custom-field-filter';
import CategoryReferenceFilterTag from '../standard-filter-tags/category-reference-filter-tag';
import CustomerGroupReferenceFilterTag from '../standard-filter-tags/customer-group-reference-filter-tag';
import CompanyReferenceFilterTag from '../standard-filter-tags/company-reference-filter-tag';
import StoreReferenceFilterTag from '../standard-filter-tags/store-reference-filter-tag';
import createStateFilterTag from '../standard-filter-tags/state-reference-filter-tag';
import NoValueFilterTag from '../standard-filter-tags/no-value-filter-tag';
import CustomFieldFilterTag from '../standard-filter-tags/custom-field-filter-tag';

// This can be used to build custom filter definitions.
// For example:
//   import { filterTypeMessages } from '...'
//   const customDefinitions = {
//     level: {
//       label: 'Level',
//       FILTER_TYPES: {
//         range: {
//           filterComponent: LeveleRangeFilter,
//           tagComponent: LevelRangeFilterTag,
//           label: intl.formatMessage(filterTypeMessages.range),
//         }
//       }
//     }
//   }
export const filterTypeDateMessages = defineMessages({
  // Filter type options
  [FILTER_TYPES.lessThan]: {
    id: 'Search.Filters.Definitions.Date.lessThan',
    description: 'Label of filter type (less than)',
    defaultMessage: 'before',
  },
  [FILTER_TYPES.moreThan]: {
    id: 'Search.Filters.Definitions.Date.moreThan',
    description: 'Label of filter type (less than)',
    defaultMessage: 'after',
  },
  [FILTER_TYPES.equalTo]: {
    id: 'Search.Filters.Definitions.Date.equalTo',
    description: 'Label of filter type (equal to)',
    defaultMessage: 'on',
  },
  [FILTER_TYPES.range]: {
    id: 'Search.Filters.Definitions.Date.range',
    description: 'Label of filter type (range)',
    defaultMessage: 'between',
  },
});
export const filterTypeNumberMessages = defineMessages({
  // Filter type options
  [FILTER_TYPES.lessThan]: {
    id: 'Search.Filters.Definitions.Number.lessThan',
    description: 'Label of filter type (less than)',
    defaultMessage: 'less than',
  },
  [FILTER_TYPES.moreThan]: {
    id: 'Search.Filters.Definitions.Number.moreThan',
    description: 'Label of filter type (less than)',
    defaultMessage: 'more than',
  },
  [FILTER_TYPES.equalTo]: {
    id: 'Search.Filters.Definitions.Number.equalTo',
    description: 'Label of filter type (equal to)',
    defaultMessage: 'equal to',
  },
  [FILTER_TYPES.range]: {
    id: 'Search.Filters.Definitions.Number.range',
    description: 'Label of filter type (range)',
    defaultMessage: 'between',
  },
});
export const filterTypeMissingMessages = defineMessages({
  // Filter type options
  [FILTER_TYPES.missing]: {
    id: 'Search.Filters.Definitions.missing',
    description: 'Label of filter type (missing)',
    defaultMessage: 'missing',
  },
  // Used for e.g. missing locales
  [FILTER_TYPES.missingIn]: {
    id: 'Search.Filters.Definitions.missingIn',
    description: 'Label of filter type (missing in)',
    defaultMessage: 'missing in',
  },
});

export const filterTypeReferenceMessages = defineMessages({
  // Filter type options
  [FILTER_TYPES.equalTo]: {
    id: 'Search.Filters.Definitions.Reference.equalTo',
    description: 'Label of filter type (equal to)',
    defaultMessage: 'of',
  },
});

export const filterTypeTextMessages = defineMessages({
  [FILTER_TYPES.equalTo]: {
    id: 'Search.Filters.Definitions.Text.equalTo',
    description: 'Label of filter type (equal to)',
    defaultMessage: 'is',
  },
});

export const filterTypeBooleanMessages = defineMessages({
  [FILTER_TYPES.equalTo]: {
    id: 'Search.Filters.Definitions.Boolean.equalTo',
    description: 'Label of filter type (equal to)',
    defaultMessage: 'is',
  },
});

export const filterTypeInMessages = defineMessages({
  [FILTER_TYPES.in]: {
    id: 'Search.Filters.Definitions.Text.in',
    description: 'Label of filter type (in)',
    defaultMessage: 'in',
  },
});

export function createDateDefinitionsMap(intl) {
  return {
    [FILTER_TYPES.lessThan]: {
      filterComponent: DateSingleFilter,
      tagComponent: DateSingleFilterTag,
      label: intl.formatMessage(filterTypeDateMessages.lessThan),
    },
    [FILTER_TYPES.moreThan]: {
      filterComponent: DateSingleFilter,
      tagComponent: DateSingleFilterTag,
      label: intl.formatMessage(filterTypeDateMessages.moreThan),
    },
    [FILTER_TYPES.equalTo]: {
      filterComponent: DateSingleFilter,
      tagComponent: DateSingleFilterTag,
      label: intl.formatMessage(filterTypeDateMessages.equalTo),
    },
    [FILTER_TYPES.range]: {
      filterComponent: DateRangeFilter,
      tagComponent: DateRangeFilterTag,
      validator: validateDate,
      label: intl.formatMessage(filterTypeDateMessages.range),
    },
  };
}

export function createNumberDefinitionsMap(intl, meta) {
  return {
    [FILTER_TYPES.lessThan]: {
      filterComponent: createNumberSingleFilter(meta),
      tagComponent: NumberSingleFilterTag,
      validator: filter => {
        const allowFloat = meta && meta.allowFloat === true;
        return validateNumber({ ...filter, allowFloat }, intl);
      },
      label: intl.formatMessage(filterTypeNumberMessages.lessThan),
    },
    [FILTER_TYPES.moreThan]: {
      filterComponent: createNumberSingleFilter(meta),
      tagComponent: NumberSingleFilterTag,
      validator: filter => {
        const allowFloat = meta && meta.allowFloat === true;
        return validateNumber({ ...filter, allowFloat }, intl);
      },
      label: intl.formatMessage(filterTypeNumberMessages.moreThan),
    },
    [FILTER_TYPES.equalTo]: {
      filterComponent: createNumberSingleFilter(meta),
      tagComponent: NumberSingleFilterTag,
      validator: filter => {
        const allowFloat = meta && meta.allowFloat === true;
        return validateNumber({ ...filter, allowFloat }, intl);
      },
      label: intl.formatMessage(filterTypeNumberMessages.equalTo),
    },
    [FILTER_TYPES.range]: {
      filterComponent: createNumberRangeFilter(meta),
      tagComponent: NumberRangeFilterTag,
      validator: validateNumber,
      label: intl.formatMessage(filterTypeNumberMessages.range),
    },
  };
}

export function createMissingDefinitionsMap(intl) {
  return {
    [FILTER_TYPES.missing]: {
      filterComponent: () => null,
      tagComponent: NoValueFilterTag,
      label: intl.formatMessage(filterTypeMissingMessages.missing),
      canBeAppliedMultipleTimes: false,
      // A missing value for the filter does not indicate that it is
      // empty (hence would be removed when)
      isEmptyFilter: () => false,
    },
  };
}

export function createMissingInDefinitionsMap(intl, meta) {
  return {
    [FILTER_TYPES.missingIn]: {
      filterComponent: createEnumSingleFilter(meta),
      tagComponent: EnumSingleFilterTag,
      label: intl.formatMessage(filterTypeMissingMessages.missingIn),
      canBeAppliedMultipleTimes: false,
      isEmptyFilter: () => false,
      validator: filter => validateSingleOptionEnum(filter, intl),
    },
  };
}

export function createReferenceDefinitionsMap(intl, meta) {
  switch (meta.type) {
    case 'category':
      return {
        [FILTER_TYPES.equalTo]: {
          filterComponent: createCategoryReferenceSingleFilter(meta, intl),
          tagComponent: CategoryReferenceFilterTag,
          label: intl.formatMessage(filterTypeReferenceMessages.equalTo),
        },
      };
    case 'customerGroup':
      return {
        [FILTER_TYPES.equalTo]: {
          filterComponent: createCustomerGroupReferenceSingleFilter(meta, intl),
          tagComponent: CustomerGroupReferenceFilterTag,
          canBeAppliedMultipleTimes: !meta.isMulti,
          label: intl.formatMessage(filterTypeReferenceMessages.equalTo),
        },
      };
    case 'state':
      return {
        [FILTER_TYPES.equalTo]: {
          filterComponent: createStateReferenceSingleFilter(meta, intl),
          tagComponent: createStateFilterTag(meta.stateType),
          canBeAppliedMultipleTimes: !meta.isMulti,
          label: intl.formatMessage(filterTypeReferenceMessages.equalTo),
        },
      };
    case 'store':
      return {
        [FILTER_TYPES.equalTo]: {
          filterComponent: createStoreReferenceSingleFilter(meta, intl),
          tagComponent: StoreReferenceFilterTag,
          canBeAppliedMultipleTimes: !meta.isMulti,
          label: '',
        },
      };
    case 'company':
      return {
        [FILTER_TYPES.equalTo]: {
          filterComponent: createCompanyReferenceSingleFilter(meta, intl),
          tagComponent: CompanyReferenceFilterTag,
          canBeAppliedMultipleTimes: false,
          label: intl.formatMessage(filterTypeReferenceMessages.equalTo),
        },
      };
    default:
      return null;
  }
}

export function createTextDefinitionsMap(intl, meta = { className: null }) {
  return {
    [FILTER_TYPES.equalTo]: {
      filterComponent: withProps(() => ({
        customClassName: meta.className,
      }))(TextSingleFilter),
      tagComponent: TextSingleFilterTag,
      label: intl.formatMessage(filterTypeTextMessages.equalTo),
      canBeAppliedMultipleTimes: false,
    },
  };
}

export function createTypesDefinitionsMap(intl, meta) {
  return {
    [FILTER_TYPES.in]: {
      filterComponent: createEnumSingleFilter({ ...meta, isMulti: true }),
      tagComponent: EnumSingleFilterTag,
      label: intl.formatMessage(filterTypeInMessages.in),
      canBeAppliedMultipleTimes: false,
      isEmptyFilter: () => false,
      validator: filter => validateMultiOptionEnum(filter, intl),
    },
    [FILTER_TYPES.equalTo]: {
      filterComponent: createEnumSingleFilter(meta),
      tagComponent: EnumSingleFilterTag,
      label: intl.formatMessage(filterTypeTextMessages.equalTo),
      canBeAppliedMultipleTimes: false,
      isEmptyFilter: () => false,
      validator: filter => validateSingleOptionEnum(filter, intl),
    },
  };
}
export function createSingleTypesDefinitionsMap(intl, meta) {
  return {
    [FILTER_TYPES.in]: {
      filterComponent: createEnumSingleFilter({ ...meta, isMulti: true }),
      tagComponent: EnumSingleFilterTag,
      label: intl.formatMessage(filterTypeInMessages.in),
      canBeAppliedMultipleTimes: false,
      isEmptyFilter: () => false,
      validator: filter => validateSingleOptionEnum(filter, intl),
    },
  };
}

export function createOptionsDefinitionsMap(intl, meta) {
  return {
    [FILTER_TYPES.in]: {
      filterComponent: createEnumSingleFilter({ ...meta, isMulti: true }),
      tagComponent: EnumSingleOptionFilterTag,
      label: intl.formatMessage(filterTypeInMessages.in),
      canBeAppliedMultipleTimes: false,
      isEmptyFilter: () => false,
      validator: filter => validateMultiOptionEnum(filter, intl),
    },
    [FILTER_TYPES.equalTo]: {
      filterComponent: createEnumSingleFilter(meta),
      tagComponent: EnumSingleOptionFilterTag,
      label: intl.formatMessage(filterTypeTextMessages.equalTo),
      canBeAppliedMultipleTimes: false,
      isEmptyFilter: () => false,
      validator: filter => validateSingleOptionEnum(filter, intl),
    },
  };
}

export function createBooleanDefinitionsMap(intl, meta) {
  return {
    [FILTER_TYPES.equalTo]: {
      filterComponent: createEnumSingleFilter(meta),
      tagComponent: EnumSingleFilterTag,
      label: intl.formatMessage(filterTypeTextMessages.equalTo),
      canBeAppliedMultipleTimes: false,
      isEmptyFilter: () => false,
      validator: filter => validateSingleOptionEnum(filter, intl),
    },
  };
}

export function createRoleFilterDefinitionsMap(intl, meta) {
  return {
    [FILTER_TYPES.in]: {
      filterComponent: createEnumSingleFilter({ ...meta, isMulti: true }),
      tagComponent: EnumSingleFilterTag,
      label: intl.formatMessage(filterTypeInMessages.in),
      canBeAppliedMultipleTimes: false,
      isEmptyFilter: () => false,
      validator: filter => validateMultiOptionEnum(filter, intl),
    },
  };
}

export function createCreatableOptionsDefinitionsMap(intl, meta) {
  return {
    [FILTER_TYPES.in]: {
      filterComponent: createCreatableEnumSingleFilter(meta),
      tagComponent: EnumSingleOptionFilterTag,
      label: intl.formatMessage(filterTypeInMessages.in),
      canBeAppliedMultipleTimes: true,
      isEmptyFilter: () => false,
      validator: filter => validateMultiOptionEnum(filter, intl),
    },
  };
}

export function createCustomFieldDefinitionsMap(intl, meta) {
  return {
    customField: {
      filterComponent: withProps(meta)(CustomFieldFilter),
      tagComponent: CustomFieldFilterTag,
      label: '',
      isEmptyFilter: () => false,
      canBeAppliedMultipleTimes: true,
      validator: filter => validateCustomField(filter, intl),
    },
  };
}
