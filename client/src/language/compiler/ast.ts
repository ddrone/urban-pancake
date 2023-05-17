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

type E = FromSource<Expr>;
type Identifier = FromSource<string>;

type Expr = Data<{
  binary: {
    left: E;
    op: Binop;
    right: E;
  },
  const: {
    value: number;
  },
  lookup: {
    name: Identifier;
  }
}>;
