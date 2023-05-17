import { Data } from "../../utils/union";

export type Binop = '+' | '*';

interface TextRange {
  // TODO: also add source name here
  startOffset: number;
  endOffset: number;
}

export type FromSource<T> = {
  range: TextRange;
  value: T
}

export type SourceExpr = FromSource<Expr>;
export type Identifier = FromSource<string>;

export type GenericExpr<E, Ident> = Data<{
  binary: {
    left: E;
    op: Binop;
    right: E;
  },
  const: {
    constValue: number;
  },
  lookup: {
    name: Ident
  }
}>;

export type Expr = GenericExpr<{unpack: SourceExpr}, Identifier>;

export type Stmt<E, Ident, P> = Data<{
  assign: {
    name: Ident;
    expr: E
  };
  print: {
    expr: P
  }
}>;

export type SourceStmt = FromSource<Stmt<SourceExpr, Identifier, SourceExpr>>;
