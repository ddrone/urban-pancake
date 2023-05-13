Assorted notes of things I have learned while working on this project

## Rose trees

At this point I'm fairly convinced that every time I work with rose trees, instead of having a single data type, like

```ts
interface Tree {
  // node data

  children: Tree[];
}
```

it's always a good idea to get a separate definition for `Forest` as well:

```ts
interface Tree {
  // node data

  children: Forest;
}

interface Forest {
  trees: Tree[];

  // Most likely, will have some augmented data too
}
```
