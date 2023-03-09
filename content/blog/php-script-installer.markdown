---
title: PHP Script Installer
date: 2007-07-06
tag:
- php
---
A couple weeks ago I was reading a blog posting about PHP Script installing.  I don't remember the exact context of the article (or where it was for that matter - otherwise I'd link to it!), but I had suggested someone make a php script packager - an all in one file to install a php project.

<!--more-->

Well just to prove it was possible, I decided to code it up today.  It does the job exactly as expected.  Let's find out more about it:

The first thing I wanted to do was create a quick proof of concept, so its not pretty.  The code is ok but it might be redundant.  Additionally, it has no UI - you have to set variables in the code itself.  Still as a proof of concept that took one hour, that isn't too bad.

[Proof of concept files are here.](/uploads/2007/phpscriptinstaller_poc.zip)

## For my test project to package, I created HelloWorld Version 2

It has a **`index.php`** file which instantiates a class then echos an output method.  There are two folders, one contains a template file which `str_replace()` is executed against - the other folder contains a php file that contains the main logic.  Very simple but demonstrates multiple file types and multiple directories.

## The next step was to create the packager class.  

There were a bunch of things I didn't account for in this quick poc, but it came together quite nicely.  You set the base folder in the code, and the name of your output installer file (we're just dumping it into the root of your base folder).  There is error checking in the class to make sure that files exist, we're not overwriting them, etc.  When the `packager.php` class is executed, we store the base folder and the output file.  Next, `DirectoryIterator` SPL class is used to go through the base folder.  When directories are found, we add them to an array.  When files are found, we add their base64 encoded content (which contains no quotation marks - do you see where I'm going with that?) to the array.  The function is recursive so it makes a multidimensional array of this content.  The array is then processed to create a directory listing and a file listing.  Finally, an installer template has the two variables replaced, and we send it out.  The final output is one php file with our list of directories and file contents in it - when ran it will create all of the directories and files for the project.  You would then need to make sure to remove the file and you'd be all set.

## What are the pitfalls?

There are a number of things that could be improved to get this to a quality script.

_Recursive Directory Iterator_

I didn't use the recursiveDirectoryIterator - if I was going to rely on SPL, I should have probably used that instead of the recursive function.  Or, I could have done it all by hand without having to rely on SPL.

_File Permissions_

The only file permission check I did was to make sure I could write to the install file directory, but we know that that could even be fooled (check the man page).  I also didn't check any of the file permissions on any of the files.  If I stick with SPL, the `splFileInfo` object has a method for getting file permissions - so this would be a good thing to import into the script.

_Install Script Output Directory_

I could allow for the script to go anywhere - which would make it more flexible.  This script, when combined with a UI, could be used on a webserver maybe - and they would like to write the newest php file somewhere else - not in the same directory as the rest of the project.

_Filesystem links_

I also didn't take into account hard/soft links in the file system.  I would hope that these didn't exist in a distributable code set, but you never know!  SPL has a function to determine link information too!

_File limiting / masking_

Right now, we bring in every single file.  However, in cases where we're using SVN (`.svn` folder), it might be useful to have a mask that we can apply that tells us which files not to include.

_Size Restrictions_

This is an issue on many levels.  First of all, when something is base64 encoded, it is approximately 30% larger in size.  Take a large 5mb pdf and encode it - and you've got a sizable memory allocation.  My script takes everything into memory and stores it.  It might be more efficient to write each file after encoding it - this might require more filesystem writes and filesystem handles open, but it would save on memory.

Also, what is the largest size one php file should be?  I don't know if there is a top level limit.  And when the file gets larger, I might need to put a `set_time_limit()` call.

_Directory names_

One of the checks I do is to see if the directory key is a number.  However, if the directory itself is named after a number, this probably will not function correctly.  I could create the info array a little bit smarter.

_Escaping_

I didn't pay any attention to commands and escaping them.  Whenever you execute something on the file system, you should do this.

## Last thoughts...

While I proved it could be done, what are the possible uses for this?  It makes it easier to distribute, and easier to install (if nice UI was made) and easier to package.  There is less tcp connections if you're uploading only one file vs many - so that's reducing overhead.  But there are negatives too.  The file could become obscenely large or the script might not be running as a user who has access to create directories... its a horse a piece.  However, it was cool to see that it COULD be done.  I wonder if anyone would find this useful.
