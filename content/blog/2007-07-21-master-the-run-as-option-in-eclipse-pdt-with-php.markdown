---
title: Master the 'Run As' option in Eclipse PDT with PHP
date: 2007-07-21
tag:
- eclipse-pdt
- ide-and-web-dev-tools
- php
---
Most of my development in Eclipse PDT with the results tested outside of it - using firefox.  PDT has a few options in the Run... menu:

<!--more-->

  * PHP Script

  * PHP Webpage
	
  * Web Browser

So, lets take some time to look into how each one of these works, what are their configurations and what could be the benefit of using one above the other.

_Quick Note: unfortunately, wordpress kept eating the back slashes in this entry... sorry!_

**First Things First - We're not covering debugging**

One of the biggest reasons to use Eclipse PDT's built in 'run as...' option would be for local debugging (and also possibly remote debugging for one of the options...).  However, we're going to skip past this feature (I will be writing more on it a different posting), and just examine the PHP script's behavior.  I want to know how the script responds and what environment/information I have available.  And of course - we want to make sure that we're going to be using a predictable interpreter for our PHP - no testing will make sense if its a different interpreter than we plan to run it with.

**How to test this:**

Well, I've created a quick PHP script to test what information I may have available to me.  First off, its output is printed, which will echo the output to the webpage or the console equally.  However, whereas the webpage will interpret the tag correctly and make a line break, the console won't... and will require a new line (`\n`).  As I'm not entirely certain yet if I'll have the chance to 'view source' these documents (which would render `\n`'s in a predictable fashion), I'm going to use both line break types.

The first thing I'm going to check is the [php sapi version](http://us.php.net/php-sapi-name). This will give me a heads up on how the PHP is being ran - either as a module from apache or as a command line script.

Next, I'm going to check [`$_SERVER`/`$_ENV`](http://us2.php.net/reserved.variables). These both are reserved variables that will contain a wealth of information (and not always the same information or array keys per instance...) and will help determine more about the interpreter that is being used.  Remember, **`php.ini`** settings apply to the population of these globals... I had to modify my **`php.ini`** file to have this:

`variables_order = "EGPCS"`

The last thing I'm checking is the [php version](http://us2.php.net/manual/en/function.phpversion.php).

Lets move on to the script:

```php
/**
 * my test script to run in eclipse
 */
print "PHP_SAPI: " . PHP_SAPI . "\n<br />";
 
print "_SERVER: ";
var_dump($_SERVER);
print "\n<br />";
 
print "_ENV: ";
var_dump($_ENV);
print "\n<br />";
 
print "phpversion():";
print phpversion();
```

Nice and simple and sweet.

**Firefox and Localhost Output**

The first test - a kind of control - is loading firefox and executing this command on my localhost.  Here is the output (formatted by me for easier reading - also removed a few items for privacy):

    PHP_SAPI: apache2handler
    _SERVER: array(32) {
      ["HTTP_HOST"]=>
      string(9) "localhost"
      ["HTTP_USER_AGENT"]=>
      string(90) "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.5) Gecko/20070713 Firefox/2.0.0.5"
      ["HTTP_ACCEPT"]=>
      string(99) "text/xml,application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5"
      ["HTTP_ACCEPT_LANGUAGE"]=>
      string(14) "en-us,en;q=0.5"
      ["HTTP_ACCEPT_ENCODING"]=>
      string(12) "gzip,deflate"
      ["HTTP_ACCEPT_CHARSET"]=>
      string(30) "ISO-8859-1,utf-8;q=0.7,*;q=0.7"
      ["HTTP_KEEP_ALIVE"]=>
      string(3) "300"
      ["HTTP_CONNECTION"]=>
      string(10) "keep-alive"
      ["HTTP_CACHE_CONTROL"]=>
      string(9) "max-age=0"
      ["PATH"]=>
      string(327) "**EDITED: full path specifics here **"
      ["SystemRoot"]=>
      string(10) "C:WINDOWS"
      ["COMSPEC"]=>
      string(27) "C:\WINDOWS\system32\cmd.exe"
      ["PATHEXT"]=>
      string(48) ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH"
      ["WINDIR"]=>
      string(10) "C:\WINDOWS"
      ["SERVER_SIGNATURE"]=>
      string(0) ""
      ["SERVER_SOFTWARE"]=>
      string(30) "Apache/2.2.3 (Win32) PHP/5.2.0"
      ["SERVER_NAME"]=>
      string(9) "localhost"
      ["SERVER_ADDR"]=>
      string(9) "127.0.0.1"
      ["SERVER_PORT"]=>
      string(2) "80"
      ["REMOTE_ADDR"]=>
      string(9) "127.0.0.1"
      ["DOCUMENT_ROOT"]=>
      string(19) "C:/DEVELOPMENT/temp"
      ["SERVER_ADMIN"]=>
      string(18) "admin@internal.net"
      ["SCRIPT_FILENAME"]=>
      string(35) "C:/DEVELOPMENT/temp/runas/index.php"
      ["REMOTE_PORT"]=>
      string(4) "1676"
      ["GATEWAY_INTERFACE"]=>
      string(7) "CGI/1.1"
      ["SERVER_PROTOCOL"]=>
      string(8) "HTTP/1.1"
      ["REQUEST_METHOD"]=>
      string(3) "GET"
      ["QUERY_STRING"]=>
      string(0) ""
      ["REQUEST_URI"]=>
      string(7) "/runas/"
      ["SCRIPT_NAME"]=>
      string(16) "/runas/index.php"
      ["PHP_SELF"]=>
      string(16) "/runas/index.php"
      ["REQUEST_TIME"]=>
      int(1185054696)
    }
    
    _ENV: array(23) {
      ["ALLUSERSPROFILE"]=>
      string(35) "C:\Documents and Settings\All Users"
      ["CommonProgramFiles"]=>
      string(29) "C:\Program Files\Common Files"
      ["COMPUTERNAME"]=>
      string(6) "**EDITED: Computer name was correct**"
      ["ComSpec"]=>
      string(27) "C:\WINDOWS\system32\cmd.exe"
      ["FP_NO_HOST_CHECK"]=>
      string(2) "NO"
      ["LANG"]=>
      string(1) "C"
      ["NUMBER_OF_PROCESSORS"]=>
      string(1) "1"
      ["OS"]=>
      string(10) "Windows_NT"
      ["Path"]=>
      string(327) "**EDITED: Correct path **"
      ["PATHEXT"]=>
      string(48) ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH"
      ["PROCESSOR_ARCHITECTURE"]=>
      string(3) "x86"
      ["PROCESSOR_IDENTIFIER"]=>
      string(46) "x86 Family 6 Model 13 Stepping 8, GenuineIntel"
      ["PROCESSOR_LEVEL"]=>
      string(1) "6"
      ["PROCESSOR_REVISION"]=>
      string(4) "0d08"
      ["ProgramFiles"]=>
      string(16) "C:\Program Files"
      ["SystemDrive"]=>
      string(2) "C:"
      ["SystemRoot"]=>
      string(10) "C:\WINDOWS"
      ["TEMP"]=>
      string(15) "C:WINDOWS\TEMP"
      ["TMP"]=>
      string(15) "C:\WINDOWS\TEMP"
      ["USERPROFILE"]=>
      string(38) "C:\Documents and Settings\Local\Service"
      ["windir"]=>
      string(10) "C:\WINDOWS"
      ["AP_PARENT_PID"]=>
      string(3) "320"
    }
    
    phpversion():5.2.0

Ok - great.  Now we have our standard info.  Lets move on to Eclipse's interface.

**Run As - PHP Script**

First off, its a good thing to know that I have the Zend Debugger installed for Eclipse PDT.  It could be possible to use PDT without it - although I don't know why you would.

At any rate, I went to the Run As menu option, right clicked on the PHP Script item and choose New.  I named it "Eclipse's PHP" because I noticed the first configuration option, the PHP Binary.  By default, the script is running off of a PHP binary that is included with eclipse.  There is an option to choose an alternative binary below.  Finally, I had to choose my PHP script from my open project.

When I ran the script, two things happened.  First, the console view opened up - and remained blank throughout the execution of my script.  Then, the Browser Output view opened as well and contained the output of my script.  Lets look over the output here:

    X-Powered-By: PHP/5.2.0
    Set-Cookie: ZendDebuggerCookie=127.0.0.1%3A10000%3A0||004|77742D65|1003; path=/
    Content-type: text/html
    
    PHP_SAPI: cgi-fcgi
    _SERVER: array(45) {
      ["ALLUSERSPROFILE"]=>
      string(35) "C:\Documents and Settings\All Users"
      ["APPDATA"]=>
      string(48) "C:\Documents and Settings\Aaron\Application Data"
      ["CommonProgramFiles"]=>
      string(29) "C:\Program Files\Common Files"
      ["COMPUTERNAME"]=>
      string(6) "**Edit: Correct computer name**"
      ["ComSpec"]=>
      string(27) "C:\WINDOWS\system32\cmd.exe"
      ["FP_NO_HOST_CHECK"]=>
      string(2) "NO"
      ["HOMEDRIVE"]=>
      string(2) "C:"
      ["HOMEPATH"]=>
      string(29) "Documents and Settings\Aaron"
      ["LANG"]=>
      string(1) "C"
      ["LOGONSERVER"]=>
      string(8) "**Edit: correct LOGON Server**"
      ["NUMBER_OF_PROCESSORS"]=>
      string(1) "1"
      ["OS"]=>
      string(10) "Windows_NT"
      ["Path"]=>
      string(377) "**Edit: Correct Path**"
      ["PATHEXT"]=>
      string(48) ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH"
      ["PHPRC"]=>
      string(31) "C:\DOCUME~1\Aaron\LOCALS~1\Temp"
      ["PROCESSOR_ARCHITECTURE"]=>
      string(3) "x86"
      ["PROCESSOR_IDENTIFIER"]=>
      string(46) "x86 Family 6 Model 13 Stepping 8, GenuineIntel"
      ["PROCESSOR_LEVEL"]=>
      string(1) "6"
      ["PROCESSOR_REVISION"]=>
      string(4) "0d08"
      ["ProgramFiles"]=>
      string(16) "C:\Program Files"
      ["PROMPT"]=>
      string(4) "$P$G"
      ["QUERY_STRING"]=>
      string(111) "debug_port=10000&start_debug=1&debug_start_session=1&debug_session_id=1003&send_sess_end=1&debug_host=127.0.0.1"
      ["REDIRECT_STATUS"]=>
      string(1) "1"
      ["REQUEST_METHOD"]=>
      string(3) "GET"
      ["SCRIPT_FILENAME"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["SCRIPT_NAME"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["SESSIONNAME"]=>
      string(7) "Console"
      ["SystemDrive"]=>
      string(2) "C:"
      ["SystemRoot"]=>
      string(10) "C:\WINDOWS"
      ["TEMP"]=>
      string(31) "C:\DOCUME~1\Aaron\LOCALS~1\Temp"
      ["TMP"]=>
      string(31) "C:\DOCUME~1\Aaron\LOCALS~1\Temp"
      ["USERDOMAIN"]=>
      string(6) "**Edit: proper domain**"
      ["USERNAME"]=>
      string(5) "Aaron"
      ["USERPROFILE"]=>
      string(31) "C:\Documents and Settings\Aaron"
      ["windir"]=>
      string(10) "C:WINDOWS"
      ["ORIG_PATH_TRANSLATED"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["ORIG_PATH_INFO"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["ORIG_SCRIPT_NAME"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["ORIG_SCRIPT_FILENAME"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["PHP_SELF"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["REQUEST_TIME"]=>
      int(1185055155)
      ["argv"]=>
      array(1) {
        [0]=>
        string(111) "debug_port=10000&start_debug=1&debug_start_session=1&debug_session_id=1003&send_sess_end=1&debug_host=127.0.0.1"
      }
      ["argc"]=>
      int(1)
    }
    
    _ENV: array(41) {
      ["ALLUSERSPROFILE"]=>
      string(35) "C:\Documents and Settings\All Users"
      ["APPDATA"]=>
      string(48) "C:\Documents and Settings\Aaron\Application Data"
      ["CommonProgramFiles"]=>
      string(29) "C:\Program Files\Common Files"
      ["COMPUTERNAME"]=>
      string(6) "**EDIT: Proper computer name**"
      ["ComSpec"]=>
      string(27) "C:\WINDOWS\system32\cmd.exe"
      ["FP_NO_HOST_CHECK"]=>
      string(2) "NO"
      ["HOMEDRIVE"]=>
      string(2) "C:"
      ["HOMEPATH"]=>
      string(29) "Documents and Settings\Aaron"
      ["LANG"]=>
      string(1) "C"
      ["LOGONSERVER"]=>
      string(8) "**Edit: Proper logon server**"
      ["NUMBER_OF_PROCESSORS"]=>
      string(1) "1"
      ["OS"]=>
      string(10) "Windows_NT"
      ["Path"]=>
      string(377) "**Edit: proper path**"
      ["PATHEXT"]=>
      string(48) ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH"
      ["PHPRC"]=>
      string(31) "C:\DOCUME~1\Aaron\LOCALS~1\Temp"
      ["PROCESSOR_ARCHITECTURE"]=>
      string(3) "x86"
      ["PROCESSOR_IDENTIFIER"]=>
      string(46) "x86 Family 6 Model 13 Stepping 8, GenuineIntel"
      ["PROCESSOR_LEVEL"]=>
      string(1) "6"
      ["PROCESSOR_REVISION"]=>
      string(4) "0d08"
      ["ProgramFiles"]=>
      string(16) "C:\Program Files"
      ["PROMPT"]=>
      string(4) "$P$G"
      ["QUERY_STRING"]=>
      string(111) "debug_port=10000&start_debug=1&debug_start_session=1&debug_session_id=1003&send_sess_end=1&debug_host=127.0.0.1"
      ["REDIRECT_STATUS"]=>
      string(1) "1"
      ["REQUEST_METHOD"]=>
      string(3) "GET"
      ["SCRIPT_FILENAME"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["SCRIPT_NAME"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["SESSIONNAME"]=>
      string(7) "Console"
      ["SystemDrive"]=>
      string(2) "C:"
      ["SystemRoot"]=>
      string(10) "C:\WINDOWS"
      ["TEMP"]=>
      string(31) "C:\DOCUME~1\Aaron\LOCALS~1\Temp"
      ["TMP"]=>
      string(31) "C:\DOCUME~1\Aaron\LOCALS~1\Temp"
      ["USERDOMAIN"]=>
      string(6) "**Edit: proper domain**"
      ["USERNAME"]=>
      string(5) "Aaron"
      ["USERPROFILE"]=>
      string(31) "C:\Documents and Settings\Aaron"
      ["windir"]=>
      string(10) "C:\WINDOWS"
      ["ORIG_PATH_TRANSLATED"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["ORIG_PATH_INFO"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["ORIG_SCRIPT_NAME"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
      ["ORIG_SCRIPT_FILENAME"]=>
      string(35) "C:\DEVELOPMENT\temp\runas\index.php"
    }
    
    phpversion():5.2.0

As you can tell, this executed this request as the CGI version - or the command line version of it in Windows, if you want to think of it that way.  It is kind of cool how eclipse interprets the web browser output - but I'm confused... What if I was trying to print to standard output... shouldn't it have gone to console? (also notice it opens up IE to display this... not my default browser with is FF)

Just to verify my question, I went to my own Command Line and ran this:
    
    C:\Documents and Settings\Aaron>c:\php5.2\php.exe c:\DEVELOPMENT\temp\runas\index.php

Sure enough, everything from 'web browser output' echoed to the console.

Well, how can I get messages to the console?  The next thing I tried was generating an error... well an `E_NOTICE` actually:

```php
echo $testvar;
```

I added that to the bottom.  Sure enough, our output is the same in the Browser Output, but the console has this:
    
    Notice: C:/DEVELOPMENT/temp/runas/index.php line 18 - Undefined variable: testvar

Cool!  Errors appear in the console... but why isn't it being displayed in my browser output then? I know I have `display_errors` on... but duh!  Right now, I'm pointed to a different binary - which is probably using a different php.ini file.  Lets take a look...

I went all the way down into the plugins folder, the zend debugger folder ( which is where the php executable the run as item was pointing to), and found both a `php4` and `php5` folder with binaries in each.  The **`php.ini`** files for each just contained one line:
    
    zend_extension_ts=.ZendDebugger.dll

Interesting... well I wasn't totally sold yet... so lets throw a `display_errors = true`)in there.

This didn't seem to help.  Oh well...  (Edit: not entirely sure why this didn't work.... It seems like it should have...)

Lets experiment with the other binaries option.  When selecting this option, I had two binaries to choose from... the PHP5 one and the PHP4 one I just mentioned.  To test, I ran the script with the PHP4 binary chosen - and it executed exactly the same / as expected, but displayed a different php version (4.4... duh!).  Finally, I went to the 'installed php executables' button and added my own binary into the list.  I ran the script with my binary - and nothing happened!  I have a sneaking suspicion that this has to do with the lack of the zend_debugger being installed on my default PHP binary and ini file.

I moved my **`ZendDebug.dll`** file from the eclipse to my standard installation... added the line to my **`php.ini`** - and then I was able to get the console to appear as well as the browser output.  Because my **`php.ini`** file has error display on, I was able to see my php error in the browser output as well... I'm still a little bit confused why this didn't work... anyway, moving on.

Run as a php script is an ok way to test run a command line based PHP script from eclipse.  The console coupled with the browser output (although confusingly not the same as a real console output) is helpful.  I find the biggest drawback the browser output option.  I'd have liked to see all of the output in the console instead.  Its also important to remember that - in order to take advantage of this functionality in PDT - you must have the zenddebugger active for your php binary.  Another drawback is having to set up an individual configuration for each script you'd like to run.  You can, however, right click on a script in your project and run it - but it automatically creates a new configuration for that script then.  Also, it automatically checks the 'run with debug info' which is more of a console emulation output than anything else.  I think this is more confusing to display because you're not using 'debug as' - you're using run as - and three different views open up.

Lets move on...

**Run As PHP Webpage**

Ok, so I cheated and ran a few failed tests first... so lets just save our time and make these changes to our test file out of good faith.

First, I made a new file in the same directory called phpinfo.php and put a simple phpinfo function call in it.  I then modified my index.php to have a link to the new phpinfo.php file at the bottom.

Lets make our new configuration.  Open up the run dialog again.  Right click on the php webpage option and choose new.

The first drop down is the server.  If you have servers set up, use the one that will work best for you.  I hadn't had any set up so it was set to default web server.  I clicked the configure button to make sure - and it was pointed to `http://locahost` which is fine for this exercise.

The next two options deal with the file to run and the URL.  First, select your file from your project - I selected my index.php file.  Unfortunately, the auto-generated link at the bottom wasn't correct.  My project is not my htdocs root - so I had an extra folder in there.  So, I had to uncheck the autogenerate URL button - and change the URL to match what it should be (in this case: `http://localhost/runas/index.php`).

The advanced tab had the 'Open in Browser' option checked.  Leave this checked (if you don't, all you get is the debug output view, and its not really that useful).  Finally, lets run it.

The debug view opened up - with no output for our current script... even with the error...  A new tab opened with the browser output for this script.  It even displayed the error at the bottom - matter of fact, it was the same info as my control execution of this script (which is to be expected).  Interesting note, when I re-instated the zenddebugger in my server's php, the behavior was similar to that of the script that I mentioned above - the console, debug and browser outputs opened.  This is in addition to the new tab which I had just opened with the current view in.  Talk about overkill!!!

Since I had the window open and my new script with the link at the bottom, I decided to test out this behavior, too.  Clicking the link opened the new page in the current tab with the current settings.  Great!  (I also checked this with a remote webserver, such as google.com... and this worked the same way)

So far, I've determined that this is probably a very useful way to run PHP off of my local development web server.  It is important to note that eclipse is not running the webserver, its being ran and just hooked onto and brought into eclipse's view.

One thing I've noticed, however, is these 'Run As' commands are kind of duplicates of the Debug As menu items.  They are appearing to act the same way - just they don't change the perspective you're using in eclipse.  I guess we'll discover more about this when I test out the debugging features of eclipse.

**Run As Web Browser**

I was a little bit confused on what we'd use this for anyway... but I wanted to test it out.  I'm going to skimp on the setup for this one - as its pretty pointless.  At any rate, I tested out all of the configuration options to find out it does just what it says... it allows a script to be ran in the web browser.  It opens up the web browser and pumps the file into it.  Depending on if you choose a default base URL to start from, it may serve the page.  When configured correctly, all it is is a shortcut to open a file as if you had surfed to it.  Its not really worth the time to set up.

**What Have We Learned?**

Well, I'm going to focus on our first two options only - the web browser one is kind of a waste.  We know that the run-as type functions are not really useful if that particular binary of php doesn't have the zenddebugger loaded.  You might as well just run it by surfing to it externally or executing it on the command line (actually, without the zend debugger, it may look like your script didn't even execute!).  When the zend debugger is loaded with that particular binary, the run-as commands seem very similar to the debug as commands.  They open up the console or the debug console, show errors in the console whether display errors is on or not, etc.  The downside of the run-as for command line scripts is the browser output isn't exactly what the standard output would see - so this could confuse the inexperienced.

Overall, I don't see much of a benefit to use the run-as commands.  If I'd need the debugging information they provided, I'm certain that I'd be using the debug - as commands anyway.  I'm perfectly capable of surfing to my local web server and running my command line scripts by hand to see what they would look like.
