---
title: "A three-line method you can't actually read"
date: "2026-07-16"
tags:
  - programming
  - php
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-07-16-a-three-line-method-you-cant-actually-read"
  canonical: true
---

We've all been there: building out something and the method is getting to about 50 lines. It feels messy and off.
So you do what everyone has learned: [extract methods like Martin Fowler says](https://refactoring.com/catalog/extractFunction.html) to do.

<!--more-->

Before long the public method is down to a few lines:

```php
public function process(int $userId): Receipt
{
  $user = $this->loadUser($userId);
  $settings = $this->applySettings($user);

  return $this->buildReceipt($user, $settings);
}
```

Much cleaner...

Except now I can't actually tell what `loadUser()` even does.

```php
private function loadUser(int $id): User
{
  return User::findOrFail($id);
}
```

That's the whole method. A one-line `findOrFail`, wrapped up and given a name. Why is that a method?

And now I don't trust the rest of them either.
Is `applySettings()` a one-liner too, or is it doing some weird validation I need to know about?
This new public method reads clean, but now I have to visit three other places to understand it.

But what about extracting methods? Am I saying the godfathers of programming got it wrong?
No. We just reached for the tool at the wrong time.

Only pull something into its own method when it's reused, or when it's a self-contained step that's clearly its own job.
`loadUser()` is neither. It's called once; one fragment of the flow dressed up as a unit.
Extracting it didn't make the code simpler, just shorter, and hid the rest behind names I have to go verify.

If that method keeps growing to 150 or 200 lines, that's a different smell, and not one you fix by chopping it into private helpers.
That's usually a sign the class is doing too much.

But 50 lines that read straight through? Leave them.
"Messy" can just be an opinion, and it's a bad reason to add indirection and complication.
