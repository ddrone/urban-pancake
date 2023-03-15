import m from 'mithril';
import { Box } from '../utils/box';
import { Button } from './button';

interface TimeoutButtonAttrs {
  onclick: () => void;
  restart?: Box<boolean>;
}

export class TimeoutButton implements m.ClassComponent<TimeoutButtonAttrs> {
  disabled = true;
  secondsRemaining = 3;
  intervalId?: NodeJS.Timer;

  oncreate() {
    this.start();
  }

  clearInterval() {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  start() {
    this.disabled = true;
    this.secondsRemaining = 3;

    this.clearInterval();

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  tick() {
    if (this.secondsRemaining > 0) {
      this.secondsRemaining--;
    }

    if (this.secondsRemaining === 0) {
      this.disabled = false;
      this.clearInterval();
    }

    m.redraw();
  }

  view(vnode: m.Vnode<TimeoutButtonAttrs>): m.Child {
    if (vnode.attrs.restart !== undefined && vnode.attrs.restart.value) {
      vnode.attrs.restart.value = false;
      this.start();
    }

    return m(Button,
      {
        disabled: this.disabled,
        onclick: vnode.attrs.onclick,
      },
      vnode.children,
      this.disabled && ` (active in ${this.secondsRemaining})`
    )
  }
}