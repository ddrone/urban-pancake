import m from 'mithril';
import { Project, Update } from '../models/project';
import { relativeToNow } from '../utils/timestamp';
import { TextInput } from './text_input';

export interface ProjectState {
  project: Project
}

export class ProjectEditor implements m.ClassComponent<ProjectState> {
  renderTimestamp(ts: number): m.Child {
    return m('span.small', relativeToNow(ts).readable);
  }

  renderUpdate(update: Update): m.Child {
    const content = update.content;
    switch (content.kind) {
      case 'comment':
        return m('.comment', content.comment, ' ', this.renderTimestamp(update.timestamp));
      case 'created':
        return m('.small', 'Project created ', this.renderTimestamp(update.timestamp));
      case 'update': {
        if (content.description !== undefined) {
          let text = `Changed description to '${content.description}'`;
          if (content.isActive !== undefined) {
            text += ` and made ${content.isActive ? 'active' : 'inactive'}`;
          }
          return m('.small', text);
        }

        if (content.isActive !== undefined) {
          return m('.small', content.isActive ? 'Made active' : 'Made inactive');
        }

        // TODO: shouldn't be there
        return null;
      }
    }
  }

  view(vnode: m.Vnode<ProjectState>): m.Child {
    const project = vnode.attrs.project;
    return m('.card',
      m('.card-header',
        m('.header-update', this.renderTimestamp(project.lastUpdated)),
        m('h1', project.description),
      ),
      project.updates.length > 1 && m('.updates',
        m('div', project.updates.slice(-3).reverse().map(update => this.renderUpdate(update)))
      ),
      m(TextInput, {
        buttonText: 'Add comment',
        onEntry(value) {
          const ts = Date.now();
          project.lastUpdated = ts;
          project.updates.push({
            timestamp: ts,
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