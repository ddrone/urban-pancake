# Architecture

Since I want a proper UI and the language/ecosystem I'm familiar with the most is the browser, the main part is going to be written in TypeScript. However, I don't want to use "the cloud", and the data is going to be stored locally. In order to get access to persistence on local file system, a server component is needed. For the first version, the server is most likely going to be extremely simple and going to be a simple key/value store that's going to store the associated JSON value in a file with name of key with ".json" extension in a predetermined folder.

In the future, I would like to develop more robust persistence, but this simple approach should suffice in the meantime.

## Project management tool

For the first iteration, focus on the post-factum updates. Each project has following:

* Name/description
* Status (active or inactive)
* Last update timestamp
* List of updates

An update can be one of:

* Creation with the duplicate information of initial project state
* Update to name and/or status of the project (that way, I should be able to search for historical data)
* Arbitrary note (e.g. something like "read chapter of a book")

Each update has a timestamp associated with it, and the state of the project has to be completely recoverable from the list of updates, starting from the beginning.

### Associating a text file with a project for keeping a task list

Here's an idea: I don't want to support adding tasks to track in the application. Recently, plain Markdown files have been working for me well for that purpose. So, in order to be able to have a task list associated with the project, I'm just going to add an ability to "attach" a file to a project. The way it works as follows:

* Each project has "Attach file" button. Clicking on it opens a file dialog, and upon selecting a file, its name will be saved in appropriate JSON field.
* Upon attaching a file, name of project is converted to a hyperlink. Clicking that hyperlink will open associated file in VSCode (to be made configurable later).
