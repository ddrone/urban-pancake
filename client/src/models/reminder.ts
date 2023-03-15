import { num, record, str, Validated } from "../generic/validation";

export const reminder = record({
  text: str,
  timesShown: num,
});

export const shownReminder = record({
  index: num,
  timestamp: num,
});

export type Reminder = Validated<typeof reminder>;

export type ShownReminder = Validated<typeof shownReminder>;

function stillFresh(reminder: ShownReminder): boolean {
  const timestamp = Date.now();
  const delta = 1000 * 60 * 60 * 19; // ms -> seconds -> minutes -> hours -> 19 hours
  return reminder.timestamp + delta > timestamp;
}

export function currentReminder(reminders: Reminder[], lastReminder?: ShownReminder): ShownReminder|undefined {
  if (lastReminder !== undefined && stillFresh(lastReminder)) {
    return lastReminder;
  }

  if (reminders.length === 0) {
    return undefined;
  }

  const leastShownTimes = Math.min(...reminders.map(r => r.timesShown));
  const reminderId = reminders.findIndex(r => r.timesShown === leastShownTimes);
  if (reminderId === -1) {
    throw new Error('should not happen, there should at least one minimum in the array');
  }

  reminders[reminderId].timesShown++;
  return {
    index: reminderId,
    timestamp: Date.now()
  }
}
