export class PushdownSignal {
  pushed = false;

  push() {
    this.pushed = true;
  }

  get() {
    const result = this.pushed;
    this.pushed = false;
    return result;
  }
}
