export function normalizeServiceName(tagName: string): string {
  const result = /(.*?)(\-v\d+)$/.exec(tagName);

  if (result === null) {
    // tagName has no '-v1' or similar at the end
    return tagName;
  }

  return result[1]; // the first matching group (everything before '-v1')
}
