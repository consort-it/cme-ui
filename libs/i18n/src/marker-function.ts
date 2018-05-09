/**
 * This function does nothing. It is a marker function for the ngx-translate-extract programm, because the
 * included function in the ngx-translate-extract package does not work.
 * See https://github.com/biesbjerg/ngx-translate-extract#mark-strings-for-extraction-using-a-marker-function
 *
 *
 */
export function _(key: string): string {
  return key;
}
