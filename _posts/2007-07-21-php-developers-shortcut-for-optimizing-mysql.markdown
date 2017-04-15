---
layout: post
title: PHP developer's shortcut for optimizing mysql
tags:
- PHP
- SQL
---
PHP developers, raise your hand if you run an explain on each MySQL statement you write and use in your apps!  Anyone?  Ok... 1... 2... that's it?  Yah, I tend to forget that too, but luckily PHP allows us to cheat.  Thanks PHP!

The ini directive [mysql.trace_mode](http://us.php.net/manual/en/ref.mysql.php#ini.mysql.trace-mode) will generate errors on unoptimized mysql queries (ie, table scans, etc) .  Combined with my new error monitoring eclipse tool, this has been saving me tons of time.  It won't solve your issue or run an explain, but it will tell you if mysql is reporting an issue with your query.  Of course, you'd NEVER turn this on for production. heh.
