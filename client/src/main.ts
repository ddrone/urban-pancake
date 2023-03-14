import './style.css'
import m from 'mithril';
import { ProjectEditor, ProjectState } from './components/project_editor';
import { TextInput } from './components/text_input';
import { createProject } from './models/project';
import { AppState, loadState, saveState } from './persistence';
import { Button } from './components/button';

class Main implements m.ClassComponent {
  state: ProjectState[] = [];

  constructor() {
    const state = loadState();
    if (state !== undefined) {
      for (const project of state.projects) {
        this.state.push({
          project
        })
      }
    }
  }

  view(): m.Child {
    return m('div',
      m('h1', 'My projects'),
      this.state.map(project => m(ProjectEditor, project)),
      m(TextInput, {
        buttonText: 'Add project',
        onEntry: (value) => {
          this.state.push({
            project: createProject(value)
          });
        },
      }),
      m(Button, {
        onclick: () => {
          const state: AppState = {
            projects: []
          }

          for (const p of this.state) {
            state.projects.push(p.project);
          }

          saveState(state);
        }
      }, 'Save state')
    )
  }
}

m.mount(document.querySelector('#app')!, Main);
