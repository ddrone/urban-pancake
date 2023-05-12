Assorted language features that I would like to implement

# Current function name, as a string

One common pattern of code looks like this:

```js
function myFunctionWithLongEnterpriseyName(input: AnInput) {
  if (!input.valid) {
    throw new Error('myFunctionWithLongEnterpriseyName expects a valid input');
  }

  // ...
}
```

This is tedious and error-prone. It would be useful to have either a builtin, or a macro in stardard library that will allow writing something like

```js
function myFunctionWithLongEnterpriseyName(input: AnInput) {
  if (!input.valid) {
    throw new Error(`${functionName$()} expects a valid input`);
  }

  // ...
}
```

Probably going for a macro is a better choice. This should be one particular use case that I should have in mind when thinking about the macro system.

