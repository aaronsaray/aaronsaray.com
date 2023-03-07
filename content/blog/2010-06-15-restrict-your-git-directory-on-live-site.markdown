---
title: Restrict your .git directory on live site
date: 2010-06-15
tag:
- git
- security
---
Do you use Git to manage your repository? If so, do you use it to check out code onto the server as well? If you do, you really should restrict access to your `.git` directory if it's in your public root. (If you're using things like Zend Framework, chances are your root directory is not your public directory, so you have less to worry about.)

<!--more-->

Simply, add the following lines to your apache config:

```apache
<directory /full/path/to/public/.git>
  Deny from All
</directory>
```

This will simply rewrite the request to your home page. No more accessing things like your `config` file that could potentially hold useful information about your Git repo configuration. 