const transformToProperNounCase = text =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const transformAllToProperNounCase = text =>
  text
    .split(' ')
    .map(term => transformToProperNounCase(term))
    .join(' ');

export { transformToProperNounCase, transformAllToProperNounCase };
