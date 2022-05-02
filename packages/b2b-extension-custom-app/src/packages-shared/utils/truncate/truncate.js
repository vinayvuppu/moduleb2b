const DEFAULT_LENGTH = 50;
const DEFAULT_END = '...';

export default function(text, length = DEFAULT_LENGTH, end = DEFAULT_END) {
  if (!text) return '';
  if (text.length < length) return text;

  return `${text.substring(0, length)}${end}`;
}
