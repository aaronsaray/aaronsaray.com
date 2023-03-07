---
title: Create your application with "overtake user"
date: 2012-07-10
tags:
- misc-web
- programming
---
A couple years ago, I developed this concept I call "Overtake User."  

<!--more-->

Basically, in every application I build, I build in the ability for the currently logged-in support specialist or admin to become someone else.  Now, this is different than just viewing the user's information and records.  This actually let's the current user become the other user.  This is helpful also for scenarios where the user is "seeing something strange" but you can't see it.  If you literally "become" them, you can see it. It also removes the need to ever ask the user for their password to log in as them (or to force a password change so you can).  For the most part, this has allowed me to troubleshoot most issues besides the actual authentication systems.

However, there are two things to keep in mind: A) if you are logging in as them, remember that any auditing systems will show actions as them now, when in reality, its you.  And B) if you are using any sort of Single Sign On or OAuth/OpenID system, you may want to disable that connection after you overtake them.  I have had problems with joining a Facebook ID with my session and then logging in as another user.  You may want to check for this and request the user to disconnect from their Facebook session (Ie, just log out), before executing this action.

Thoughts?  Do you do this?
