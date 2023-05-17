import { Data } from "../../utils/union";
import { FromSource, GenericExpr, Identifier } from "./ast";

type FlatIdent = Data<{
  source: Identifier;
  // Identifier is generated, but every identifier corresponds to an expression in original
  // source. This can be maintained during the translation.
  generated: FromSource<number>;
}>;

type FlatExpr = GenericExpr<FlatIdent, FlatIdent>;

