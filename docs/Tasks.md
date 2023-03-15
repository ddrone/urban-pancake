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
* [x] Improve the look of the interface
* [x] Make the TextInput component emit the change on pressing Enter key as well
* [x] Implement a feature for daily cards
  * [x] Write a short description of the feature
  * [x] Add router to the application
  * [x] Add widget gallery to the routes in order to be able to work on widgets independently of the features
  * [x] Implement checkbox component for widget gallery
  * [x] Implement a timeout button
  * [x] Write down the data model for reminders
  * [x] Add a way to write down another daily reminder
  * [x] Add the reminders to persistent store as well
  * [x] Add the last reminder shown to the model
  * [x] Implement the code that will pick a fresh reminder if it was absent or is just too old
* [x] Write the code to display timestamps in a relative way
* [x] Display the timestamps on every piece of data (projects, updates)
* [x] Make sure that the project update timestamp is moved forward with every change added
* [x] Sort the projects by a timestamp on loading the state
* [x] Improve look of the text input component field
* [ ] Implement a separate chronological view of all updates on different projects
* [ ] Implement a way to save/load data to server, manually via buttons at first
* [ ] Figure out a proper way to test the server
* [ ] Figure out a good way to show runtime assertions in the UI, they should probably be exposed as visible popups during the development
* [ ] Rationalize automatically generated name for the project somehow
