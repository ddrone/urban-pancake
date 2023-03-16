import './style.css'
import m from 'mithril';
import { ProjectEditor, ProjectState } from './components/project_editor';
import { TextInput } from './components/text_input';
import { createProject } from './models/project';
import { AppState, loadState, saveState } from './persistence';
import { Button } from './components/button';
import { Widgets } from './gallery';
import { currentReminder, Reminder, ShownReminder } from './models/reminder';
import { comparing } from './utils/sorting';
import { levelNames, relativeDuration, RelativeDuration } from './utils/timestamp';
import { groupBy } from './utils/group';

interface FlatComment {
  projectIndex: number;
  comment: string;
  timestamp: RelativeDuration;
  absTimestamp: number;
}

class Main implements m.ClassComponent {
  projects: ProjectState[] = [];
  reminders: Reminder[] = [];
  currentReminder?: ShownReminder;
  newReminders: string[] = [];
  flatComments: Map<number, FlatComment[]> = new Map();

  constructor() {
    const state = loadState();
    if (state !== undefined) {
      state.projects.sort(comparing(p => p.lastUpdated));
      const comments: FlatComment[] = [];
      const now = Date.now();
      for (let i = 0; i < state.projects.length; i++) {
        const project = state.projects[i];
        this.projects.push({
          project
        })
        for (const update of project.updates) {
          if (update.content.kind === "comment") {
            comments.push({
              projectIndex: i,
              comment: update.content.comment,
              timestamp: relativeDuration(now - update.timestamp),
              absTimestamp: update.timestamp
            });
          }
        }
      }
      comments.sort(comparing(fc => -fc.absTimestamp));
      console.log(comments);
      this.flatComments = groupBy(comments, fc => fc.timestamp.level);
      this.reminders = state.reminders;
      this.currentReminder = currentReminder(this.reminders, state.lastReminder);
      console.log(this.currentReminder);
    }
  }

  serializeState(): AppState {
    const state: AppState = {
      projects: [],
      reminders: this.reminders,
      lastReminder: this.currentReminder
    }

    for (const p of this.projects) {
      state.projects.push(p.project);
    }

    return state;
  }

  view(): m.Children {
    return [
      m('.column',
        this.currentReminder !== undefined && [
          m('h1', 'Daily reminder'),
          m('.card.big',
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
            saveState(this.serializeState());
          }
        }, 'Save state')
      ),
      m('.column',
        this.flatComments.size > 0 && [
          m('h1', 'Last updates'),
          Array.from(this.flatComments.entries()).map(([group, comments]) =>
            m('div',
              m('h2', levelNames[group]),
              m('ul',
                comments.map(fc => m('li',
                  fc.comment,
                  ' [',
                  fc.timestamp.readable,
                  ', ',
                  m('i', this.projects[fc.projectIndex].project.description),
                  ']',
                ))
              )
            ))
        ],
      )
    ]
  }
}

m.route(document.querySelector('#app')!, "/main", {
  "/main": Main,
  "/widgets": Widgets,
});
