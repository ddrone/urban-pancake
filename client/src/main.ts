import './style.css'
import m from 'mithril';
import { ProjectEditor, ProjectState } from './components/project_editor';
import { TextInput } from './components/text_input';
import { createProject } from './models/project';

class Main implements m.ClassComponent {
  state: ProjectState[] = [];

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
      })
    )
  }
}

m.mount(document.querySelector('#app')!, Main);
