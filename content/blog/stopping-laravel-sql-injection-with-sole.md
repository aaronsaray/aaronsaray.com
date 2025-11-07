---
title: "Stopping Laravel SQL Injection with sole()"
date: 2025-11-07
tag:
- laravel
- mysql
- security
- sql
params:
  context:
    - Laravel 12
---
I love using Eloquent's `sole()` method in Laravel. It throws an exception if the result set is ever more than 1. It means you should only have a sole record. This is usually what I want. I've migrated away from `firstOrFail()` unless I legitimately want the first of a matching set.

But I just found another reason to love using the sole method - it helps add a layer of protection against SQL injection. Let's find out how.

<!--more-->

So, in this example, I'm going to be writing some very vulnerable code. Never use this. The point is to demonstrate a defense in depth approach. If you're using the standard Eloquent parameterization, you're not going to have this problem. But, sometimes things get a little more complicated and you have to work with SQL directly.  There's nothing wrong with using `sole()` even if you're using parameterized queries, though. You're just layering on defense. 

Now, let's set up the situation.

**Condition** Users exist in a database and their login is with their email address. Email addresses are unique. For some reason, we have to use `whereRaw()` in our query (because this is a poc).

```php
$incomingInputForEmail = "' OR 1=1 #";
$user = User::whereRaw("email = '$incomingInputForEmail'")->firstOrFail();
```

`$incomingInputForEmail` is the user input. They specifically entered into a form field (or altered the http request) to use `' OR 1=1 #` in their email address field. 

This is what happens:

_do a query where email address is blank string, or where 1 is equal to 1.  Get the first one._

So you can see that they don't need to know the email address at all - and this sql injection brings in the first record. BAD.

**Fix** Of course we don't want to use `whereRaw()` but we must. So, let's use `sole()`

Remember, email addresses are unique. `1=1` will return 'all records' because that is a true `where` statement.

```php
$incomingInputForEmail = "' OR 1=1 #";
$user = User::whereRaw("email = '$incomingInputForEmail'")->sole();
```

What happens? A `MultipleRecordsFoundException` gets thrown and we don't get any user records.

**Final thoughts** So, don't do this. Instead, do something like `User::where('email', $incomingInputForEmail)` and don't use the `whereRaw()`. If you do need raw queries, sanitize your input. BUT, if you only need one row and one row should only ever match, add `sole()` for another layer of protection.
