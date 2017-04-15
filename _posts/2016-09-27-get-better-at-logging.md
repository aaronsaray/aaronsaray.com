---
layout: post
title: Get Better at Logging
tags:
- php
- misc web development
---
Have you ever submitted a debug log for a piece of desktop software?  I'm always enthralled at the sheer amount of information that is included in some of these error reports.  It reminds me that I don't do enough logging.  As a matter of fact, I think most PHP developers don't do enough logging.

Why don't we log more?

**Excuse 1: Takes up a lot of room**  
No it doesn't.  Storage is cheap.  Stop it.

**Excuse 2: Logging to a disk is a bottleneck**  
The majority of my fellow PHP developers are not working on projects where the logging to a file is going to be the bottleneck - or there isn't that much traffic that it matters.  And if that's a real big deal, use a different logging mechanism - logs don't just exist in the filesystem.  Stop that.

**Excuse 3: The log file becomes too unwieldy to find information in**  
Well, I can't argue that a big logging file can be a problem - but that doesn't mean there aren't solutions for this.

So what do we do?

I submit this as the answer: two log files, one of all the details, and one with just the errors.  Oh - and if the writing becomes too big of an issue for your errors, try a memory to file based logging attempt (like Monolog's [fingers crossed handler](https://github.com/Seldaek/monolog/blob/master/src/Monolog/Handler/FingersCrossedHandler.php))

Here is an example of a logging system I have in place.

```php?start_inline=1
/**
 * Set up error log (WARNING) (logs/error.log) and activity log (logs/activity.log)
 * 
 * @param \Slim\Container $container
 * @return \Monolog\Logger
 */
$container['logger'] = function(\Slim\Container $container) {
    $logger = new \Monolog\Logger('handlebars');
    
    $errorHandler = new \Monolog\Handler\StreamHandler(
        __DIR__ . '/../logs/error.log', \Monolog\Logger::WARNING
    );
    $logger->pushHandler($errorHandler);
    
    $allHandler = new \Monolog\Handler\StreamHandler(
        __DIR__ . '/../logs/activity.log'
    );
    $logger->pushHandler($allHandler);
    
    return $logger;
};
```

Basically, the logger is set up in a dependency injector.  The log has two writers - one that is just the WARN level and above - and one that logs everything.  Now, I put logging events all over the place.  When I want to just watch a process, I can open up `activity.log` for fun! (not fun)

Where this becomes really important is when I have an error that I need to track down.  I monitor the `error.log` file proactively. It should not get entries.  If it does, I get an alert with the content of the newest alert.  Then, if there isn't enough information in that file, I can correlate it via timestamp to the `activity.log` file to get more details.  This way the `error.log` file is never overwhelmed with extra details - but the activity is there if I need it.