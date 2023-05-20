import { Binop, FromSource, Identifier, Program, SourceExpr, SourceStmt, SourceStmtBase } from "../compiler/ast";

class ParseError {
}

// More like "descent into madness" rather than "recursive descent"
export class Parser {
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

  literalRaw(s: string) {
    if (this.source.indexOf(s, this.position) !== this.position) {
      throw new ParseError();
    }

    this.position += s.length;
  }

  literalToken(s: string): string {
    this.literalRaw(s);
    this.ws();
    return s;
  }

  // Functions ending with "Token" are supposed to consume whitespace after themselves
  numberToken(): FromSource<number> {
    const result = this.withSource(() => this.regex(this.numberRegex));
    this.ws();
    return {
      range: result.range,
      value: parseInt(result.value, 10)
    }
  }

  identToken(): Identifier {
    const result = this.withSource(() => this.regex(this.identRegex));
    this.ws();
    return result;
  }

  program(): Program {
    const stmts = this.iterate(() => this.stmt());
    return {
      stmts
    }
  }

  iterate<T>(f: () => T): T[] {
    const result: T[] = [];
    while (true) {
      const position = this.position;
      const item = this.tryParse(f);
      if (item === undefined) {
        break;
      }

      if (this.position === position) {
        throw new Error("argument to iterate should consume input");
      }

      result.push(item);
    }

    return result;
  }

  stmt(): SourceStmt {
    return this.withSource(() => this.stmtBase());
  }

  stmtBase(): SourceStmtBase {
    if (this.tryParse(() => this.literalToken('print')) !== undefined) {
      this.literalToken('(');
      const expr = this.expr1();
      const result: SourceStmtBase = {
        kind: 'print',
        expr
      }

      this.literalToken(')');
      return result;
    }

    const name = this.identToken();
    this.literalToken('=');
    const expr = this.expr1();
    return {
      kind: 'assign',
      name,
      expr
    };
  }

  expr1(): SourceExpr {
    return this.assocLeft('+', () => this.expr2())
  }

  expr2(): SourceExpr {
    return this.assocLeft('*', () => this.expr3())
  }

  expr3(): SourceExpr {
    const literal = this.tryParse(() => this.numberToken());
    if (literal !== undefined) {
      return {
        range: literal.range,
        value: {
          kind: 'const',
          constValue: literal.value
        }
      }
    }

    const ident = this.tryParse(() => this.identToken());
    if (ident !== undefined) {
      return {
        range: ident.range,
        value: {
          kind: 'lookup',
          name: ident
        }
      }
    }

    return this.withSource(() => {
      this.literalToken('(');
      const result = this.expr1();
      this.literalToken(')');
      return result.value;
    });
  }

  assocLeft(op: Binop, inner: () => SourceExpr): SourceExpr {
    let result: SourceExpr = inner();
    while (true) {
      if (this.tryParse(() => this.literalToken(op)) === undefined) {
        break;
      }
      const next = inner();
      result = {
        range: {
          startOffset: result.range.startOffset,
          endOffset: next.range.endOffset
        },
        value: {
          kind: 'binary',
          left: { unpack: result },
          op,
          right: { unpack: next }
        }
      }
    }

    return result;
  }

  tryParse<T>(f: () => T): T|undefined {
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
