import m from 'mithril';
import { Button } from './components/button';
import { Checkbox } from './components/checkbox';
import { TextInput } from './components/text_input';
import { Box } from './utils/box';

export class Widgets implements m.ClassComponent {
  view(): m.Child {
    return m('div',
      m('h2', 'TextInput'),
      m(TextInputShowcase),
      m('h2', 'Checkbox'),
      m(CheckboxShowcase),
      m('h2', 'Button'),
      m(ButtonShowcase),
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

class CheckboxShowcase implements m.ClassComponent {
  checked = new Box(false);

  view(): m.Child {
    return m(Checkbox, {
      checked: this.checked,
    }, this.checked.value ? 'Checked checkbox' : 'Unchecked checkbox');
  }
}

class ButtonShowcase implements m.ClassComponent {
  disabled = new Box(false);

  view(): m.Child {
    return m('div',
      m(Checkbox, {
        checked: this.disabled
      }, 'Disabled'),
      m(Button, {
        disabled: this.disabled.value,
        onclick() {
          alert('Button clicked!');
        }
      }, 'Button')
    )
  }
}
