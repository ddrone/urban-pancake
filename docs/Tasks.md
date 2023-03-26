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
* [x] Write down the data type of recent comment, that should have project index with it
* [x] Implement a separate chronological view of all updates on different projects
* [x] Investigate the Electron-like environments for running the code I have, because the current setup of separate client and server is quite annoying
  * [x] Seems like the way to proceed with that is to follow the route of following tutorial branch about adding support for Tauri into existing project
  * [x] Get the Tauri app to the following state: opening the app automatically loads the latest state, and closing the app automatically saves it
  * [x] After the Tauri app is done, remove the server code to avoid polluting the repository
* [x] Implement a way to mark projects as done
  * [x] Implement a way to validate enums
  * [x] Write unit tests for enum validation
  * [x] Add a new status field for the project
  * [x] Set 'active' status to all the projects and then make it required
  * [x] Add a way to change status to active and inactive
  * [x] Implement "recently done" section with different (green) background
* [x] Figure out a good way to show runtime assertions in the UI, they should probably be exposed as visible popups during the development
* [ ] Better workflow for running the app
  * [ ] Make it so that the application does not show the window by default but shows a system tray icon
  * [ ] Clicking on tray icon should open the window
  * [ ] Closing the window should not terminate the application
  * [ ] Only one window should be visible at a time
* [ ] Rationalize automatically generated name for the project somehow
