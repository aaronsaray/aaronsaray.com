---
title: "Use PHP Named Parameters for Readability"
date: 2025-01-16T16:20:44-06:00
draft: true # don't forget to change date!!
tag:
- php
params:
  context:
    - PHP 8
    - PHP 7
---
Having too many parameters for a method signature is a sign of a method that is doing too much. But, what can be done to make this more readable if you're forced to stick with it? Let's see an example using named parameters.

<!--more-->

Let's imagine this incredibly contrived PHP class.

```php
class Something
{
  public function process(mixed $stuff, string $status, bool $doSomething, $extra, $data)
  {
    // process
  }
}
```

The `process()` method has many parameters. Some are type-hinted, so at least we get some context. But eek, that could be hard to pass data to and understand. Let's look at an example.

```php
$s = new Something();
$s->process(['some' => 'thing'], 'active', true, null, ['more' => 'here']);
```

In an editor like PHPStorm, you may see some context / hints about the parameters.  But otherwise, this is pretty hard to understand.

You can make some progress by putting items into variables - or even using inline variables to hint.

```php
$s = new Something();
$stuff = ['some' => 'thing'];
$s->process($stuff, $status = 'active', true, null, ['more' => 'here']);
```

As you can see, this could start to define a lot of variables that we don't need.  

Enter PHP's named parameters. This becomes so much easier to understand.

```php
$x = new Something();
$x->process(
  stuff: ['some' => 'thing'], 
  status: 'active', 
  doSomething: true, 
  extra: null, 
  data: ['more' => 'here']
);
```

I broke them onto new lines to make it easier to understand as well. But, now you see there is no need for temporary variables and it's clear what each means.  You may also note that you can change the order of the parameters using this functionality. I don't suggest this, but it is possible.
