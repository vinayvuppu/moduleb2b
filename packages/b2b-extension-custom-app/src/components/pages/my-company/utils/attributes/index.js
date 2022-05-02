// eslint-disable-next-line
export const getAttributeValueByType = (value, type, dataLocale) => {
  switch (type) {
    case 'text':
      return { value, label: value };
    case 'enum':
      return { value: value.key, label: value.label };
    case 'lenum':
      return { value: value.key, label: value.label[dataLocale] };
    default:
      return { value: value.key, label: value.label };
  }
};
