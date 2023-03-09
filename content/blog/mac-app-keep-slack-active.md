---
title: Mac App to Keep Slack Active
date: 2017-07-22
tag:
- misc-web
---
I tend to use either the web interface for Slack or I use [Franz](http://meetfranz.com) to manage my open connections.  When this is not focused, however, it tends to mark you automatically inactive/away after 30 minutes.  If you're hard-core programming, you might not have slack focused for hours - and this is really confusing for your teammates as you might look non-active or even out for the day.

<!--more-->

But, to be honest, my real concern was visibility - visibility that I might look 'not busy' - even though I was.  I know other people use the Slack App - and that tends to keep you available, even if it's not focused.  So, I wanted some of this same functionality.

I decided to go down the route of making a Mac app that could authenticate to slack and then ping it on an interval to make sure that I look active.  The only problem with that was that I'd have to remember to close the app when I was done for the day - but I figured I could manage that.

## The Slack API

The slack api allows you to call the [user.setActive](https://api.slack.com/methods/users.setActive) method to set the user active.  In fact, every incoming slack api request can have a flag to indicate that this request should make the user appear as they're active again.  But, if you have "nothing else to do," you can just call this directly.

In order to use this, all I'd need is a slack token and then to set up a loop to ping the API every 15 minutes with this message.

## Create a Mac App

The idea was that I could make a light-weight app that could run in the background and maybe have a taskbar icon or something to allow you to control the functionality.  Since I'm primarily a web programmer, I went to look into [Electron](https://electron.atom.io/).  After some initial research, I found out that the output of this is rather large - 10's and 100's of mb - and just for this small task, that's crazy.  

I stumbled upon [MacGap](https://macgapproject.github.io/) which promises binaries as low as 1mb.  I think they do this by using web-views directly (with the built-in browsers) - as opposed to bundling in a web runtime into the app.  Since this is such a simple concept, I thought it was probably pretty safe to just use this mechanism instead.

## Interlude

After some time, if I'm honest, I came to realize that no one is watching my slack status, no one is monitoring me, I was just being paranoid.  In fact, if that was really a problem, that's just a symptom of something else (lack of trust, output doesn't match expectations, etc).  Because I realized I don't need this tool anymore, I started to make less time for learning about it and working on it.

Now I've decided that I don't need it - in fact, I'm not even hosting it on github - it's just not far along enough to show anyone I don't think.  It was a good learning experience, though, and now I understand more about what tools are out there.  It was difficult to think 'maybe I should just give this up' - but as I've [said before]({{< ref "/blog/its-not-shameful-to-cut-your-losses" >}}) it's ok to cut your losses sometimes.

## What I've Got So Far

First of all, // sarcasm // I'm a great UI developer - so check this screenshot out:

{{< image src="/uploads/2017/initial-screen-mac-gap.png" alt="Initial Screen" >}}

I've created a MacGap project that has some UI, CSS and Javascript.  The javascript attempts to authenticate with the slack API using the token you insert.  If you're successful, that's when the timer was supposed to start.  That's where I stopped.

In case you are curious what a MacGap project might look like, you can download the files [here](/uploads/2017/iampresent.zip) - I gotta warn you, it's not pretty.  You can run it by launching the project in XCode.