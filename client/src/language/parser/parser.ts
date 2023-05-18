import { FromSource } from "../compiler/ast";

interface ParseInput {
  source: string;
  start: number;
}

interface ParseOutput<T> {
  end: number;
  result: T;
}

abstract class Parser<T> {
  abstract parse(input: ParseInput): ParseOutput<T>|undefined;

  start(input: string): ParseOutput<T> | undefined {
    return this.parse({
      source: input,
      start: 0
    });
  }

  withSource(): Parser<FromSource<T>> {
    return new SourceParser(this);
  }

  mapOutput<R>(f: (x: ParseOutput<T>) => R|undefined): Parser<R> {
    return new MapParser(this, f);
  }

  map<R>(f: (x: T) => R|undefined): Parser<R> {
    return new MapParser(this, (input) => f(input.result));
  }
}

export function regexParser(pattern: RegExp): Parser<string> {
  return new RegexParser(pattern);
}

export function lazy<T>(fn: () => Parser<T>): Parser<T> {
  return new LazyParser(fn);
}

class LazyParser<T> extends Parser<T> {
  fn: () => Parser<T>;
  cached?: Parser<T>;

  constructor(fn: () => Parser<T>) {
    super();
    this.fn = fn;
  }

  parse(input: ParseInput): ParseOutput<T> | undefined {
    if (this.cached === undefined) {
      this.cached = this.fn();
    }
    return this.cached.parse(input);
  }
}

class SourceParser<T> extends Parser<FromSource<T>> {
  inner: Parser<T>;

  constructor(inner: Parser<T>) {
    super();
    this.inner = inner;
  }

  parse(input: ParseInput): ParseOutput<FromSource<T>> | undefined {
    const result = this.inner.parse(input);
    if (result === undefined) {
      return undefined;
    }
    return {
      end: result.end,
      result: {
        range: {
          startOffset: input.start,
          endOffset: result.end,
        },
        value: result.result
      }
    }
  }
}

class MapParser<T, R> extends Parser<R> {
  inner: Parser<T>;
  transform: (r: ParseOutput<T>) => R|undefined;

  constructor(inner: Parser<T>, transform: (r: ParseOutput<T>) => R|undefined) {
    super();
    this.inner = inner;
    this.transform = transform;
  }

  parse(input: ParseInput): ParseOutput<R>|undefined {
    const result = this.inner.parse(input);
    if (result === undefined) {
      return undefined;
    }

    const transformed = this.transform(result);
    if (transformed === undefined) {
      return undefined;
    }

    return {
      end: result.end,
      result: transformed
    }
  }
}

class RegexParser extends Parser<string> {
  pattern: RegExp;

  constructor(pattern: RegExp) {
    super();
    this.pattern = new RegExp(pattern, 'y');
  }

  parse(input: ParseInput): ParseOutput<string>|undefined {
    this.pattern.lastIndex = input.start;
    if (!this.pattern.test(input.source)) {
      return undefined;
    }

    const end = this.pattern.lastIndex;

    return {
      end,
      result: input.source.substring(input.start, end)
    }
  }
}
