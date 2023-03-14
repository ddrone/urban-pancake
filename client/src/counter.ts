import m from 'mithril';

export class Counter implements m.ClassComponent {
  counter = 0;

  view(): m.Child {
    return m('button', {
      onclick: () => {
        this.counter++;
      }
    }, this.counter);
  }
}

