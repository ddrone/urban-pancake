import { Validator, array, lazy, record, str, union } from "../generic/validation";
import { Union } from "../utils/union";

type Type = Union<{
  number: {},
  string: {},
  record: {
    items: Array<{
      name: string,
      type: Type,
    }>
  },
  array: {
    item: Type
  }
}>;

const typeModel: Validator<Type> = lazy(() => union({
  "number": {},
  "string": {},
  "record": {
    items: array(record({
      name: str,
      type: typeModel
    }))
  }
}));
