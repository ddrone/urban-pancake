import m from 'mithril';
import { Button } from './components/button';
import { Checkbox } from './components/checkbox';
import { TextInput } from './components/text_input';
import { TimeoutButton } from './components/timeout_button';
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
      m('h2', 'TimeoutButton'),
      m(TimeoutButtonShowcase),
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

class TimeoutButtonShowcase implements m.ClassComponent {
  restart = new Box(false);

  view(): m.Child {
    return m('div',
      m(Button, {
        onclick: () => {
          this.restart.value = true;
        }
      }, 'Restart'),
      m(TimeoutButton, {
        onclick() {
          alert('Button clicked!');
        },
        restart: this.restart,
      }, 'Button')
    );
  }
}
