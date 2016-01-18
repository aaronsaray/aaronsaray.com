---
layout: post
title: When your linkd causes you problems, you must convertd it!
tags:
- scripting
---

For the setup I use at ("the triangle"), I have alot of filesystem links - and these are made on win32 with the linkd.exe command (the version I got is from the windows 2000 resource cd).  When I start a new project, I pass into my script which directories I'd like to make and checkout code into, and which I'd rather just linkd to.  Well, every once in a while a link'd folder needs to be a real folder.  So, since I'm a lazy programmer, I made a script called 'convertd' which will unlink the folder and then make the folder.  Chalk one up to efficiency by batch programming?  Lets see:

Here is the content of my convertd.bat file.

    
    @echo off
    REM - Script to remove a linkd and make a directory there instead
    
    if "%1" == "" goto errNoDir
    if not exist %1 goto errNotExist
    
    :main
    linkd %1 /D
    mkdir %1
    echo directory made %1
    goto end
    
    :errNotExist
    echo %1 does not exist
    goto end
    
    :errNoDir
    echo A directory is required
    goto end
    
    :end
    

So now, I just run 'convertd directoryName' and I'm golden.  Yep, thats lazy! ;)
