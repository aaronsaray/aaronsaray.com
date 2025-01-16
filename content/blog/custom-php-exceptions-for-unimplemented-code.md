---
title: "Custom PHP Exceptions for Unimplemented Code"
date: 2025-01-16T15:23:09-06:00
draft: true
tag:
- php
- programming
---
I've written about [Custom PHP Exceptions]({{< ref "the-point-of-custom-exceptions" >}}) before - as well as [using PHP Interfaces for code readability]({{< ref "add-interfaces-to-add-verbosity.md" >}}). There's one coding pattern that I use pretty consistently that encompasses these concepts - a custom exception for code or functionality that is not yet written.

<!--more-->

There are times when you have work that is in the 'todo' state where a simple `@todo` comment won't suffice. You don't want this method called because it's not done! 

Or perhaps you are extending a class but don't want some of the functionality to work in your altered implementation.

Both of these are great examples of places where you can use a custom exception. This will allow you to stop the code and give context to the programmer.

The custom exception I like to use looks like this - very simple:

{{< filename-header "app/Exceptions/NotImplementedException.php" >}}
```php
<?php

namespace App\Exceptions;

use RuntimeException;

class NotImplementedException extends RuntimeException {}
```

That's it! It's from a base SPL Runtime Exception. It clearly indicates that this code is not done.  For example...

```php
public function doSomething($thing)
{
  $this->process(ucwords($thing));
}

public function doSomethingElse($string)
{
  throw new NotImplementedException(__METHOD__ . ' says not for you!');
}
```
