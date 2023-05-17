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

type SourceExpr = FromSource<Expr>;
export type Identifier = FromSource<string>;

export type GenericExpr<E, Ident> = Data<{
  binary: {
    left: E;
    op: Binop;
    right: E;
  },
  const: {
    value: number;
  },
  lookup: {
    name: Ident
  }
}>;

export type Expr = GenericExpr<{e: SourceExpr}, Identifier>;
