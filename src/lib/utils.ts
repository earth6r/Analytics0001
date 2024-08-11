import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: this needs complete fixing to MM/DD/YYYY XX:XX AM/PM
export function convertDateString(dateString: string | null) {
  if (!dateString) {
    return null;
  }

  // Split the date string into parts
  const parts = dateString.split(', ');

  // Extract the date part
  // @ts-expect-error - fix this
  const datePart = parts[2].trim();

  // Split the date part into month name, day, and year with time
  const [, day, yearAndTime] = [parts[0], parts[1], datePart]

  // Extract the year part
  const year = yearAndTime.split(' ')[0];

  // Format the date as MM/DD/YYYY
  const formattedDate = `${day} ${year}`;

  return formattedDate;
}

export function formatTimestamp(timestampStr: string, threeDigits: boolean = true) {
  if (!timestampStr) {
    return null;
  }

  let date;
  if (threeDigits) {
    date = moment.utc(Number(timestampStr));
  } else {
    date = moment.utc(Number(timestampStr) * 1000);
  }

  // Use the browser's local timezone
  const localTimezone = moment.tz.guess();

  // Convert to local timezone
  date = date.tz(localTimezone);

  // Format components
  const dayOfWeek = date.format('dddd');
  const month = date.format('MMMM');
  const day = date.format('DD');
  const hours = date.format('h');
  const minutes = date.format('mm');
  const period = date.format('A');

  // Get timezone abbreviation
  const timezoneAbbreviation = date.format('z');

  return `${dayOfWeek}, ${month} ${day} ${hours}:${minutes} ${period} ${timezoneAbbreviation}`;
}
