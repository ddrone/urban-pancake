# Architecture

Since I want a proper UI and the language/ecosystem I'm familiar with the most is the browser, the main part is going to be written in TypeScript. However, I don't want to use "the cloud", and the data is going to be stored locally. In order to get access to persistence on local file system, a server component is needed. For the first version, the server is most likely going to be extremely simple and going to be a simple key/value store that's going to store the associated JSON value in a file with name of key with ".json" extension in a predetermined folder.

In the future, I would like to develop more robust persistence, but this simple approach should suffice in the meantime.
