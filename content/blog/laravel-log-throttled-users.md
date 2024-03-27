---
title: "Laravel Log Throttled Users"
date: 2024-03-27T13:10:43-05:00
draft: true # don't forget to change date
tag:
- laravel
- security
---
You've got Laravel throttling set up on authentication, password reset and other sensitive endpoints. But, how do you know this is actually working to stop people? Or what if you either want to admonish bad users or proactively reach out with support to help them? Perhaps you might want to log your throttled attempts. It's pretty easy.

<!--more-->

So, in our example, we're just going to send an info log. But, you might find yourself doing other things with this information (like sending it over to bug reporting tools or trend analysis / BI tools.) Let's take a look on how we can do this.

First, find your `App\Exceptions\Handler` file and go to the `register()` method. In there, we want to catch reportable exceptions of the throttle type, and do something with them.  Check this out.

```php
$this->reportable(function (\Illuminate\Http\Exceptions\ThrottleRequestsException $e) {
  \Log::info('Request throttled', [
    'input' => \Request::input(),
    'ip' => \Request::ip(),
    'url' => \Request::url(),
  ]);
});
```

This handles whenever a `ThrottleRequestsException` has been reported. You can inspect that class for more details about the context you get.  Then, while it is being thrown, we also log to our standard info logger with context of the input, ip and URL. You may want to filter this information or use different logging facilities. This is just one example of how you can do this.