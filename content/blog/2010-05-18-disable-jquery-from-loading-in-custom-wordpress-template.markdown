---
date: 2010-05-18
tags:
- jquery
- wordpress
---
On the rest of my site, I load jQuery from the google cdn.  However, wordpress likes to load it from the local cache using [`wp_enqueue_script()`](http://codex.wordpress.org/Function_Reference/wp_enqueue_script).  I didn't want to delete the jQuery file it was loading because a) that would be wrong, b) it would still have to make a 404 call to the server, and c) the admin section uses it I'm sure.

<!--more-->

Instead, I found there was a function called `wp_deregister_script()`.  Using this, I removed the jquery from my **`header.php`** file - and continued to load it from the cdn.  For reference, this is what I did:

