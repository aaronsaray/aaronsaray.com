---
title: "A match in disguise"
date: "2026-10-05"
tags:
  - php
  - programming
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-10-05-a-match-in-disguise"
  canonical: true
---

Let's say we're adding a Slack notification channel, and we go to update the method that labels each channel:

<!--more-->

```php
/**
 * Get channel label
 * @return string
 */
public function getLabel()
{
  $label = '';
  switch ($this->channel) {
    case 'sms': $label = 'Text Message'; break;
    case 'push': $label = 'Mobile Notification'; break;
    case 'mail': $label = 'Email'; break;
    default: $label = 'Unknown';
  }
  return $label;
}
```

I would call this code a little bit ugly and inefficient.
But, you know, it's been working for years.
I could just add one more line and call the task done.
But we're better than that, right?

Let's think about what a switch is conceptually.
It's flow control.
Here, the only flow it's controlling is which string gets set into a variable before returning it.
But don't we have better tools in PHP for this?

Yes we do.
Let's reach for `match`, because all we're doing is matching a value to a label.
Even better, we don't need the variable now either.

```php
public function getLabel(): string
{
  return match ($this->channel) {
    'sms' => 'Text Message',
    'push' => 'Mobile Notification',
    'mail' => 'Email',
    'slack' => 'Slack Message',
    default => 'Unknown',
  };
}
```

`match` is an expression.
It's designed to produce a value rather than run code.
And that's what this method really was all along: a value producer.
