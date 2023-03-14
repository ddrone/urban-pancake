import { test, describe, expect} from 'vitest';
import { num, record, str, union, Validated } from './validation';

describe("str", () => {
  test("accepts strings", () => {
    expect(str.validate("test")).toBeTruthy();
  });

  test("reject other values", () => {
    expect(str.validate(true)).toBeFalsy();
    expect(str.validate(null)).toBeFalsy();
    expect(str.validate(undefined)).toBeFalsy();
  });
});

describe("union", () => {
  const nameModel = union({
    "fullName": {
      "first": str,
      "family": str,
    },
    "pseudonym": {
      "str": str,
    }
  });

  type Name = Validated<typeof nameModel>;

  const fullName: Name = {
    kind: "fullName",
    first: "John",
    family: "Doe",
  };

  const pseudonym: Name = {
    kind: "pseudonym",
    str: "Don't even know an example"
  };

  test('accepts typed values', () => {
    expect(nameModel.validate(fullName)).toBeTruthy();
    expect(nameModel.validate(pseudonym)).toBeTruthy();
  });

  test('rejects values with missing fields', () => {
    expect(nameModel.validate({kind: 'fullName'})).toBeFalsy();
    expect(nameModel.validate({kind: 'fullName', first: 'Andrew'})).toBeFalsy();
  });

  test('rejects values with invalid fields', () => {
    expect(nameModel.validate({kind: 'fullName', first: 'Andrew', family: 2})).toBeFalsy();
  });

  test('rejects values with invalid kind', () => {
    expect(nameModel.validate({kind: 'other stuff'})).toBeFalsy();
  });

  test('rejects primitive values', () => {
    expect(nameModel.validate(true)).toBeFalsy();
    expect(nameModel.validate('Andrew')).toBeFalsy();
  });
});

describe("record", () => {
  const pointModel = record({
    "x": num,
    "y": num
  });

  type Point = Validated<typeof pointModel>;

  const point: Point = {
    x: 100,
    y: 200
  };

  test('accepts typed value', () => {
    expect(pointModel.validate(point)).toBeTruthy();
  });

  test('rejects value with missing field', () => {
    expect(pointModel.validate({x: 100})).toBeFalsy();
  });

  test('accepts values with extra fields', () => {
    expect(pointModel.validate({x: 100, y: 200, z: 300})).toBeTruthy();
  });

  test('rejects primitive values', () => {
    expect(pointModel.validate(true)).toBeFalsy();
    expect(pointModel.validate(200)).toBeFalsy();
  });
});
