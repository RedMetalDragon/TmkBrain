/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DateTime } from 'luxon';
import moment from "moment-timezone";
import { SchedulesController } from '../controllers';

export function getTimeZone(): string {
  return moment.tz.guess();

  // To display in local timezone
  // console.log(`Time in: ${timeInOut!.dataValues.time_in.toLocaleString('en-US', {timeZone: getTimeZone()})}`);
}

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

export function getCurrentDateTime(): string {
  // Create a new Date object
  const currentDate = new Date();

  // Get the current date and time components
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  // Format the date and time as needed
  const formattedDateTime = year + "-" + 
                          (month < 10 ? "0" + month : month) + "-" + 
                          (day < 10 ? "0" + day : day) + " " + 
                          (hours < 10 ? "0" + hours : hours) + ":" + 
                          (minutes < 10 ? "0" + minutes : minutes) + ":" + 
                          (seconds < 10 ? "0" + seconds : seconds);

  return formattedDateTime;
};

export function getCurrentDate(days = 0): string {
  // Create a new Date object
  const currentDate = new Date();

  // Subtract the specified number of days
  currentDate.setDate(currentDate.getDate() - days);

  // Extract individual components of the date
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1
  const day = String(currentDate.getDate()).padStart(2, '0');

  // Format the date as desired
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

export async function getTimeInAndOut(date: string, employee_id: number): Promise<Record<string, any>> {
  // Get earliest and latest log for the day
  const timeInOut = await SchedulesController.getTimeInAndOut(date, employee_id);

  const time_in = timeInOut!.dataValues.time_in;
  const time_out = timeInOut!.dataValues.time_out;

  let absent = false;
  let incomplete_log = false;

  // no logs => isAbsent - true 
  if(time_in === null && time_out === null) {
      absent = true; 
  }
  // 1 log => isIncompleteLog - true
  else if ((time_in === null && time_out !== null) || (time_in !== null && time_out === null)) {
      incomplete_log = true;
  }

  return {
      time_in,
      time_out,
      absent,
      incomplete_log,
  };
}

export async function getTimeInAndOutNightShift(yesterday: string, currentDate: string, employee_id: number): Promise<Record<string, any>> {
  // Get earliest log from yesterday
  const timeInOutYesterday = await SchedulesController.getTimeInAndOut(yesterday, employee_id);

  // Get latest log today
  const timeInOutToday = await SchedulesController.getTimeInAndOut(currentDate, employee_id);

  const time_in = timeInOutYesterday!.dataValues.time_in;
  const time_out = timeInOutToday!.dataValues.time_out;

  let absent = false;
  let incomplete_log = false;

  // no logs => isAbsent - true 
  if(time_in === null && time_out === null) {
      absent = true; 
  }
  // 1 log => isIncompleteLog - true
  else if ((time_in === null && time_out !== null) || (time_in !== null && time_out === null)) {
      incomplete_log = true;
  }

  return {
      time_in,
      time_out,
      absent,
      incomplete_log,
  };
};

export function hoursDifference(timeout: any, timein:  any): number {
  const timeDifference = timeout - timein;
  const totalMinutesDifference = timeDifference / (1000 * 60);
  const hoursDifference = (totalMinutesDifference / 60).toFixed(2);

  return Number(hoursDifference);
};

export function getScheduledTimeIn(date: string, timein: string): Date {
  // Parse the timestamp string into a Date object
  const dateObj = new Date(date);

  // Set the time part from timein
  const [hours, minutes, seconds] = timein.split(':').map(Number);

  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);
  dateObj.setSeconds(seconds);

  // Convert the updated Date object back to a string
  const updatedTimestamp = dateObj;

  return updatedTimestamp;
}

export function isWeekend(date: string): boolean {
  const currentDate = new Date(date);
  const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  return dayOfWeek === 0 || dayOfWeek === 6; // Saturday or Sunday
}