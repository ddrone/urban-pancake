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