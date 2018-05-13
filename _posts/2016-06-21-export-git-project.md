---
layout: post
title: Export Git Project
tags:
- git
- phpstorm
---
I manage any WordPress plugins I create using git.  In order to create a distribution of those, I need to zip up the source code and use that to upload to the marketplace (or directly upload).  This was easy with SVN - I just used an svn export command and there we go.

Turns out there's a git command called [git archive](https://git-scm.com/docs/git-archive) which works basically the same way.  However, the cool thing about this is that it offers a built in ability to zip the file.  Either use the `--format` command line argument or just name your output path with `.tar` or `.zip` - and it'll do the proper compression for you.

For example:

`cd my-plugin-with-git && git archive -o my-plugin.zip HEAD` 

This will make a zip file of all your code, minus the `.git` folder, in the current working directory.  Use that to upload your plugin.

**Bonus Tip**

In PHPStorm, you can add this as an external command easily.  Do the following steps:

  - Go to the settings/preferences pane
  - Go to Tools > External Tools
  - Click the **+** sign to add a new command
  - Fill in the fields as you see fit - but the important ones are:
    - Program: `git`
    - Parameters: `Archive - $ProjectName$.zip HEAD`
    - Working Directory: `$ProjectFileDir$`

This will give you an option to right-click on the project and choose your external tool from the `External Tools > Your Item Name` menu to create a zip archive in the root of your project.