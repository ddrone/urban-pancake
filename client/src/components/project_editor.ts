import m from 'mithril';
import { Project, Status, Update } from '../models/project';
import { relativeToNow } from '../utils/timestamp';
import { Button } from './button';
import { TextInput } from './text_input';
import { platform } from '../platform/platform';

export interface ProjectState {
  project: Project
}

export class ProjectEditor implements m.ClassComponent<ProjectState> {
  seeAllUpdates = false;

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
          if (content.status !== undefined) {
            text += ` and status to ${content.status}`;
          }
          return m('.small', text);
        }

        if (content.status !== undefined) {
          return m('.small', `Changed status to ${content.status}`);
        }

        // TODO: shouldn't be there
        return null;
      }
    }
  }

  renderUpdates(updates: Update[]): m.Child {
    const shownUpdates = this.seeAllUpdates ? updates.slice() : updates.slice(-3)
    return m('.updates',
      m('div', shownUpdates.reverse().map(update => this.renderUpdate(update))),
      updates.length > 3 && !this.seeAllUpdates &&
        m('button', {
          onclick: () => {
            this.seeAllUpdates = true;
          }
        }, 'Show all updates'),
      this.seeAllUpdates &&
        m('button', {
          onclick: () => {
            this.seeAllUpdates = false;
          }
        }, 'Recent updates only')
    );
  }

  setStatus(project: Project, status: Status) {
    const ts = Date.now();
    project.lastUpdated = ts;
    project.status = status,
    project.updates.push({
      timestamp: Date.now(),
      content: {
        kind: 'update',
        status: status,
        description: undefined,
      }
    });
  }

  renderDescription(project: Project): m.Child {
    return m('h1',
      project.associatedFile === undefined ?
        project.description :
        m('a', {
          onclick: () => {
            console.log(`Should open file ${project.associatedFile}`);
          }
        }, project.description)
    );
  }

  view(vnode: m.Vnode<ProjectState>): m.Child {
    const project = vnode.attrs.project;
    return m(`.card.${project.status}`,
      m('.card-header',
        m('.header-update', this.renderTimestamp(project.lastUpdated)),
        this.renderDescription(project),
      ),
      project.updates.length > 1 && this.renderUpdates(project.updates),
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
      }),
      project.status !== 'done' &&
        m(Button, {
          onclick: () => {
            this.setStatus(project, 'done')
          },
        }, 'Mark as done'),
      project.status === 'active' &&
        m(Button, {
          onclick: () => {
            this.setStatus(project, 'inactive')
          }
        }, 'Mark as inactive'),
      project.status === 'inactive' &&
        m(Button, {
          onclick: () => {
            this.setStatus(project, 'active')
          }
        }, 'Mark as active'),
      project.associatedFile === undefined && m('button', {
        onclick: async () => {
          const name = await platform.openFileDialog();
          if (name !== undefined) {
            project.associatedFile = name;
            m.redraw();
          }
        }
      }, 'Associate file')
    );
  }
}