---
title: How I fixed the Javascript error with wp-codebox
date: 2009-11-16
tags:
- javascript
- wordpress
---
I've been using the [wp-codebox](http://www.ericbess.com/ericblog/2008/03/03/wp-codebox/) plugin for a while... and an upgrade came today!

<!--more-->

Well, I applied the upgrade - and now every page that has a code box on it was causing my JS to crash.  The first thing I did was disable the inclusion of the **`jquery.js`** file in the plugin by editing the **`main.php`** file's `codebox_header()` function.  Then, I deleted the **`jquery.js`** file from the `/js` folder in the plugin.  Finally, I edited **`js/codebox.js`** to remove the reference to the old jquery's `noConflict()` method.  I removed the `$jcodebox` variable and replaced it with the `$` only.  Now, all is well.
