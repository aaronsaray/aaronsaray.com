---
layout: post
title: Get All iMessage Attachments
tags:
- php
- macos
---
The other day I was looking for an image from one of my iMessage chats.  When you browse through the attachments on the iPhone, it takes forever to scroll through them. At one point, I kept having the iMessage app crash as well (I think I was maybe 400 or 500 images into the history).  Turns out, if you have your iMessage and iCloud accounts configured properly on your Mac, you'll have duplicate copies of all the attachments (for at least the messages you haven't deleted) on your Mac as well.

### The Location and Filesystem

You can find the root of your attachments at `~/Library/Messages/Attachments`.  When you get to this location, you'll notice 2 digit hex folders.  This is the file system's way of making sure that there aren't too many files in the folder I think.  So, you'd have to look into each folder to see the next level, and then further in to see a folder named after the UUID, followed by an actual item inside of it.  So, for example, you might find a file like this: `~/Library/Messages/Attachments/81/01/B5BF4ECA-D5BF-4EF0-A222-D24F0AAE4B7B/IMG_3077.JPG`

Oh man, this will take forever to browse through all of these!

### The Scripting Way

So, I knew I wanted to see a preview of all of my images, and they'd most likely all be `.jpg` files. I happen to have enough extra HD space that I could most likely copy all of the attachments and still have enough free space.  Plus, PHP is built into the MacOS system, so I decided to write a PHP script.

My goal was simple: Iterate through all folders, grab all files, and put them in a single folder.  Then I could use thumbnail previews to look through all of them.  I also wanted to see some progress that the script was still going.  So, I made the following script:

**attachments.php**
```php
<?php
$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('/Users/aaron/Library/Messages/Attachments/'));

foreach ($rii as $file) {
    if ($file->isDir()) continue;
    if (strtolower($file->getExtension()) != 'jpg') continue;

    $name = uniqid() . '.jpg';
    copy($file->getPathname(), "~/items/" . $name);
    print "Moved {$file->getPathname()} to ~/items/{$name}\n";
}
```

Then, to run it, simple run the following command in the terminal:

`php attachments.php`

Depending on how many files you have, it may take a while.  When done, go to your `~/items` folder and take a look at all of your attachments.

#### What's In This PHP

First, we make a Recursive Directory Iterator which will generate a multi-level iterator of all of the files in the directory we pass it. It recurses into each folder and returns an iterator that is reflective of this.  In order to flatten it down for our needs, we then pass that into a Recursive Iterator Iterator.  This allows us to just loop over all the results as a single flattened loop.

For each of the found files, we check to make sure it's not a directory.  (Remember, directories are "files" too).  We also make sure that the file extension is `jpg` (or `JPG` but we just string to lower it - so we don't have to manage two extensions). 

Next, we make a unique filename (note that uniqid isn't fully unique, but it's probably good enough in our case) because some of our attachments may be named the same thing.  We finish this up by copying our source file into our flattened directory with it's unique name.  The status message confirms we're done and moving on.