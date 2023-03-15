import m from 'mithril';
import { TextInput } from './components/text_input';

export class Widgets implements m.ClassComponent {
  view(): m.Child {
    return m('div',
      m('h2', 'TextInput'),
      m(TextInputShowcase),
    )
  }
}

class TextInputShowcase implements m.ClassComponent {
  lastEntry?: string;

  view(): m.Child {
    return m('div',
      m(TextInput, {
        buttonText: 'Enter',
        onEntry: (value) => {
          this.lastEntry = value
        }
      }),
      this.lastEntry !== undefined && m('div',
        'Last entered text: ',
        this.lastEntry
      )
    );
  }
}
