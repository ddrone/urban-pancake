import './style.css'
import { Counter } from './counter'
import m from 'mithril';

class Main implements m.ClassComponent {
  view(): m.Child {
    return m('div',
      m('h1', 'Project template'),
      m('.card',
        m(Counter)
      )
    )
  }
}

m.mount(document.querySelector('#app')!, Main);
