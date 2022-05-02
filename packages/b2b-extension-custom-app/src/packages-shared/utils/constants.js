export const PRODUCT_STATUSES = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
  MODIFIED: 'modified',
};

export const FILTER_TYPES = {
  lessThan: 'lessThan',
  moreThan: 'moreThan',
  equalTo: 'equalTo',
  range: 'range',
  missing: 'missing',
  missingIn: 'missingIn',
  in: 'in',
};

export const FIELD_TYPES = {
  Money: 'Money',
  LocalizedString: 'LocalizedString',
  Time: 'Time',
  DateTime: 'DateTime',
  Boolean: 'Boolean',
  String: 'String',
  Enum: 'Enum',
  LocalizedEnum: 'LocalizedEnum',
  Number: 'Number',
  Date: 'Date',
  Reference: 'Reference',
  Set: 'Set',
};

export const PRECISION_TYPES = {
  highPrecision: 'highPrecision',
  centPrecision: 'centPrecision',
};

export const DefaultPageSizes = [20, 50, 100];
export const DefaultPageSize = DefaultPageSizes[0];
