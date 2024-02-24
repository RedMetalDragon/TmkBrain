/* eslint-disable-next-line */
export function isNumeric(input: any): boolean {
    return !isNaN(parseFloat(input)) && isFinite(input);
  }