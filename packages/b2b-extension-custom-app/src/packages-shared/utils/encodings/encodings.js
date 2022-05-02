// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa#Unicode_strings
//
// Escape any extended characters so that the string we
// actually encode is an ASCII representation of the original.
// This is to avoid the `InvalidCharacterError`.
export function stringToBase64(value) {
  let encoded;
  try {
    encoded = btoa(unescape(encodeURIComponent(value)));
  } catch (e) {
    /* noop */
  }
  return encoded;
}

export function base64ToString(value) {
  let decoded;
  try {
    decoded = decodeURIComponent(escape(atob(value)));
  } catch (e) {
    /* noop */
  }
  return decoded;
}
