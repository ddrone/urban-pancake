import { Data } from "../../utils/union";
import { FromSource, GenericExpr, Identifier, SourceExpr, Stmt } from "./ast";

type FlatIdent = Data<{
  source: Identifier;
  // Identifier is generated, but every identifier corresponds to an expression in original
  // source. This can be maintained during the translation.
  generated: FromSource<number>;
}>;

type FlatExpr = GenericExpr<FlatIdent, FlatIdent>;

type FlatStmt = Stmt<FlatExpr, FlatIdent>;

class FlatCompiler {
  nextGenerated = 0;
  sink: FlatExpr[] = [];

  generateIdent(expr: SourceExpr): FlatIdent {
    const id = this.nextGenerated++;
    return {
      kind: 'generated',
      range: expr.range,
      value: id
    };
  }

  compileExpr(expr: SourceExpr): FlatIdent {
    switch (expr.value.kind) {
      case 'const':
        this.sink.push({
          kind: 'const',
          constValue: expr.value.constValue
        });
        break;
      case 'lookup':
        const transformedName: FlatIdent = {
          kind: 'source',
          ...expr.value.name
        };
        this.sink.push({
          kind: 'lookup',
          name: transformedName
        });
        // No need to generate a new name for an existing lookup
        return transformedName;
      case 'binary':
        const left = this.compileExpr(expr.value.left.unpack);
        const right = this.compileExpr(expr.value.right.unpack);
        this.sink.push({
          kind: 'binary',
          left,
          op: expr.value.op,
          right
        });
    }
    return this.generateIdent(expr);
  }
}
