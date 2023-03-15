import './style.css'
import m from 'mithril';
import { ProjectEditor, ProjectState } from './components/project_editor';
import { TextInput } from './components/text_input';
import { createProject } from './models/project';
import { AppState, loadState, saveState } from './persistence';
import { Button } from './components/button';
import { Widgets } from './gallery';
import { currentReminder, Reminder, ShownReminder } from './models/reminder';

class Main implements m.ClassComponent {
  projects: ProjectState[] = [];
  reminders: Reminder[] = [];
  currentReminder?: ShownReminder;
  newReminders: string[] = [];

  constructor() {
    const state = loadState();
    if (state !== undefined) {
      for (const project of state.projects) {
        this.projects.push({
          project
        })
      }
      this.reminders = state.reminders;
      this.currentReminder = currentReminder(this.reminders, state.lastReminder);
      console.log(this.currentReminder);
    }
  }

  view(): m.Child {
    return m('div',
      this.currentReminder !== undefined && [
        m('h1', 'Daily reminder'),
        m('.card',
          this.reminders[this.currentReminder.index].text
        )
      ],
      m('h1', 'My projects'),
      this.projects.map(project => m(ProjectEditor, project)),
      m(TextInput, {
        buttonText: 'Add project',
        onEntry: (value) => {
          this.projects.push({
            project: createProject(value)
          });
        },
      }),
      this.newReminders.length > 0 && [
        m('h1', 'New reminders'),
        this.newReminders.map(reminder => m('.card', reminder)),
      ],
      m(TextInput, {
        buttonText: 'Add reminder',
        onEntry: (value) => {
          this.newReminders.push(value);
          this.reminders.push({
            text: value,
            timesShown: 0
          });
        }
      }),
      m(Button, {
        onclick: () => {
          const state: AppState = {
            projects: [],
            reminders: this.reminders,
            lastReminder: this.currentReminder
          }

          for (const p of this.projects) {
            state.projects.push(p.project);
          }

          saveState(state);
        }
      }, 'Save state')
    )
  }
}

m.route(document.querySelector('#app')!, "/main", {
  "/main": Main,
  "/widgets": Widgets,
});
