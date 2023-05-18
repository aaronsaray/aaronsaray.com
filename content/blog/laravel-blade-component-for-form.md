---
title: "Is a Laravel Blade Component for a Form a Good Idea?"
date: 2023-05-18T09:56:38-05:00
draft: true
tag:
- laravel
---
The other day I was troubleshooting some code for a form in Laravel that was using a `PUT` method. Turns out the previous developer had not understood - and I had missed - that the `@method` override was missing. So I got to thinking - what if we made a form component that handles this for us? Is this a good idea?

<!--more-->

So, first, let's talk about the objective. The idea is that we can use `<x-form>` in the same manner as we might use a normal html `<form>` tag - but it has a few decorations that make it secure and appropriate for our Laravel project.  These include using a CSRF token when necessary - and overriding the method when necessary.  From then on, I want it to just act like a normal form.

Let's take a look at a code example:

{{< filename-header "app/View/components/Form.php" >}}
```php
<?php
declare(strict_types=1);

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Form extends Component
{
  public string $originalMethod;
  public string $htmlMethod;

  public function __construct(string $method)
  {
    $this->originalMethod = strtoupper($method);
    $this->htmlMethod = $this->originalMethod === 'GET' ? 'GET' : 'POST';
  }

  public function useCsrf(): bool
  {
    return $this->htmlMethod === 'POST';
  }

  public function shouldRenderMethodOverride(): bool
  {
    return !in_array($this->originalMethod, ['GET', 'POST']);
  }

  public function render(): View|Closure|string
  {
    return view('components.form');
  }
}
```

The only really defined property we have coming in is the `method` property.  This should be a string, and will be one of 
the HTTP verbs like `GET` or `DELETE`.  

With the property, we uppercase it. Then, we store it as the original - as well as set up an HTML-based method. Since HTML can only
accept `GET` and `POST` - we need to set that value appropriately. We'll use that when rendering the HTML form later.

Next, we have a few methods that return booleans. The first determines if we use the CSRF functionality. If we're going to 
post anything - which is to say HTML post - we need to use a CSRF for security.

Then, the `shouldRenderMethodOverride()` method let's us know if we should render the blade `@method` directive with the original value.
If we're doing anything but the standard two methods that HTML supports, we need to override that. (Remember, this was my problem and
the genesis of this entry).

Finally, the render method shows which blade file should be used.  Let's see that file below:

{{< filename-header "resources/views/components/form.blade.php" >}}
```html
<form method="{{ $htmlMethod }}" {{ $attributes }}>
  @if($useCsrf()) @csrf @endif
  @if($shouldRenderMethodOverride()) @method($originalMethod) @endif
  {{ $slot }}
</form>
```

Remember, variables used as variables represent public properties on the component. Variables used as method calls
represent public methods on the component.

Here we set the `method` attribute to what we've calculated the HTML method to be.  We then use the `$attributes` variable
to pass anything else down to the form. Remember, this is meant to just be a drop in form.

Next, checking for rendering of the CSRF and the method directive.

Finally, the `$slot` variable contains all of the contents that are nested inside of this component.

Great, now let's take a look at ways to use this.

First, a `GET` request.

```html
<x-form method="GET" action="/search" @class(['one', 'two' => false])>
  <input name="q" value="{{ old('q') }}">
  <button type="submit">Search</button>
</x-form>
```

In this example, we're using a `GET` request like a search form. We're even using some of blade's components - like `@class` to 
demonstrate that the attributes fall through.

The output of this generated is:

```html
<form method="GET" action="/search" class="one">
  <input name="q" value="">
  <button type="submit">Search</button>
</form>
```

This is a pretty simple version - and we haven't really gained anything. 

But, what about if we want to `PUT` a replacement on the dog's name. I want to refer to the form's method as a `PUT`
and I want a CSRF. Let's check out how I'd use the `x-form` below:

```html
<x-form method="PUT" action="/dogs/27">
  <input name="name" value="{{ old('name', $dog->name ?? 'unnamed') }}">
  <button type="submit">Update</button>
</x-form>
```

In this example, I used `PUT` and passed in an action URL.  Let's see what the component generates:

```html
<form method="POST" action="/dogs/27">
  <input type="hidden" name="_token" value="GP...Ub">      
  <input type="hidden" name="_method" value="PUT">     
  <input name="name" value="unnamed">
  <button type="submit">Update</button>
</form>
```

Sweet! It rendered our token and method forms - changed the HTML value to `POST` and we're good to go.

So, is this a good idea? I'm not sure yet - but it's definitely something to consider.
