---
title: Using ApacheTop with Cronolog
date: 2010-06-01
tags:
- apache
---
I love ApacheTop.  I love Cronolog.  After I installed cronolog and used it in my apache configuration, however, I found it more and more difficult to use apachetop.  I stopped using it.  Well, I finally came up with a bash script that eases my frustration with calling the proper path names for apachetop.  Check it out:

<!--more-->

### My httpd.conf customlog

The entry in **`httpd.conf`** vhost contains this line:
    
    CustomLog "|/usr/local/sbin/cronolog /etc/httpd/logs/%Y/%m/%Y-%m-%d-access_log" combined

Pretty simple - just keeping my logs separated.

### My script

In order to make it easier on myself, I now invoke apachetop with this bash script.

**`webtop.sh`**
```bash
#!/bin/bash
apachetop -T 3600 -f "/etc/httpd/logs/`date +%Y`/`date +%m`/`date +%Y`-`date +%m`-`date +%d`-access_log"
```

And then I'm good to go.
