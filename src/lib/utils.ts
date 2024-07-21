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

export function formatTimestamp(timestampStr, threeDigits = true) {
  if (!timestampStr) {
    return null;
  }

  let date;
  if (threeDigits) {
    date = new Date(Number(timestampStr));
  } else {
    date = new Date(Number(timestampStr) * 1000);
  }

  // Convert date to EST timezone
  const estOffset = -5 * 60 * 60 * 1000; // EST offset in milliseconds
  const estDate = new Date(date.getTime() + estOffset);
  const options = {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  };

  // Format date
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(estDate);

  // Add EST timezone to the formatted date
  return formattedDate.replace('AM', 'AM EST').replace('PM', 'PM EST');
}
