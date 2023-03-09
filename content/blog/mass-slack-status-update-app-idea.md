---
title: Mass Slack Status Update App Idea
date: 2021-07-31
tag:
- business
---
When I had active membership to more than 4 Slack workspaces, I thought: wouldn't it be nice to have a way to update all of these statuses in one fell swoop?

<!--more-->

## The Idea

One day, when I was starting to get the flu, I woke up and wanted to go right back to bed.  Since I belonged to 4 Slack workspaces that used statuses (that's not just casual when you're online, you're available workspaces, but ones where clients would judge my availability based on my status), I needed to make 4 updates to my statuses.

Sitting in bed, feeling horrible, I looked at my Slack phone app.  I only had signed in to two workspaces. In a dull haze, I swapped between each and updated my status. I still had to get up and go to my desktop and update the other two.

Wouldn't it be great if I could log into an app on my phone, choose a status, and apply it to all of my Slacks?

## Implementation

In order to implement this, you'd have to make an app in the Slack ecosystem.  Then, you could provide OAuth and request the scopes to read and set profile statuses.  

Then, I can assume some sort of Ionic-based app (because we want maximum portability and we're using mainly web-based tech anyway) where you could sign in to 1 to many Slack workspaces and they'd show your current status.

You'd pick a new status, and choose to apply that status to all of your workspaces (or just select ones).

## Challenges

First challenge would be the fact that you can't easily support custom emoji easily.  There can be a significant amount of them in a workspace, so it would take quite a lot of requests to preview them.  But, then, not each workspace would have the same ones, or even worse, they might have different representations for the same word/key.

Second challenge would be that a lot of people belong to free Slack workspaces.  These currently have a limit of [10 apps in the free version of Slack](https://slack.com/help/articles/115002422943-Message-file-and-app-limits-on-the-free-version-of-Slack).  This means that it could be possible that the user couldn't install the app in the workspace that is required for the OAuth sign in.

A third challenge is the monetization of the app - unless you provide it for free. (But remember, at least Apple's developer's program requires about [$100 USD a year](https://developer.apple.com/support/purchase-activation) to stay as an active developer).

Finally, the fourth challenge is marketing for this. Is this something that actually a lot of people use? I know a lot of my fellow nerds just sign out or belong to only one active status-based workspace (or even worse, shared channels don't show your status, so your status updates might not even be worthwhile for those configurations).  I didn't think - while sick - that I'd want to go on the app store and look for an app that did this. So I'd have to have thought I needed this app BEFORE I needed it.

## It Could Work

This could be a nice project for someone getting into the programming game. It could work, and wouldn't be that hard. So, if you're looking for a quick project, why not try this?
