---
layout: post
title: Eclipse Integration with Tortoise SVN
tags:
- Eclipse PDT
- IDE and Web Dev Tools
- svn
---
**Update: Looks like the plugin is no longer available at that link.**

I generally don't like to be tied to a specific IDE when developing.  Additionally, I like to have my choice in using tools to manage my source control (tortoisesvn, svn command line, etc).  I just think this is the open-source way - it seems to be just a more free-spirited way of developing and managing projects.  With this in mind, I've been looking for ways to integrate my SVN into my current IDE (Eclipse PDT) but not limit myself from accessing my SVN repositories from the file system.  I've found a great plugin to help with this - so lets go over the specifics:

To keep a free and open working environment, I create my project folders on the file system, and check out my SVN projects directly into them (of course I script this!).  Because of this, I can access my svn and project details outside of any specific tool.  I've been using TortoiseSVN on windows as a shell integration tool for SVN and have found it the best tool in my arsenal so far.  I've also been using Eclipse PDT (Eclipse base 3.2 - newest version of PDT from zend.com/pdt) for my IDE recently.

In order to leverage some of the tools in Eclipse, without binding myself to my eclipse project (see: [subclipse](http://subclipse.tigris.org/)), I searched for a tortoisesvn plugin.  Finally, I found [this one](http://tabaquismo.freehosting.net/ignacio/eclipse/tortoise-svn/subversion.html).  Easy enough to install and use - and added the most popular commands to my right click menu in my PHP Explorer (in PDT)? How could I resist.

**Install the Plugin**

First off, download the zip file.  Put the unzipped folder in your plugins directory for eclipse and launch eclipse.  There.  All set.  Lets configure:

**Configure the plugin**

There isn't alot of documentation about the actual features of the plugin.  However, after some trial and error, I was able to get it to work successfully.  Unfortunately, we have the "What are these for" "extra parts" syndrome.  There are some fields I'm not sure what they are...

First off, goto Window > preferences > tortoise.

Next, fill in the first field with the path to your tortoise executable.  Mine was:

_C:\Program Files\TortoiseSVN\bin\TortoiseProc.exe_

Finally, blank out the other two fields and click ok.  I honestly have no idea what they're used for... there didn't seem to be any difference between having them filled and not.   _If you know what they're for, feel free to leave a comment._

**Action Time**

Now, once you right click on a folder or file in the PHP Explorer in PDT (haven't tried this in 'navigator'), you can access tortoise's menus (almost...) from the tortoise menu option.  The actions are taken against the folder / file that you're right clicked on... so your update, etc, is great.

Over all, I'm pretty happy.  This plugin has definitely made itself a nice place in my eclipsie heart.
