---
title: Running PHPUnit on Remote System from Command Line
date: 2012-01-03
tags:
- eclipse-pdt
- phpunit
---
If I need to run PHPUnit on a remote system against a code suite, I will write a simple shell script like the following to do it for me.  (Bonus points, you can even include this as an External Tool in eclipse to do it right from your project).

<!--more-->
    
```bash
#!/bin/bash

ssh developmentserver "cd /var/www/tests && phpunit $1"
```

So, two things you should know: I'm using shared keys and have my .ssh/config file set up to have developmentserver as a name for the connection. 

**Bonus:**

To add this as an external tool in Eclipse, do the following:

  1. Open Eclipse

  2. Click Run -> External Tools -> External Tools Configurations

  3. Double click 'Program' to create a new program.

  4. Name it to reflect the unit test you're going to be running.

  5. In the location box, put the full location to your bash script

  6. In the arguments box, click Variables. Choose 'selected resource location'

  7. Click Apply/Close

Now, assuming that your workspace is matched up to your file system on the remote system, you can run the external tool for PHP Unit on any selected test or folder.  The output will appear in your console tab.
