---
layout: post
title: Mod Rewrite to index.php file, the easy way
tags:
- apache
---
How many of you have written this before (or something very much like it):
    
```apache
RewriteCond %{REQUEST_FILENAME} -s [OR]
RewriteCond %{REQUEST_FILENAME} -l [OR]
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^.*$ - [NC,L]
RewriteRule ^.*$ index.php [NC,L]
```

You might recognize something like this from the Zend Framework .htaccess file.  Basically, the point is to say if something doesn't exist, point it to the index.php file.  Well, there is a simpler way to do this - I can't believe I didn't know this till now...

[Apache Fallback Resource](http://httpd.apache.org/docs/2.3/mod/mod_dir.html#fallbackresource)

All of that configuration now becomes this:

```apache
FallbackResource /index.php
```
