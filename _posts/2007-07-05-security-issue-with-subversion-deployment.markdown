---
layout: post
title: Security Issue with Subversion Deployment?
tags:
- apache
- svn
---
I use Subversion (SVN) for source control and deployment both for JEMDiary and at ("the triangle"). While working on my local copy of one of the websites, I got to thinking about the .svn folder and all of its files.  The .svn folder is a local cache/db of the file changes in order to support diffs, reverts, and to give cues about file changes and the need to commit.  I started poking around inside of the folder - and discovered the text-base folder.  Inside of there, every one of my recently changed files were in there with an extension of .svn-base.  Could this be a security issue - was I showing my code to the whole world?  Lets figure this out:

**Can I see the PHP content?**

Well the very first thing I did was surf on my local apache instance to one of the files inside of that folder - and it executed the PHP code!  I actually thought I'd be able to see the content, but this still wasn't the best thing to see happen. (Its never a good thing when PHP files outside of your standard directory scheme and planning can execute... this should NEVER happen).  Ok - so there is a chance for an issue here - but I'm more curious on why its executing.

**Why could I execute a PHP file with a .svn-base extension?**

Well the very first thing I thought of was multiviews.  Perhaps I have that activated to support multiple language php files?  Just to be save, I put "-MultiViews" in my config - and I could still run the file.  So then I got curious and made my own file called test.php that prints out 'test' as a string.

First I ran it directly from the root of my website.  It worked successfully.  I then changed the name to test.php.en and executed /test.php.   No dice.  I surfed to test.php.en - and it worked fine.  Ok - so instead of doing the smart thing and searching on google, I changed the name to test.php.xxx, test.xxx.php, test.xxx.xxx.php, test.php.xxx.xxx, and test.xxx.php.xxx.  Surfing directly to each one of them worked fine.

**There's actually a reason this is working... der...**

[mod_mime](http://httpd.apache.org/docs/2.2/mod/mod_mime.html)'s manual page from apache was very enlightening.  According to the manual page, the meta information relates the filename of the document to it's     mime-type, language, character set and encoding.  It also shows that encodings, languages, etc, can be in any order (index.html.en is the same as index.en.html).  (All of this stuff I'm certain I've read before - but this is the first time it was actually useful!)  Its also useful to know that in certain cases where encodings, languages, etc, don't match a specific set of pre-defined parameters, it falls back to a known type.  This explains why .php.xxx was still accepted.

So how do we protect against our remnant .svn folder's content from being executed?  We still know this is a bad idea... so lets not give up yet.  We could restrict apache's configuration down so tight that there is no graceful fallback... I think.  But as a lazy programmer, I'm going to take the easy way out...

**Deny access to .svn using some apache config options**

With our apache config, we should be able to deny access to the .svn directory.  We have two ways to finish this.  First, if you have access to your apache config file (or if you really really want to do this with your .htaccess file - although the apache config would be a better place to put it because it only gets parsed on startup - not every page load), use mod_access and do the following:

    <directory>
        Deny from all
    </directory>

The Directory directive, used with the tilde, allows for a sort of 'regular expression' (check the manual for more).  You could also use the DirectoryMatch directive.  With our current directive, we're going to throw the user into a 403 error.  No matter what url (website.com/.svn... or website.com/images/.svn...), they will all be denied.

Another way to do this is to use a mod_rewrite rule - this way we can do a 404 or just redirect them to a nicer place.  Lets redirect the user back to the index page:

    RewriteRule .svn/* /

**Either way you solve it, solve it!**

You never know when accessing a file outside of your standard file structure can cause an issue.  Additionally, it is possible to mis-configure apache that these files may be served as plain text - and this could cause some big security issues.
