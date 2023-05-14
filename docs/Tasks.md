# Task list

Github issues is too much overhead and clicking on the UI things. Therefore, the task list/tree is stored directly in the repository, as a Markdown file.

## Active

* [ ] Write code to pretty-print complex data structures
  * [x] Sketch out an idea for REPL that is able to render data in other ways rather than just printing the text
  * [ ] Printed out records should be displayed in a key-value table (two columns)
  * [ ] Refactoring: write out a function to descruct a pair of `[Type, Json]`
    * [ ] Also separate definitions of record and array types as pre-requisite
  * [x] Printed out array of records should be displayed in two-dimensional table
    * [x] Finish the function that renders the header of a table for array of records
    * [x] Write the function that renders a record in array as a series of rows
  * [ ] Array of arrays should be displayed as two-dimensional grid
* [ ] Start adding an implementation of an imperative programming language into the mix
  * [ ] Make it possible to define numbers, booleans, strings and compute with them
  * [ ] Define a datatype of lists, and make it possible to print lists of records as a table with an arbitrary amount of columns
  * [ ] Only then start to work on some computation rules. Start with arithmetics and function evaluation of recursive functions
* [ ] Sketch out a plan for tackling the persistence issues
  * [ ] First big problem: schema migration, currently launching an old version can destroy added fields
    * [ ] Solution: serialize the schema into file as well, and compare it on loading
    * [ ] Any issue with loading of the state should set a flag that the store should not be saved automatically
    * [ ] Some migrations (e.g. adding fields that are optional) can be done automatically, but it's probably better to ask explicitly
  * [ ] Second problem: some scenarios of quitting the application might result in data not being saved
    * [ ] Easiest, although not the most reliable, way to tackle the problem is to save the data when the focus is lost
    * [ ] After implementing the workaround with saving the data upon losing the focus, do some research on tackling the data properly
* [ ] Make it possible to run the application using different data store (for testing)
* [ ] Make a video recording of the application in action
* [ ] From the depths of my consciousness, a phrase "data cube" has appeared. Look into it.

## Completed

* [x] Add a way to see all the changes on the project
* [x] Implement support for task lists in the app itself; maybe in the simplest way via associating a file with a project
  * [x] Add a button to open "Open File" dialog
  * [x] Save the associated file into the model
  * [x] When there is file associated with a project, the name should be displayed as a hyperlink
  * [x] Clicking the hyperlink should actually open a file
