export function formatVariantsString(item, options = {}) {
  const { label = false } = options;
  let valueString = '';
  for (const [key, value] of Object.entries(item)) {
    valueString = (label ? key + ': ' : '') + valueString + `${value}, `; //${key}:
  }
  return valueString.substring(0, valueString.length - 2); //- 2);
}
