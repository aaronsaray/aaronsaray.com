---
layout: post
title: Eclipse PDT - Include Paths
tags:
- Eclipse PDT
---

When troubleshooting a different problem the other day, I re-entered the world of eclipse include paths.  For those of you who are not familiar, the eclipse include path is located as the last option of a eclipse PDT PHP project.

### What is the Include Paths option used for?


While it wasn't so clear to me, trial and error seemed to be my friend.  It turns out, most of my PHP projects that I built, all of my files were already included inside of the project, so I never had to use this option.  However, when using other external system level libraries, like PEAR or Cake, you may not build your project with these directories included.  However, your code may still use parts of these libraries.  In order to provide proper auto completion and error checking, you can add these external libraries to the include paths option.


### What the Include Paths option is NOT


This is not a direct replacement for your include path in your php.ini.  Remember, when writing and testing code, make sure to use the same version of PHP - as well as the near exact same php.ini file - as you do on production.  The Include Paths option is just used to make sure that auto completion and in IDE debugging (not to be confused with XDebug type debugging) works correctly.  You may even want to change your default php binary to your normal php binary if the one that came with the PDT install is not your exact configuration.


### So, how does this thing work?


First, create your project.  Next, right click on the Include Paths option and choose "Configure Include Path".

You will see two options, Add Variable... and Add External Folder...

#### Add Variable...

The add variable option allows you to add PHP path variables in.  You can configure this with the Window -> Preferences method - or just click the Configure Variables button at the bottom of the Add Variable option screen.  For example, if you do a lot of PEAR programming, you might have a variable for PEAR available here.

#### Add External Folder...

This options is nice for third party php libraries that you may have on another drive or you might be accessing remotely.  For example, I've mapped my E: drive on windows to an OpenID library that I use.  Sometimes I need to include this with my projects when I'm using this third party tool.


### Do I really need these?


Like I said, for the longest time, I never used the include paths.  But, I started using more third party libraries and not wanting to include them in my main repository - and then this tool became useful.  Try it out - and see if its useful for you.
