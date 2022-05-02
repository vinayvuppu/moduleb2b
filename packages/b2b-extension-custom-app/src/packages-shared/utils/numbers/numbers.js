const formats = {
  en: [',', '.'],
  de: ['.', ','],
  it: ['.', ','],
  ru: [' ', ','],
  zh: [',', '.'],
};

export function getSeparatorsForLocale(locale) {
  const country = locale.split('-')[0];
  // Fall back to "en" if country is not mapped.
  // NOTE: this is a temporary workaround until we refactor the `locale`
  // to properly use "language + region" and therefore using `intl`
  // to format numbers.
  const countryFormat = formats[country.toLowerCase()] || formats.en;
  const [thoSeparator, decSeparator] = countryFormat;

  return {
    thoSeparator,
    decSeparator,
  };
}

// Given a string, validates that it has the correct format
// to be a number, with decimal separators and negative sign.
export function isNumberish(number) {
  return !/[^(\-?)\d,.\s]/.test(number);
}

export function isInteger(value) {
  return /^-{0,1}\d*$/.test(value);
}
