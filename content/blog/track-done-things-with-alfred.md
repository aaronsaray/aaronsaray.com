---
title: Track the Things You've Done Today with Alfred
date: 2017-07-24
tag:
- business
---
For our agile workflow, it's important to provide a check-in each day.  What did you do yesterday, what do you plan on doing today, do you have any blockers?  My biggest challenge is actually remembering what I did "yesterday" - especially after the weekend.

<!--more-->

**TLDR;** Download this [Alfred Workflow](/uploads/2017/did-this.alfredworkflow) and type `did something here` where `something here` is the task you just did. It will create/append a file in **`~/Documents/Did This`** named after today's date with the line of what you just did.

### Solution Description

I want to be able to quickly type a keyword in [Alfred](https://www.alfredapp.com/) and then continue to type what I wanted.  I wanted it to be organized by date - and I wanted to be able to add more than one thing to it. 

I originally started out with Alfred, AppleScript and the Notes app.  However, as far as I can tell, you can't append to a note in Notes using AppleScript controls (you'd only be able to take it all, append the string, delete the original and rewrite it).  

So, after some research, I found out that I could just append files using built in functionality in Alfred.  Let's take a look at the workflow.

[![Workflow](/uploads/2017/did-this-workflow-screenshot-1-thumb.png)](/uploads/2017/did-this-workflow-screenshot-1.png){: .thumbnail}

Here, we can see we have a keyword, which is mapped to a vars/args filter, and then to an action.  

The keyword is `did` and requires an argument.  That argument is passed along in the workflow as `{query}`.

Then, we add a variable to the mix called `{fileName}` - which is using a built-in variable called `{date}` which - you guessed it - is the date.  The reason this has to be done in the intermediate is that the the `{fileName}` variable will be used in the action - but the action only allows defined variables, not pre-defined variables (date being predefined) as part of the filename for some reason.

Finally, we have an action that refers to two variables - `folderName` and `fileName`.  File name you recognize from the previous version.  Folder name is defined as a configuration variable in the workflow (I'll explain that later).  Then, we append to the file, creating folders if they don't exist - and just put `- {query}` in the file.  Basically that will make the text written after `did` look like a bullet point.

[![Keyword](/uploads/2017/did-this-workflow-screenshot-2-thumb.png)](/uploads/2017/did-this-workflow-screenshot-2.png){: .thumbnail}{: .inline}
[![ArgsVars](/uploads/2017/did-this-workflow-screenshot-3-thumb.png)](/uploads/2017/did-this-workflow-screenshot-3.png){: .thumbnail}{: .inline}
[![Action](/uploads/2017/did-this-workflow-screenshot-4-thumb.png)](/uploads/2017/did-this-workflow-screenshot-5.png){: .thumbnail}{: .inline}

I've specified that the storage location for this (the `folderName` variable) is **`~/Documents/Did This`** - but you can change that by clicking the `[x]` variable icon in the workflow and changing it to something else.

[![Variables](/uploads/2017/did-this-workflow-screenshot-5-thumb.png)](/uploads/2017/did-this-workflow-screenshot-5.png){: .thumbnail}{: .inline}

Now, you should be able to type `did something here` and `- something here` will be added to day's date file inside of the directory.  Good luck!



