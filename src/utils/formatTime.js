import { format, getTime, formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
}

export function fDateTimeWithTimezone(date) {
  const timezone = 'Etc/UTC';
  const zonelessDate = new Date(date);
  const localDate = utcToZonedTime(zonelessDate, timezone);

  return format(localDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
