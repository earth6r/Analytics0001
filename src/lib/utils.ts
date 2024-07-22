import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
    date = new Date(Number(timestampStr));
  } else {
    date = new Date(Number(timestampStr) * 1000);
  }

  // Convert date to UTC and format components
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' });
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const day = date.toLocaleString('en-US', { day: '2-digit', timeZone: 'UTC' });
  const hours = date.toLocaleString('en-US', { hour: 'numeric', hour12: true, timeZone: 'UTC' }).split(' ')[0];
  const minutes = date.toLocaleString('en-US', { minute: '2-digit', timeZone: 'UTC' }).padStart(2, '0');
  const period = date.toLocaleString('en-US', { hour: 'numeric', hour12: true, timeZone: 'UTC' }).split(' ')[1];

  return `${dayOfWeek}, ${month} ${day} ${hours}:${minutes} ${period} UTC`;
}
