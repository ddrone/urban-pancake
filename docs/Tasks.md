# Task list

Github issues is too much overhead and clicking on the UI things. Therefore, the task list/tree is stored directly in the repository, as a Markdown file.

* [x] Write down the sketch of architecture, in particular, frontend/backend split
* [x] Implement a simple server capable of serving JSON files from a given directory
  * [x] Read tutorial for Ktor framework first and do some example projects
  * [x] Implement a simple server in Ktor, being able to save and load arbitrary JSON data to file system
* [x] Set up a directory for client
* [x] Write a data model for projects and events associated with it: just status updates for now, no task tree
* [x] Do the generic validation because I can't stop thinking about it anyway
* [x] Implement a simple interface to create new projects and post updates
  * [x] Add a way to work on several projects simultaneously
* [x] Implement a way to persist the data using local storage first
  * [x] Implement validator for arrays
  * [x] Migrate Project to use data model instead of an interface
  * [x] Actually persist the data in local storage and check it on loading
* [ ] Improve the look of the interface
* [x] Make the TextInput component emit the change on pressing Enter key as well
* [ ] Implement a separate chronological view of all updates on different projects
* [ ] Implement a way to save/load data to server, manually via buttons at first
* [ ] Figure out a proper way to test the server
* [ ] Rationalize automatically generated name for the project somehow
