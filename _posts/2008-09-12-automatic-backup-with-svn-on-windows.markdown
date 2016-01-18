---
layout: post
title: Automatic Backup with SVN on Windows
tags:
- scripting
- svn
- windows
---

A while ago, I decided that I needed to have a better backup solution for my file server.  After doing some research on various systems, I let my inner programmer take over - in addition to my desire to NEVER LOSE ANYTHING - and I defaulted to use SVN.

I was using a Windows machine as my file server - so I wrote some batch files.  I also had SVN installed on the machine.  The final touch was adding scheduled tasks.

The setup includes a computer that is always on with windows, svn command line, and 5 directories to monitor for backups.

#### First thing's first, do an SVN Checkout

The very first thing I did was make an SVN checkout in all of the five parent directories.  This way I can continue to use SVN add, svn commit without any other interaction.  Don't worry, we'll use recursion!

#### Create the full list of backups


So, first thing's first: Create the list of directories that need to be monitored.  I made them in this txt file named 'svndirectories.txt':

    
    
    D:\pictures D:\storage\videos\misc D:\storage\files\art D:\storage\files\NeverAgain D:\storage\files\Therapee
    



Note, all of them are separated by a space.  This becomes important in our next batch script.


#### Schedule the SVN Add


I added an SVN Add batch script at Midnight on sundays.  Actually, there are two batch files.  I made them separately so that I could invoke a scheduled task - but also run the "add" by hand if need be.

The first file, addsvn.bat:

    
    
    @echo off
    
    REM ------------------------------------------------------------------
    REM - forces adds on all svn files
    REM ------------------------------------------------------------------
    
    
    :START
    REM - Get file to process
    set direct=%1
    echo %direct%
    echo.
    
    :SVNADD
    svn add --force %direct%\*
    
    :NEXTFILE
    shift
    if "%1"=="" goto END
    goto START
    
    
    :END
    



That will force an add of each file passed in on the command line.  Then, the batch file that I made to be ran from the scheduler will read in the folders from the text file, and run this script.  Here is 'scheduled_addsvn.bat':


    
    
    @echo off
    REM - This is what should be scheduled to add files to svn repos
    
    REM - read in svndirectories.txt
    for /f "tokens=*" %%a in ('type svndirectories.txt 2^>NUL') do set value=%%a
    
    REM - call the addsvn program with all the directories
    addsvn %value%
    



Theoretically, I could have called it with the entire line of files after it, but I wanted to call them separately to handle errors better.

After all of these have been added, lets move on...



#### Schedule SVN Commit



Just in case I made a huge addition of files, I let an hour pass between scheduled add and scheduled commits.  Additionally, I ran the commit every day instead of every week.  I figured I'd make more changes than I would make additions.

So first, read in all of the directories again and run the commit.  Then, the file to schedule.  These are pretty much similar, just different commands:

commitsvn.bat:

    
    
    @echo off
    
    REM ------------------------------------------------------------------
    REM - commits all SVN changes
    REM ------------------------------------------------------------------
    
    
    :START
    REM - Get file to process
    set direct=%1
    echo %direct%
    echo.
    
    :SVNCOMMIT
    svn commit --message="Auto Backup" %direct%\*
    
    :NEXTFILE
    shift
    if "%1"=="" goto END
    goto START
    
    
    :END
    



scheduled_commitsvn.bat:

    
    
    @echo off
    REM - This is what should be scheduled to commit files to svn repos
    
    REM - read in svndirectories.txt
    for /f "tokens=*" %%a in ('type svndirectories.txt 2^>NUL') do set value=%%a
    
    REM - call the addsvn program with all the directories
    commitsvn %value%
    



This has worked out pretty well for me.  If you see anything I could do better, please let me know!
