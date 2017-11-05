---
layout: post
title: Laravel Log Database Queries Based On Environment Variable
tags:
- PHP
- laravel
---
A nice feature of Laravel is the ability to add a listener to the `DB` object's events (or SQL queries).  I've seen some people add this, then comment it out when it's done, then un-comment it if they need it again.  I don't like that - I don't want commented code in my files (also that's why we have version control).  

Instead, let's set an environment variable (using DotEnv), populate a Config option, and use that to invoke the listening.

First, add the following lines to your `AppServiceProvider::boot()` method:

```php?start_inline=1
if (Config::get('app.log_queries')) {
  DB::listen(function ($event) {
    Log::debug('app.log_queries log', [
      'sql' => $event->sql, 
      'bindings' => $event->bindings
    ]);
  });
}
```

If we have a configuration option named `app.log_queries` and it is truthy, we will define our database listener.  Basically, it writes to the debug log every SQL statement and all of its bindings (or values).

Next, add the following line to your **`config/app.php`** file:

```php?start_inline=1
'log_queries' => env('LOG_QUERIES', false),
```

This set's the value of the config option `app.log_queries` to whatever is in your environment, or false if it's not set. 

Finally, whenever you want to enable your local logging of database queries, you can add the following line to your local **`.env`** file:

```yml
LOG_QUERIES=true
```

If you don't want to log them, then either remove the line or change the value to `false` - this makes it so that the only code you're changing on the fly is your own copy of your environment (and not introducing changes, comments, etc - to the code base.)