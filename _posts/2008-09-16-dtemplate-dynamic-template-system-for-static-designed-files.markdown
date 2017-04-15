---
layout: post
title: 'dtemplate: dynamic template system for static designed files'
tags:
- Misc Web Design
- opensource
- PHP
---

One of the biggest time wasters I deal with is parsing out static web designs given to me by designers.  They don't know programming, so they design it with static HTML in mind.  Even if you're using a tool like dreamweaver, updating static pages can be a hassle.  Then, a lot of times, they have to remove their 'lorem ipsum' text and send it to me - and then I continue to chop it up.  Now, I'm talking about smaller 5 to 10 page sites here, not huge sites like [JEMDiary](http://jemdiary.com) or something.  However, that idea birthed...

### Welcome dtemplate!

The purpose of dtemplate was to read in an existing design from a designer or a static site that already exists, and make certain parts parse-able for replacement content.  This way the designer can give the developer a complete xhtml package and move on.  As long as the files are verified as valid xhtml, they're good to go.  Then the developer will write whatever programming/content needs to be replaced.  It would be even possible for the designer to put basically all 'lorem ipsum' if necessary - and it could all be replaced.

### How does it work?

dtemplate takes existing URLs and rewrites them to be used in the template.  The template then reads in the xhtml files, looks for any specified IDs or classes, and replaces the content.  It finally renders the content out to the screen.  Any non .html file gets rewritten to be found in the new directory.


### Implementation Steps

Its easy to put dtemplate into use.  If all else fails, check out the comments in the files.

#### Create source directory

In order to have the content be read in by the template file correctly, you must make a new folder at the base of the site called **dtemplate_sourcehtml**.  Move all of the files in the current root into that folder.

#### Modify .htaccess

The last line of the .htaccess file specifies the real URL of the site.  In our example, its http://myrx8.local.  You need to change this to be your site.  Put this in the root of the site.


#### Add additional files

Place the **dtemplate_controller.php**, **dtemplate folder** and the **verify folder** in the root of the site.

#### Verify each xhtml file


Before surfing to the site, you should visit **http://yoursite.com/verify** and upload each file, and check for any id's and classes that you'd like to replace.  This way you know if the file will parse fine and if the required classes and IDs are located in the file.


#### Modify the dtemplate_build_content() function in dtemplate_controller.php

This function is made to replace any content for your file.  It is commented - plus you can see an example in the download.  It is recommended that you create your own class(es) and use this function only for adding the content to the template when needed - don't place all your logic in this file.

#### Surf!

You should be good to go!  If you want, you can remove the 'verify' folder.


### Example

I've included a really simple frames website as an example with the download.  This was originally on http://myrx8.local as a test.

### Todo and Known Issues

- make sure you don't have to edit out the website in .htaccess

- support multiple directories for html files.

- is pretty rewrite intensive.


### The download


[dtemplate.zip](/uploads/2008/dtemplate.zip)
