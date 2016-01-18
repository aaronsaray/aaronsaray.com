---
layout: post
title: Two New useful external tools for Eclipse
tags:
- Eclipse PDT
- IDE and Web Dev Tools
- svn
---

In my posting about [Integrating PHPDocumentor into Eclipse]({% post_url 2007-07-04-build-phpdocumentor-into-eclipse %}), I touched on External Tools a bit.  The combination of external batch files, the external tools extra options and the console has made my life easier.  I'm using two new additional batch files that I've written myself and integrated as external tools.  These include automated SVN release update and resource refresh and Apache application control (for those who can't run apache as a service on w32):

**SVN Update - resource refresh**

I have a specific project at the top of my PHP Explorer called _release.  It has all of the newest release folders and repos attached to it.  No matter what tag I'm working on, that one always has the newest code thats in production for this release.  Because promotes and updates go into it all the time, I usually have to remember to do the updates by hand in the file system (or actually now I can use the [tortoise plugin]({% post_url 2007-07-14-eclipse-integration-with-tortoise-svn %}) and then make sure to refresh the project to bring in any new files and update their properties.

I wanted to automate this process so I wrote a batch file which basically looks like this [edited for privacy for ("the triangle")]

    
    @echo off
    echo Starting Update
    echo.
    echo ------------------------------------------------------------------------
    echo Updating Project 1
    svn update c:\development\code\_release\project1
    echo ========================================================
    echo.
    echo ------------------------------------------------------------------------
    echo Updating Project 2
    svn update c:\development\code\_release\project2
    echo ========================================================
    echo.
    echo ------- Complete -------
    


Then, I added a new External Tool by going to the drop down for external tools.  I then created a new one called 'Update Releases' and pathed to the batch file I just created.  I clicked the refresh tab and choose 'refresh specific resource' - and chose my _release project.  Finally, I clicked the common tab and put a check mark to the left of 'display in the favorites menu' to the left of external tools.

Now, when you click the external tool, now all of the releases will update, the progress will be shown in the console, and the projects will be automatically updated.

**Apache Control - for non-service installation**

For whatever reason, we cannot run Apache as a service as ("the triangle") so we have to start it in a minimized dos window.  Because of that, I put the request in a batch file that I start whenever I want to use my local apache instance.  From time to time, I edit the apache config in the PDT installation and want to restart the browser.  Well, to be more efficient, I wanted to create and control everything from inside of eclipse.  I created a batch file to restart apache - basically which means closing it and reopening it.  The problem was that it would leave open the last window that was open, and create a new one with apache running.  Finally, I was able to figure out how to close that window and be able to start the new version successfully.

First, check out apache.bat - our main apache launching batch file

    
    @echo off
    
    REM Delete sql lite junk
    echo Deleting SQL Lite
    del c:\var\sqlite\* /Q
    
    echo Starting Apache...
    "C:\Program Files\Apache Group\Apache2\bin\apache" -w
    
    exit
    


The first line just deletes the sqlite files that are left over.  Then, we start apache with the -w switch which holds the window open for the process.  Finally, the 'exit' command will be executed when the process is killed so that the window will close that launched that batch file.

Check out restartapache.bat - which is the command that we execute using the external tools option in eclipse.

    
    @echo off
    taskkill /im apache.exe /t /f
    start C:\tools\apache.bat
    


The first line uses the taskkill command to kill all apache.exe and child processes.  When this is done, it will close out that window (remember our 'exit' command?).  Finally, it will use windows' start command to launch a new window and apache instance.

If anyone else has any other cool external tools that they use, drop me a comment.
