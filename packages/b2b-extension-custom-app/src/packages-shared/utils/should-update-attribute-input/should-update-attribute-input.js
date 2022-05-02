import { deepEqual } from 'fast-equals';

export default function shouldUpdateAttributeInput({
  currentProps,
  currentState,
  nextProps,
  nextState,
}) {
  const hasLangChanged =
    currentProps.selectedLanguage !== nextProps.selectedLanguage;
  const hasNameChanged =
    currentProps.attribute.name !== nextProps.attribute.name;
  const hasValueChanged = !deepEqual(
    currentProps.attribute.value,
    nextProps.attribute.value
  );
  const hasStateChanged = !deepEqual(currentState, nextState);
  const hasTypeChanged = !deepEqual(
    currentProps.definition.type,
    nextProps.definition.type
  );

  const havePropsOrStateChanged =
    hasLangChanged ||
    hasNameChanged ||
    hasValueChanged ||
    hasStateChanged ||
    hasTypeChanged;

  if (currentProps.expandSettings) {
    const haveSettingsChanged = !deepEqual(
      currentProps.expandSettings,
      nextProps.expandSettings
    );
    return havePropsOrStateChanged || haveSettingsChanged;
  }

  return havePropsOrStateChanged;
}
