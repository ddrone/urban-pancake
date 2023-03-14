import m from 'mithril';
import { Project, Update } from '../models/project';
import { TextInput } from './text_input';

export interface ProjectState {
  project: Project
}

export class ProjectEditor implements m.ClassComponent<ProjectState> {
  renderUpdate(update: Update): m.Child {
    if (update.content.kind === 'comment') {
      return update.content.comment;
    }
    // TODO: render other kinds of updates too
    return null;
  }

  view(vnode: m.Vnode<ProjectState>): m.Child {
    const project = vnode.attrs.project;
    return m('.card',
      m('h1', project.description),
      project.updates.length > 1 && m('.updates',
        m('h2', 'Last updates'),
        m('div', project.updates.slice(-3).reverse().map(update => this.renderUpdate(update)))
      ),
      m(TextInput, {
        buttonText: 'Add comment',
        onEntry(value) {
          project.updates.push({
            timestamp: Date.now(),
            content: {
              kind: 'comment',
              comment: value
            }
          })
        },
      })
    );
  }
}