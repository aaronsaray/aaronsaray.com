---
title: Website Monitoring Project
date: 2007-06-13
tag:
- misc-web
---
Recently, while working at ("the triangle"), I came across a project that I had to research.  This project's definition included finding an up-time monitoring system for our websites as well as a dead link finding feature.  So, after doing about 8 hours worth of searching, I didn't find anything that met our needs.  There were tons of dead link finders that could be ran on demand off your desktop platform, but very few that could be scheduled and ran remotely.  Additionally, it was hard to find any remote uptime monitoring systems that allowed the flexibility I was looking for - the ability to check for website up - to not give false positives, and to remotely test functionality (kind of like a remote unit test).

<!--more-->

Personally, lately my webhost just upgraded something, and now all of my PDO updates are also crashing.  I wanted to write a system that would determine what happened and what may fail on shared hosting as well... I think it would be something that you could install with a api-key on your hosting to remotely watch for changes.

With all of this in mind,  a new project spawned in my mind.  This project will help fuel my new development, allow me to join the open source community officially, and also hopefully help fund some of 102 Degrees' bills.  I came up with the 'Website Monitoring Project'.  I don't have an official title for it yet... but we will soon!  Let me tell you about all the things I need to consider for this project.

### There are five main categories to consider for my upcoming project:

#### Refine the Idea

The idea is to provide a service that will monitor websites remotely, possibly bring in local debug information, and will look for broken links.  These three features need to be ran remotely, scheduled, and generate reports.  I want to embrace the open source community and possibly build a platform for more remote testing solutions - but I also want to be able to support my own development and side projects (yah 102 D's is in deficit right now...).

- Plug in based - I want the solution to be plug in based.  This will allow for my main line of development to be on the framework and reporting of the application - and users can develop their own plugins.  I will implement the core features as core plugins - which will actually allow the users to disable the core features if they don't want them.

- two things I have to think about with this are: - I haven't ever built anything plugin based yet... I need to start investigating other plugin implementations and learn from them and two - plugins are usually disk based reads - is there going to be any performacne issues to watch out for?

- MVC - I want to build this with a Model View Controller architecture.  This is the best design paradigm I've seen.

- things: Should I allow for the plugins to be non-mvc?  Do you need to understand MVC to be able to build a plugin?  Aren't there going to be model - only based plugins?

 but make money off of it - Although Open Source projects are magnificent, they still cost money and time.  I want to have the open source version of the files out there and allow for other people to build off of them but I still want to host the service for those who don't want to implement it.  I'm figuring for hosting the service, I should be able to recover some of the costs through subscriptions.

- things: if we're going to allow an open source distributable, do I want to build in update notifications?  What if a bug is found in my software?  We want to force this on them asap.

- Should it be AJAX based?  Enough said?  I guess to move that question into the next step: should I make it AJAX to begin, or should that be version 2...?

- Write out the logic ideas - Although I have it pretty defined what I want, I still need to design this out further - and say exactly what are the services I want to offer right away

#### Set the Standards

There are many standards that need to mesh for any project to work well.  With the added complexity of releasing it open source, there is another level of standard compliance that we need to adhere to.  We have both internal coding standards and external code dependencies to worry about.

- PHP/Mysql versions - lets face it, not every environment will have PHP5.2 with Mysql5.  Should I make stuff native to the version of PHP I'm using and tell people to bite the bullet ( to the dismay of all those shared hosters ) or should I write smart functions - IE functions which determine the best and most efficient code to run based on the software that is available to them?  If you start supporting more platforms and versions, you end up having a harder to manage codebase - and testing becomes harder - but its more valuable to the users and community.

- coding standards - I think its a good thing for every project to have its internal coding standards.  Should I write these up or should I just aim for them the best I can?  This also extends to PHPDoc or any other documenting standard... Should the manuals being separate or should they be made in docbook format so they can be parsed by PHPDoc?

- Frameworks frameworks frameworks - I know I want to deploy an MVC based solution - so should I be creating my own framework for this project, or using the existing ones (Zend, symphony, etc...)  What is the benefit?  Would it be more stable if its based on my framework only - or will there be issues with the external 3rd party frameworks updating and mine not?  Also, lets not kid ourselves - my skill is in PHP, then JS.  Should I use a JS framework?  Should I allow for it to update?  (Does it need to update? Are there ever vulnerabilities found in them?)

- unit testing - I've not used PHPUnit yet... is this the project to whet my teeth on it?  There are a lot of test cases I can imagine I could do  for this - but I'm still reading my Kent Beck book about Test Driven Development.  It would be a nice thing to show on the project site -- even better, we could write more tutorials and allow users to write their own tests for their plugins.

#### Host / Distribute

- Dedicated hosting for the service - I've mentioned it a lot - but I need to cover some of the bills - so maybe dedicated hosting of the solution will help for some users.  I should be able to subscribe to the service.

- How to get the word out?  - besides SEO, what else could I do to get the web development and hosting community to know about my service?

#### Community

- it IS open source - This will be my first official foray into  the open source community.  Should I spend some time with some other projects to see how their community experience works?  Also, do I need to use any other open source solutions? If so, I need to investigate them.

- plugins allow extensibility - We know that any future development by me can be fast via plugins... and also this will increase the user's contribution to the community - they can make their own testing / reporting solutions.

- tutorials and wiki - Part of the joy of the open source projects will be the tutorials and wikis that the other community members contribute to.

#### To do in the future

- pro plugins - Although I can allow for hosting and subscriptions, I can also sell advanced plugins - I should be in the perfect place to develop these - its my coding so I should have it down, and also I'll have all the feedback from users on what they really want.

- increase community - I've not developed a community since hackingzone.org.  It would be nice to increase the support around this project.

### Final Notes

So, its a lofty project coming up - and I have many months I believe ahead of me.  I plan to chronicle my decisions and my design plan going forward here.  Look forward to using the product in a few months!
