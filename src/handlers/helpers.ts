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

export function getWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek); // Set start date to Sunday of the current week

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const formattedDate = date.toISOString().slice(0,10); // Format as yyyy-MM-dd
    dates.push(formattedDate);
  }

  return dates;

}

export function getMonthDates(): string[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const endDate = new Date(year, month + 1, 0);

  const dates: string[] = [];
  for (let i = 1; i <= endDate.getDate(); i++) {
    const date = new Date(year, month, i);
    const formattedDate = date.toISOString().slice(0,10); // Format as yyyy-MM-dd
    dates.push(formattedDate);
  }

  return dates;
} 

export function getWeekdaysOfMonth(): string[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const weekdays: string[] = [];
  for (let i = 0; i < endDate.getDate(); i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek >= 2 && dayOfWeek <= 6) { // Monday to Friday
      const formattedDate = date.toISOString().slice(0,10); // Format as yyyy-MM-dd
      weekdays.push(formattedDate);
    }
  }

  return weekdays;
}

export function getWeekdays(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = new Date(today);
  
  // Adjust startDate to the previous Sunday
  startDate.setDate(today.getDate() - dayOfWeek);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dayOfWeek = date.getDay();
    // Only include weekdays (Monday to Friday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const formattedDate = date.toISOString().slice(0,10); // Format as yyyy-MM-dd
      dates.push(formattedDate);
    }
  }

  return dates;
}