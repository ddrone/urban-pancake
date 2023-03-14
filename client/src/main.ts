import './style.css'
import m from 'mithril';
import { ProjectEditor, ProjectState } from './components/project_editor';

class Main implements m.ClassComponent {
  state: ProjectState = {
    // TODO: create a function to initialize consistent project
    project: {
      description: 'Test project',
      isActive: true,
      lastUpdated: Date.now(),
      updates: []
    }
  }

  view(): m.Child {
    return m('div',
      m('h1', 'Project template'),
      m(ProjectEditor, this.state),
    )
  }
}

m.mount(document.querySelector('#app')!, Main);
