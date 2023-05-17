import { Data } from "../../utils/union";
import { FromSource, GenericExpr, Identifier, SourceExpr, SourceStmt, Stmt } from "./ast";

type FlatIdent = Data<{
  source: Identifier;
  // Identifier is generated, but every identifier corresponds to an expression in original
  // source. This can be maintained during the translation.
  generated: FromSource<number>;
}>;

type FlatExpr = GenericExpr<FlatIdent, FlatIdent>;

type FlatStmt = Stmt<FlatExpr, FlatIdent, FlatIdent>;

class FlatCompiler {
  nextGenerated = 0;
  sink: FlatStmt[] = [];

  generateIdent<T>(x: FromSource<T>): FlatIdent {
    const id = this.nextGenerated++;
    return {
      kind: 'generated',
      range: x.range,
      value: id
    };
  }

  pushExpr(source: SourceExpr, expr: FlatExpr, target?: FlatIdent): FlatIdent {
    const ident = target ?? this.generateIdent(source);
    const statement: FlatStmt = {
      kind: 'assign',
      expr,
      name: ident
    };
    this.sink.push(statement);
    return ident;
  }

  transformName(name: Identifier): FlatIdent {
    return {
      kind: 'source',
      ...name
    };
  }

  compileExpr(expr: SourceExpr, target?: FlatIdent): FlatIdent {
    switch (expr.value.kind) {
      case 'const':
        return this.pushExpr(expr, {
          kind: 'const',
          constValue: expr.value.constValue
        }, target);
      case 'lookup':
        // No need to generate a new name for an existing lookup
        return this.transformName(expr.value.name);
      case 'binary':
        const left = this.compileExpr(expr.value.left.unpack);
        const right = this.compileExpr(expr.value.right.unpack);
        return this.pushExpr(expr, {
          kind: 'binary',
          left,
          op: expr.value.op,
          right
        }, target);
    }
  }

  compileStmt(stmt: SourceStmt) {
    switch (stmt.value.kind) {
      case 'assign': {
        const name = this.transformName(stmt.value.name);
        this.compileExpr(stmt.value.expr, name);
        break;
      }
      case 'print': {
        const name = this.generateIdent(stmt);
        this.compileExpr(stmt.value.expr, name);
        this.sink.push({
          kind: 'print',
          expr: name
        });
      }
    }
  }
}
