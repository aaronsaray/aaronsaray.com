---
title: Strava iOS Shortcut to Start Last Activity
date: "2026-08-12T10:34:32-05:00"
tags:
  - ios
---
It's already hard enough for me to start my exercise in the morning. Any friction in the way can make me stop it - or at least not track it.

Since I started using Strava to track my walks, I checked its iOS widgets. I figured I should be able to just click a widget to start an activity.  

Sadly that's not the case. They're only progress widgets.  So, after doing some research, I created my own iOS shortcut.  Here's how.

<!--more-->

So first of all, the widgets are no help.  So, then I thought about iOS Shortcuts.  When in the shortcuts app, Strava does not show up. That's a no-go either.

After doing some research, I found they do expose some custom URL schemes in Strava. 

Perfect: I'll go and hit one of those with an iOS shortcut and we're good to go.

My specific use case: I am only walking and not tracking any other exercise. Therefore I can always start the same activity or even better 'start the last one' - that's what makes this work.

Here's how to do it:

* Open Shortcuts
* Create a new Shortcut
* Add the 'URLs' action. 
* Type `strava://record/new/start` (you can drop `/new/start` if you want it to just open the interface and not start)
* Add the 'Open URLs' action

Now, when you run this shortcut, it will open Strava and start the recording for the last action.

I put this in a widget that already showcases my top 4 shortcuts on one of my iOS pages and I'm set.
