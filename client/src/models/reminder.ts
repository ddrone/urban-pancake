import { num, record, str, Validated } from "../generic/validation";

export const reminder = record({
  text: str,
  timesShown: num,
});

export type Reminder = Validated<typeof reminder>;
