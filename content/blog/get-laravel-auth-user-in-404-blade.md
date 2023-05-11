---
title: "Get Laravel Auth User in 404 Blade"
date: 2023-05-06T11:20:11-05:00
tag:
- laravel
---
It's nice that you can customize the 4xx/5xx error blade files if they're published in Laravel - I like that. But what if you want to access the current user - or even use your standard layout - for the not found / 404 error? It's actually quite easy. Let's check it out.

<!--more-->

First off, it's important to note that the standard auth user stuff is not scaffolded when you use the built-in 404 handler. Even if you publish the blade files, you're still not going to have access to some things. I guess this makes sense because the 4xx/5xx stuff is a little outside of the standard application flow.

But for me, I want to at least customize the 404 message a little better. I think you should still have your current user context at least.

So, to do that - it's simple.  We need our custom error 404 blade file - and a fallback controller.

{{< filename-header "resources/views/errors/404.blade.php" >}}
```html
@extends('_layouts.main')

@section('content')
    <section>
       <h1>Page Not Found</h1>
    </section>
@endsection
```

I've located this blade file in the same location as it would be published if we published it from the framework stub.  Then, I'm using my standard layout and showing an error message. Obviously in real life, this has many more details in it.

The important thing to note is that it's not special that I can use `@extends` - what is special is that in my layout, I have some user navigation that only displays if we have access to an authenticated user.  In the standard Laravel set up, the auth user is not available in these standard errors.

Next, I want to add a fallback URL definition to my routes.

{{< filename-header "routes/web.php" >}}
```php
Route::fallback(App\Controllers\NotFoundController::class);
```

This, as long as it is at the end of the file, will make all non-found pages go to that `NotFoundController`.

Finally, the contents of that file - I'm sure you can guess...

{{< filename-header "app/Http/Controllers/NotFoundController.php" >}}
```php
<?php
namespace App\Http\Controllers;

class NotFoundController extends Controller
{
  public function __invoke()
  {
    return response()->view('errors.404', status: 404);
  }
}
```

We're simply returning a response of the 404 blade file - and passing a named parameter of the status code `404` - so that it still renders the proper header status.  Done!