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

  withSource(): Parser<FromSource<T>> {
    return new SourceParser(this);
  }

  map<R>(f: (x: ParseOutput<T>) => R|undefined): Parser<R> {
    return new MapParser(this, f);
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
