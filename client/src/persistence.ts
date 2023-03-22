import { array, optional, record, Validated } from "./generic/validation";
import { projectModel } from "./models/project";
import { shownReminder, reminder } from "./models/reminder";
import { platform } from "./platform/platform";

const appState = record({
  projects: array(projectModel),
  reminders: array(reminder),
  lastReminder: optional(shownReminder),
});

export type AppState = Validated<typeof appState>;

export function saveState(state: AppState) {
  platform.saveState(JSON.stringify(state));
}

export function loadState(): AppState|undefined {
  const unparsed = platform.loadState();
  if (unparsed === undefined) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(unparsed);
    if (appState.validate(parsed)) {
      return parsed;
    }
  } catch {
    // Nothing to do, just JSON parsing has failed
  }

  return undefined;
}
