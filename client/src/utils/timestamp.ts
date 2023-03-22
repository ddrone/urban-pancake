export interface RelativeDuration {
  level: number;
  readable: string;
}

const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
// These are all approximate, who cares though
const week = day * 7;
const month = day * 30;
const year = day * 356;

export const levelNames = [
  'Recent',
  'Minutes ago',
  'Hours ago',
  'Days ago',
  'Weeks ago',
  'Months ago',
  'Years ago'
];

export function relativeToNow(timestamp: number): RelativeDuration {
  const now = Date.now();
  return relativeDuration(now - timestamp);
}

export function isRecent(timestamp: number): boolean {
  return Date.now() - timestamp < week;
}

export function relativeDuration(delta: number): RelativeDuration {
  if (delta > year) {
    return {
      level: 6,
      readable: 'more than a year ago'
    }
  }
  if (delta > month) {
    const count = Math.floor(delta / month);
    return {
      level: 5,
      readable: count === 1 ? 'a month ago' : `${count} months ago`
    }
  }
  if (delta > week) {
    const count = Math.floor(delta / week);
    return {
      level: 4,
      readable: count === 1 ? 'a week ago' : `${count} weeks ago`
    }
  }
  if (delta > day) {
    const count = Math.floor(delta / day);
    return {
      level: 3,
      readable: count === 1 ? 'a day ago' : `${count} days ago`
    }
  }
  if (delta > hour) {
    const count = Math.floor(delta / hour);
    return {
      level: 2,
      readable: count === 1 ? 'an hour ago' : `${count} hours ago`
    }
  }
  if (delta > minute) {
    const count = Math.floor(delta / minute);
    return {
      level: 1,
      readable: count === 1 ? 'a minute ago' : `${count} minutes ago`
    }
  }
  return {
    level: 0,
    readable: 'within the last minute'
  }
}
