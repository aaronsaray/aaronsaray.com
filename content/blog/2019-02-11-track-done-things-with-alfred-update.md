---
layout: post
title: Track Things Done with Alfred (update)
tags:
- business
---
In an [earlier entry]({% post_url 2017-07-24-track-done-things-with-alfred %}) I detailed how I track things I do each day using an [Alfred](https://www.alfredapp.com/) workflow.  Basically, I wanted to track what I did from the Alfred launcher screen, one thing at a time.  The end result was a txt file dated today.  

This worked fine but it still felt not as efficient as it could be.  I still had to open a txt file to export the data to my [Basecamp Daily Checkin](https://basecamp.com/features/checkins).  I could build a whole API integration with Basecamp, but that seemed like a lot of work.  Instead, I just build a copy/paste functionality into the workflow as well.

**TLDR;** Download this [Alfred Workflow](/uploads/2019/did-this.alfredworkflow) and type `did something here` where `something here` is the task you just did. It will create/append a file in **`~/Documents/Did This`** named after today's date with the line of what you just did.  A second option in the drop down when you type `did` is `copy to clipboard`.  This will copy a bullet point list to your clipboard (sourced from the document for today's date).  Finally, all of your did items will show in the list as well, so you can review that you're not double adding something.

You can review some of [the instructions]({% post_url 2017-07-24-track-done-things-with-alfred %}) in the old entry.  The new functionality is the copy/paste.

The big changes are the second workflow.

[![Workflow](/uploads/2019/did-this-workflow-screenshot-1-thumb.png)](/uploads/2019/did-this-workflow-screenshot-1.png){: .thumbnail}{: .inline}

In this case, it's the same keyword filter without a space and argument optional.  I created PHP script that gets all of the items file and builds the list.  Then, it also unshifts or prepends to the array the option to copy all to the clipboard.  As you can see, the arg is the entire clipboard content.  That will be the `query` moving forward.

[![Functionality](/uploads/2019/did-this-workflow-screenshot-2-thumb.png)](/uploads/2019/did-this-workflow-screenshot-2.png){: .thumbnail}{: .inline}

I added a copy to clipboard workflow as well.  All it does is copy the query into the clipboard.  

[![Clipboard widget](/uploads/2019/did-this-workflow-screenshot-3-thumb.png)](/uploads/2019/did-this-workflow-screenshot-3.png){: .thumbnail}{: .inline}

From then on, I can paste this into the Basecamp request for today's work.  If I type `did` I can start adding something for today, I can review today's list, and I can copy all of today's content into a clipboard.


