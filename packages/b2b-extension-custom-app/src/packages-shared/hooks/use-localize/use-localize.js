import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import localize from '../../utils/localize';

/**
 * @returns function with the following parameters
 * - {LocalizedStrings} localizedStrings - an array of graphql LocalizedString,
 * with [{ locale: 'en', value: 'Hello' }] form. This corresponds to graphql
 * *AllLocales fields.
 * - {string} fallback - fallback value when localizedStrings were not
 * provided or empty
 */
export default () => {
  const applicationContext = useApplicationContext(context => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project.languages,
  }));

  return (localizedStrings, fallback) => {
    // transform the array to an object as expected by the localize utility
    const localizedStringsAsObject =
      localizedStrings?.reduce(
        (updatedLocalizedString, field) => ({
          ...updatedLocalizedString,
          [field.locale]: field.value,
        }),
        {}
      ) || {};

    return localize({
      obj: {
        field: localizedStringsAsObject,
      },
      key: 'field',
      language: applicationContext.dataLocale,
      fallback,
      fallbackOrder: applicationContext.projectLanguages,
    });
  };
};
