import './style.css'
import m from 'mithril';
import { ProjectEditor, ProjectState } from './components/project_editor';
import { TextInput } from './components/text_input';
import { createProject } from './models/project';
import { AppState, loadState, saveState } from './persistence';
import { Button } from './components/button';
import { Widgets } from './gallery';

class Main implements m.ClassComponent {
  projects: ProjectState[] = [];
  newReminders: string[] = [];

  constructor() {
    const state = loadState();
    if (state !== undefined) {
      for (const project of state.projects) {
        this.projects.push({
          project
        })
      }
    }
  }

  view(): m.Child {
    return m('div',
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
        }
      }),
      m(Button, {
        onclick: () => {
          const state: AppState = {
            projects: [],
            reminders: [],
            lastReminder: undefined
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
