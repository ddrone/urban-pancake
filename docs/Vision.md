# Vision

Long term, what I want to get out of this project is to have programmable personal knowledge management system. There are a plenty of unknowns about what exactly it should be, so I'm going to start with more modest tasks instead, for the majority of the time even ignoring "programmable" aspect of the PKM. Given that I would be in charge of writing the code for concrete features, it would already be programmable in a sense, by me.

## Use case 1: personal project management tool

An old joke goes like: the first step for programmer to do something is to implement their own TODO app; and this is more or less what's happening here. None of the apps I've tried work exactly for me, so I'm going to write one exactly for me.

I want to be able to do following:

* Add projects, each project having a task tree and a list of updates
* Have a simple overview of different projects that would show when was the last time I've made progress on it
* Have a simple chronological overview where I can see progress on different projects on a timeline

Not every project needs to have a task tree associated with it. For example, sometimes a project is "read a book X". Maybe such a project would have only one task at first, "write a summary for myself at the end of reading", which isn't even something that I'm going to be tackling at first. If I want to mark progress on a book, instead of having filler tasks like "read chapter 1", I can just add post-factum updates on how much I've read of it. Either changing the task state or writing an update would be considered as making a progress on a task.

That way, I can track things that I would like to accomplish without feeling the burden of having to break them down upfront into a list of tasks.

## Use case 2: daily reminders

Not the reminders about tasks scheduled for the day, mind you. I have a physical stack of flashcards I use to remind myself of the generally-applicable things I tend to forget, the problem is that I tend to forget to switch the card I currently have in the card holder. I also quite frequently move stuff around on my desk, and the card holder sometimes gets into a position where I tend not to notice it for a while. I would like to solve this problem by moving this stack of cards into electronic form, and show one card from the stack every day.

The data model is following: a card is represented in the application by the text and the number of times it has been shown. The first time I open an application during the day, the application takes a random card that was shown the least so far, shows it on a fullscreen with a button to dismiss the screen (disabled on timeout for 3-5 seconds), and on dismissal increments the amount the card has been shown.

(Actually, never mind, I'm not going to display an interstitial. Instead, the application will just show it on top. I want to make the reminders to be "ambient", that is, not requiring any user input to interact with them. If this is not going to work and I will notice that I skip these, I will update the design later.)

One thing that needs to be clarified what does it mean by "first time of the day". I consider this to be following: save the timestamp when the reminder was shown the last time, and if the current timestamp is more than that time + 19 hours, then consider this to be a new day. Using the date leads to a problem where a notification can be shown if I am awake at 12am; using 24 hours of increment leads to a problem that if I start to use the application around the same time each day, the notification might be shown only on a second refresh, pushing the time when it's going to be shown further during the day.

## Use case 3: pretty-printing data structures

Previous use cases have been mostly about the part about keeping track of information; which is about PKM half of the project. Now I want to switch gears a little into PL half of the project.

Building mental models of how the software works is probably more time-consuming part of the software development than writing the code itself. One of the most common ways to do that is to add "debugging print" statements in the middle of control flow, that shows the actual data a program is operating on. One can imagine more powerful ways to collect such information, but even if we keep the standard flow of

* Add a debug print statement
* Re-run the program
* Look at the output

There are tons of improvements that could be made. First of all, for some reason "debug print" in 2023 still means "print out plain text to the terminal". More than that, in majority of the programming languages it's going to be even a big hassle to print a compound data structure, leading to someone printing out several scalar values (such as integers, strings or booleans) by hand. JavaScript development on the web-browser side is a tad better: `console.log` can allow to inspect arbitrary data structures and `console.table` allows one to even print a table!

I would like to have a programming language that will make it possible to display static state of a data structure in a dynamic, configurable way; and even more, in such a way that it won't require a programmer to think in advance whether the data structure is going to be printed at all. (So no, while `deriving (Show)` in Haskell is an improvement, it still sucks that you have to do it for every single data structure you define)

As a starting point, I conceive a following idea: take a JSON object (parsed via `JSON.parse`), typecheck it, and if it has a regular shape "print it out" as an interactive widget in a browser. Array of records is going to be displayed as a table, there would be a button to transpose the table, compound objects can be expanded and so on.
