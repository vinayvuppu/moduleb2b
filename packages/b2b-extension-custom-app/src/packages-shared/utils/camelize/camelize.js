// Like `strcpy` but uglier.
export default function camelize(str) {
  const result = [];
  let i;
  let j;

  for (i = 0, j = str.length; i < j; i += 1)
    if (str[i] === '-') {
      result.push(str[i + 1].toUpperCase());
      i += 1;
    } else result.push(str[i]);

  return result.join('');
}
