// Used to wrap primitive values into a mutable box that can be shared between components.
export class Box<T> {
  private _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
  }
}
