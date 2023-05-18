import { FromSource } from "../compiler/ast";

class ParseError {
}

// More like "descent into madness" rather than "recursive descent"
class Parser {
  source: string;
  position = 0;

  numberRegex = /[0-9]+/y;
  identRegex = /[a-zA-Z_-][a-zA-Z0-9_-]*/y;
  wsRegex = /[ \r\t\n]*/y;

  constructor(source: string) {
    this.source = source;
  }

  withSource<T>(f: () => T): FromSource<T> {
    const start = this.position;
    const result = f();
    return {
      range: {
        startOffset: start,
        endOffset: this.position,
      },
      value: result
    }
  }

  regex(pattern: RegExp): string {
    if (pattern.flags !== 'y') {
      throw new Error('all used regexes should be sticky');
    }

    pattern.lastIndex = this.position;
    if (!pattern.test(this.source)) {
      throw new ParseError();
    }

    const start = this.position;
    const end = pattern.lastIndex;
    this.position = end;
    return this.source.substring(start, end);
  }

  literal(s: string) {
    if (this.source.indexOf(s, this.position) !== this.position) {
      throw new ParseError();
    }

    this.position += s.length;
  }

  literalToken(s: string) {
    this.literal(s);
    this.ws();
  }

  // Functions ending with "Token" are supposed to consume whitespace after themselves
  numberToken(): number {
    const result = this.regex(this.numberRegex);
    this.ws();
    return parseInt(result, 10);
  }

  identToken(): string {
    const result = this.regex(this.numberRegex);
    this.ws();
    return result;
  }

  try<T>(f: () => T): T|undefined {
    const saved = this.position;
    try {
      return f();
    }
    catch (e) {
      if (e instanceof ParseError) {
        this.position = saved;
        return undefined;
      }
      throw e;
    }
  }

  ws() {
    this.regex(this.wsRegex);
  }
}
