import './style.css'
import m from 'mithril';
import { ProjectEditor, ProjectState } from './components/project_editor';
import { createProject } from './models/project';

class Main implements m.ClassComponent {
  state: ProjectState = {
    project: createProject('Test project')
  }

  view(): m.Child {
    return m('div',
      m('h1', 'Project template'),
      m(ProjectEditor, this.state),
    )
  }
}

m.mount(document.querySelector('#app')!, Main);
