---
layout: post
title: Useful Firebug Tricks with Zend Framework
tags:
- zend-framework
---
Zend Framework has a few hooks with the Firebug browser plugin (with the FirePHP add-on). The two that I use are writing logs to the console and profiling of database connections.

**First thing's first: Make sure to only enable these settings in your non-production environments.**

### Zend_Db profiling

One of the most helpful things I do for my database setup is initialize the `Zend_Db` profiler with firebug in my application.ini file. It is important to have this under the development section and nowhere else. Check out this snippet of my application.ini file:

```ini
[development : production]
resources.db.params.profiler.enabled = "true"
resources.db.params.profiler.class = "Zend_Db_Profiler_Firebug"
...<snip-more here>
```
    
### Logging Application Alerts to Firebug Console

I don't like to check logs while I'm developing. I'd rather have all of these alerts in my face. Luckily, Zend Framework allows a firebug logger to do this for me. In my `bootstrap.php` file, I will create a method similar to this:

```php?start_inline=1
protected function _initLogs()
{
  $logger = new Zend_Log();
  if ($this->getEnvironment() != 'production') {
    $writer = new Zend_Log_Writer_Firebug();
  }
  $logger->addWriter($writer);
  return $logger;
}
```

With this code, your log-able items can retrieve this bootstrap resource and it will write the messages right to the console. (Side note: Most of my applications actually have another part to that If statement where they define the production logging system including setting priorities).

Do you have any creative uses for Firebug with Zend Framework?
