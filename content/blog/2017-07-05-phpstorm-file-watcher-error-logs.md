---
title: PHPStorm File Watcher for Immediate Error Log Alerts
date: 2017-07-05
tags:
- php
- phpstorm
---
When PHP errors happen, often times there is an error log.  This might be in the PHP error log itself or in a log file.  For example, in one of my Laravel projects, I have two log files, one for errors and one for info or debug level information.

<!--more-->

When errors happen remotely, most programmers will check the log file.  However, when they happen during local development, we usually rely on seeing a unit test fail or a display that doesn't match up.  However, if you're logging errors locally, you might forget to look at them.  In my applications, I have the same level of logging locally as I have in production.  This helps troubleshoot code issues that I might miss otherwise.

One of the things that can happen with PHP is that a certain level of error can happen (say a Warning type) but the script can continue.  You might not even notice that something went wrong - if you're not paying attention.  For this reason, I've started using file watchers in PHPStorm to alert me of errors in my application log files.

PHPStorm file watchers typically are used to do things like compile javascript or SASS files automatically. However, any action can technically happen if there is an error.

### The What

For our PHPStorm File Watcher, we want to watch our **`logs/error.log`** file for any changes.  If there are any changes, that means that an error happened.  We might also notice the error on the screen or in our test.  However, this watcher will provide a fallback for when we might not notice.  The action it will display is to create a dialog or popup that let's us know that there is a change to this file.

### The How

First, you'll need to install a terminal notifier application.  For MacOS, I'd suggest [terminal notifier](https://github.com/julienXX/terminal-notifier) (this is what I'm going to use for the demonstration).  For Ubuntu/linux, you might use the `notify-send` program.  

Next, open PHPStorm.

Go to the `Preferences...` menu item - this might be under the `File` menu on Windows - or under the `PHPStorm` menu on Mac.

In the search box, type `watcher` which will bring up the `Tools > File Watchers` dialog.  Toward the bottom left hand of the main window dialog, click the `+` to create a new file watcher.  Choose `custom` from the list.

In the new watcher, choose the following options as per the screenshot:

[![File Watcher Dialog](/uploads/2017/phpstorm-file-watcher-dialog.thumbnail.png)](/uploads/2017/phpstorm-file-watcher-dialog.png){: .thumbnail}

In order to make the scope, you'll have to click the `...` link and create a new scope named `error.log` - you can see the settings in the screenshot below:

[![File Watcher Scope](/uploads/2017/phpstorm-file-watcher-scope.thumbnail.png)](/uploads/2017/phpstorm-file-watcher-scope.png){: .thumbnail}

Basically, what you do is to choose your error file and and include it.  That will create the proper scope for your file watcher.

Save all the settings and you have a new alert system set up now.  It's a nice backup.  Here's an example of what you might see:

[![Dialog](/uploads/2017/phpstorm-file-watcher-alert.png)](/uploads/2017/phpstorm-file-watcher-alert.png){: .thumbnail}
