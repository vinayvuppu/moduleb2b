export default localizedString =>
  Object.keys(localizedString)
    .map(locale => `${locale} = "${localizedString[locale]}"`)
    .join(' and ');
