---
title: Quick trick for Laravel requests saves tons of time
date: 2022-09-14
tag:
- php
- laravel
---
I love Laravel request classes for validation. You should be using these whenever you can! But sometimes, writing the rules seems redundant between store and update. There's a quick fix, though.

<!--more-->

First of all, let's set the stage. This works for store and update methods for a simple CRUD controller.  If you're using something like an api resource controller with patch on individual fields instead, this doesn't work as well.  Here's the deal - with our setup, we actually want both store and update to have the same rules of validation (everything that is checked and required is the same).  Likely our create and edit forms look similar - maybe even sharing a partial - with the edit filling in default values.

So what do we do? Simple - make the `StoreRequest` like you normally would. And then, with your `UpdateRequest`, simply just extend it:

```php
class UpdateRequest extends StoreRequest
```

So simple and so easy. If you haven't been doing this, I bet you're kicking yourself now!  Remember, though, only do it like this if both controller methods require the same validation.