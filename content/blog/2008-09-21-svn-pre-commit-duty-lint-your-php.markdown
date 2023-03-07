---
title: 'SVN Pre-commit duty: Lint your PHP'
date: 2008-09-21
tag:
- php
- svn
---
We've all been there before, committing code - and then realizing that it was broken (hrm - our unit test didn't catch it?  or... "what unit test?" if you're in another environment).  Well, there is a solution.

<!--more-->

### Batch File Fun!

Since I dev primarily on windows, I wrote a batch file.  You can also write a linux script using awk in bash (or insert your fav shell here) that will do basically the same thing.  From now on, especially at #superdev, I'm going to run `lint.bat` before I commit:

**`lint.bat`**
    
    @echo off
    echo.
    echo Starting SVN Stat + PHP Lint
    echo ============================
    svn stat |findstr /I /R "\.php$ \.phtml$" >lint.txt
    for /F "tokens=2 delims= " %%i in (lint.txt) do php -l %%i |findstr /I /B /V "No syntax errors"
    del lint.txt
    echo.
    echo ============================
    echo Finished SVN Stat + PHP Lint

### So what is happening?

Basically, when you run "lint.bat" in the root of your repository, you'll see a start and end message.  If you're lucky, nothing will be between the two double bars.  If you're not lucky, then you know what you need to fix before you commit.  But, here's what is really happening:

#### Basic Batch File Stuff

Turn off the command echo (`@echo off`), and print some context (starting the test).

#### SVN stat of PHP files

Run an SVN stat and grab files that end with `.php` or `.phtml`.  If you have other files that need to be ran through the php interpreter, you can add them, space delimited, in this "almost" regular expression format.  Note the `$` which signifies that the pattern match should be at the end of the string.  Output this to a file called **`lint.txt`**  - hopefully this not part of your code repository!

#### Loop through and look for syntax errors

Loop through each line of that stat file and run the php interpreter against it.  If the message does not begin with "No syntax errors", display the error message to the console.

#### Clean up and end

Delete the **`lint.txt`** file, and then finish up by printing some nice message and double bar.

#### Things to remember

Both `svn` and `php` should be in your system path.  Also, the user who is running the **`lint.bat`** file should have permission to write files into the current working directory.  Finally, if you have more than `.php` and `.phtml` files, modify the regular expression to find all of the files that need linting!
