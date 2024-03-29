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
import { platform } from './platform/platform';
import { Repl } from './language/repl';
import { Playground } from './playground';

interface FlatComment {
  projectIndex: number;
  comment: string;
  timestamp: RelativeDuration;
  absTimestamp: number;
}

type RightTab = 'updates' | 'reminders';

class Main implements m.ClassComponent {
  projects: ProjectState[] = [];
  reminders: Reminder[] = [];
  currentReminder?: ShownReminder;
  newReminders: string[] = [];
  flatComments: Map<number, FlatComment[]> = new Map();
  showHistory = false;
  rightTab: RightTab = 'updates';

  constructor() {
    loadState().then(state => {
      if (state !== undefined) {
        state.projects.sort(comparing(p => p.lastUpdated));
        const comments: FlatComment[] = [];
        const now = Date.now();
        for (let i = 0; i < state.projects.length; i++) {
          const project = state.projects[i];
          // TODO: the next line is a useful fixup for the data model to ensure that the updated timestamp
          // is actually the last one. Maybe I should do something to avoid having to do that.
          project.lastUpdated = Math.max(project.lastUpdated, ...project.updates.map(u => u.timestamp));
          if (project.status === undefined) {
            project.status = 'active';
          }
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
        m.redraw();
      }
    });

    platform.onClose(() => {
      saveState(this.serializeState());
    });
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
    const activeProjects = this.projects.filter(p => p.project.status === 'active');
    const inactiveProjects = this.projects.filter(p => p.project.status === 'inactive');
    const doneProjects = this.projects.filter(p => p.project.status === 'done');
    return [
      m('.column',
        this.currentReminder !== undefined && [
          m('h1', 'Daily reminder'),
          m('.card.big',
            this.reminders[this.currentReminder.index].text
          )
        ],
        activeProjects.length > 0 && [
          m('h1', 'My projects'),
          activeProjects.map(project => m(ProjectEditor, project)),
        ],
        m(Button, {
          onclick: () => {
            this.showHistory = !this.showHistory;
          }
        }, this.showHistory ? 'Hide history' : 'Show history'),
        this.showHistory && [
          doneProjects.length > 0 && [
            m('h1', 'Recently done'),
            doneProjects.map(project => m(ProjectEditor, project))
          ],
          inactiveProjects.length > 0 && [
            m('h1', 'Inactive projects'),
            inactiveProjects.map(project => m(ProjectEditor, project))
          ],
        ],
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
            const state = this.serializeState();
            saveState(state);
          }
        }, 'Save state'),
      ),
      m('.column',
        m(Button, {
          onclick: () => {
            this.rightTab = 'updates';
          },
          disabled: this.rightTab === 'updates'
        }, 'Last updates'),
        m(Button, {
          onclick: () => {
            this.rightTab = 'reminders';
          },
          disabled: this.rightTab === 'reminders'
        }, 'Reminders'),
        this.rightTab === 'updates' && [
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
          this.flatComments.size === 0 && m('h1', 'No updates yet!'),
        ],
        this.rightTab === 'reminders' && [
          this.reminders.length > 0 && [
            m('h1', 'Reminders'),
            m('ul',
              this.reminders.map(rem => m('li', [
                rem.text,
                ` (shown ${rem.timesShown} times)`
              ])))
          ],
          this.reminders.length === 0 && m('h1', 'No reminders yet!')
        ]
      )
    ]
  }
}

m.route(document.querySelector('#app')!, "/main", {
  "/main": Main,
  "/widgets": Widgets,
  "/repl": Repl,
  "/play": Playground,
});
