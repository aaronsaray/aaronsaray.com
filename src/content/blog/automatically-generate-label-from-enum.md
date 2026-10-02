---
title: "Automatically generate label from enum name"
date: "2024-06-28"
tags:
  - php
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2024-06-28-automatically-generate-label-from-enum"
  canonical: true
---

I was so happy when I saw that Enums had finally come to PHP. Up until this time, I had been faking this sort of thing with constants on interfaces.

The times are changing, and I'm here for it.

In most Enum declarations, you'll find a simple set of key value pairs, or in the PHP language, a `name` and a `value`. The name allows you to reference it in your code. The value usually is stored or passed around as data.

So, what happens when you need to display something like a text label to the user?

<!--more-->

My first thought was to create a method that used a PHP `match` statement and assign plain text values as return for a `label()` method.

Yuck! I heard you say that.

But what should we do then?

During one of my last projects, I came up with a PHP Trait that I think helps solve this problem.

As long as you name your `name` the same thing you'd want the user to see as a label.

You ready?

```php
trait ProvidesLabelsById
{
  public function label(): string
  {
    return __(ucwords(strtolower($this->name)));
  }
}
```

Then, add this trait to every Enum that you want and you'll have a label now.  You can use it something like this:

```php
echo App\Enums\Permissions::UPDATE_USER_PROFILE->label();
```

The output will be `Update User Profile` - nice!
