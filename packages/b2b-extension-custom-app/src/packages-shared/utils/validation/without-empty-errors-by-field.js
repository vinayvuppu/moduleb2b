import omitEmpty from 'omit-empty-es';

const withoutEmptyErrorsByField = errorsByField => omitEmpty(errorsByField);

export default withoutEmptyErrorsByField;
