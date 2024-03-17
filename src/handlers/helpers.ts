import { DateTime } from 'luxon';

/* eslint-disable-next-line */
export function isNumeric(input: any): boolean {
  return !isNaN(parseFloat(input)) && isFinite(input);
}

export function validateUniqueDates(dateStrings: Array<string>): boolean {
  const uniqueDates = new Set();
  for (const dateString of dateStrings) {
      if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(dateString) || !isValidDate(dateString)) {
          return false; // Invalid date format or invalid date
      }

      const formattedDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd').toISODate();
      if (uniqueDates.has(formattedDate)) {
          return false; // Not unique
      }
      uniqueDates.add(formattedDate);
  }
  return true;
}

export function isValidDate(dateString: string): boolean {
  const dateObj = DateTime.fromFormat(dateString, 'yyyy-MM-dd', { zone: 'utc' });
  return dateObj.isValid;
}

export function findDuplicates(array1: Array<string>, array2: Array<string>): Array<string> {
  const set = new Set(array2);
  const duplicates: string[] = [];

  for (let i = 0; i < array1.length; i++) {
      if (set.has(array1[i])) {
          duplicates.push(array1[i]);
      }
  }

  return duplicates.sort();
}