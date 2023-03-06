---
title: Capture and redirect all Laravel email
date: 2021-12-02
tags:
- php
- laravel
---
First off, if you can use something like [mailtrap](https://mailtrap.io/) I definitely recommend doing it. Mailtrap provides credentials and configuration so you can capture all of your email into a test inbox. But if that's not possible, there is another option - and it has to do with Laravel's mail events.

<!--more-->

When Laravel send a mail, it issues two events.  (This is valid for Laravel 8.x and some earlier versions.  Newer versions of Laravel may be using a different mailer system).  Those [mail events](https://laravel.com/docs/8.x/mail#events) are `MessageSending` and `MessageSent`.  If we listen to the `MessageSending` event, we can access the underlying mailer and customize it.

Imagine this scenario.  In the staging environment, we want to send all email to a specific email address. I want to know the original email addresses, but not mess with the message content.  So, I'll write a listener, check the environment, change the to address to a known config value, and move all remaining addresses to a header.  Let's see how.

First, inside of your EventServiceProvider, you will register a listener:

```php
class EventServiceProvider extends ServiceProvider
{
  protected $listen = [
    \Illuminate\Mail\Events\MessageSending::class => [
      \App\Listeners\RedirectStagingEmail::class,
    ],
  ];
}
```

Then, let's take a look at the file:

**`app/Listeners/RedirectStagingEmail.php`**
```php
namespace App\Listeners;
use Illuminate\Mail\Events\MessageSending;

class RedirectStagingEmail
{
  public function handle(MessageSending $event)
  {
    if (app()->environment('staging')) {
      $original = [];

      foreach (['To', 'Cc', 'Bcc'] as $type) {
        if ($address = $event->message->{'get' . $type}()) {
          $original[$type] = $address;
          $event->message->{'set' . $type}(null);
        }
      }

      $event->message->setTo(config('app.staging-catch-all-email'));
      
      $event->message->getHeaders()->addTextHeader(
        'X-Original-Emails', 
        json_encode($original)
      );
    }
  }
}
```

In this listener, the first thing it does is check for the environment.  I've hard-coded mine for staging. You could obviously make this all configurable for your needs.

Then, it sets up an empty array of original information.  Then, loop through the `to`, `cc` and `bcc` addresses and retrieve the value.  (The syntax I'm using here is a way of dynamically building the method name.  It's basically creating something identical to `$event->message->getTo()` but unique for each element.). 

Then, if there is a value, store it in the original data array and set the same value to null.  This way we unset any of the to, cc or bcc addresses, but only if they exist. I don't want to mess with those addresses if they weren't set.  I also don't want to pollute my array with empty values.

Then, I set the `to` address to my config value I've configured for all messages to go to in staging.

Finally, I get the headers object and add a text header. I've named it `X-Original-Emails` and then use `json_encode()` to convert the data into a string.

The end result is an email sent to my single email address in staging with a header of something like this:

```
X-Original-Emails: {"To":{"test@email.com":null}}
```