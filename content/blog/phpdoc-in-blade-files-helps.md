---
title: Use PHPDoc in Laravel Blade files for autocomplete in PHPStorm
date: 2022-10-25
tag:
- php
- laravel
- phpstorm
---
I love PHPStorm, but it can only do so much.  Even with plugins like [Laravel Idea](https://laravel-idea.com/docs/overview), you may still have some missing features. One that I wish I had was autocomplete of models from collections or paginators in blade files.  Well, turns out there's an easy enough way to add this functionality for yourself.

<!--more-->

For this example, I'm using Laravel 9 and PHPStorm 2022 with the Blade bundled plugin enabled.  Let's take a look at the code.  We have a `UsersController.php` file with the following simple code:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;

class UsersController extends Controller
{
  public function index()
  {
    $users = User::paginate();
    return view('users.index', ['users' => $users]);
  }
}
```

A pagination object of User models is sent to the `users.index` view which can look something like this:

{{< filename-header "resources/views/users/index.blade.php" >}}
```html
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
  </tr>
  @foreach($users as $user)
    <tr>
      <td><!-- I want to call $user's display name method here --></td>
      <td>{{ $user->email }}</td>
    </tr>
  @endforeach
</table>
```

As you can see, I know that the User model has a display name method - but I can't remember what it's called. I wish there was auto complete. But when I begin to type, this is all I see:

{{< image src="/uploads/2022/no-auto-complete-phpstorm.jpg" alt="No Autocomplete" >}}

No autocomplete. Even my IDE plugins aren't helping me.

Well, turns out we can use the `@var` syntax from [PHPDoc](https://docs.phpdoc.org/3.0/guide/references/phpdoc/tags/var.html) to help PHPStorm understand what we're doing.  

Let's see:

```html
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
  </tr>
  @foreach($users as $user /** @var App\Models\User $user */)
    <tr>
      <td>{{ $user->getDisplayName() }}</td>
      <td>{{ $user->email }}</td>
    </tr>
  @endforeach
</table>
```

Remember, in Blade, the directives are just shortcuts to some PHP interpretation.  With the `@var` inside of the `@foreach` we can now instruct PHPStorm what the `$user` variable is.  

Sure enough, the autocomplete is now spot-on.

{{< image src="/uploads/2022/has-auto-complete-phpstorm.jpg" alt="Has Autocomplete" >}}
