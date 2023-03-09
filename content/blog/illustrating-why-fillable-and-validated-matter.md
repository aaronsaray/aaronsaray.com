---
title: Illustrating Why Fillable and Validated Matter in Laravel
date: 2021-02-22
tag:
- php
- laravel
- security
---
When given a choice of methods and ways to do something, it might not be clear which way is the best. As programmers, we tend to pick the easiest, then. However, the easiest can have security implications.  Let me illustrate why we should use more stringent controls in a Laravel project.

<!--more-->

## Example Code

In my example, I'm going to have a dog who's name is Woofers and belongs to user ID 1.  I want to allow the user to edit the dog's name.  So, I might have very simple code like this:

{{< filename-header "routes/web.php" >}}
```php
Route::resource('dogs', \App\Http\Controllers\DogsController::class)
  ->only(['edit', 'update']);
```

{{< filename-header "app/Models/User.php" >}}
```php
// Standard User model that comes with a fresh install of Laravel.
```

{{< filename-header "app/Models/Dog.php" >}}
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dog extends Model
{
  public $guarded = ['id'];

  public function owner()
  {
    return $this->belongsTo(User::class, 'owner_user_id');
  }
}
```

{{< filename-header "app\Http\Controllers\DogsController.php" >}}
```php
<?php
namespace App\Http\Controllers;

use App\Http\Requests\EditDogRequest;
use App\Models\Dog;

class DogsController extends Controller
{
  public function edit(Dog $dog)
  {
    return view('dogs.edit', [
      'dog' => $dog,
    ]);
}

  public function update(Dog $dog, EditDogRequest $request)
  {
    $dog->update($request->all());
    return redirect(route('dogs.edit', ['dog' => $dog]))
      ->with('success', 'You have edited the dog.');
  }
}
```

{{< filename-header "app/Http/Requests/EditDogRequest.php" >}}
```php
<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditDogRequest extends FormRequest
{
  public function rules()
  {
    return [
      'name' => [
        'required',
        'string',
        'between:1,255',
      ]
    ];
  }
}
```

{{< filename-header "resources/dogs/edit.blade.php" >}}
```html
<form action="{{ route('dogs.update', ['dog' => $dog]) }}" method="post">
  @csrf
  @method('PATCH')
  <label>
    Name:
    <input name="name" value="{{ old('name', $dog->name) }}">
  </label>
  <button type="submit">Save</button>
</form>
```

This is a very common set up I've seen a lot of times.  The logic is as follows:

* Route model binding, so I know what dog I want to edit
* Put the dog data into the form fields
* Patch to an end point that validates and rejects invalid data
* Allow the data in after its been validated to update my model
* Only guard the ID on the model because I want flexibility to add more later

However, we've left open a few holes here.

## Fillable vs Guarded

First off, I recommend using `fillable` instead of `guarded` on your eloquent models.  Whitelists allow you to define which particular properties you'd like for a user to apply to your model.  (Just because you whitelist some properties, doesn't mean that you can't assign other ones in your code.  This is just protection for automatic, bulk-assignment.)  It's not that hard to keep a `fillable` list up to date.  Through this discipline you might find that you've been allowing many other fields available to the user that you shouldn't have.

## Validated vs All

When you validate your data, you're writing validation for known data that may appear in the request.  If you didn't imagine someone would send in some data, you may not validate it.  When you use the `all()` method, you're retrieving all data in the response, including, **but not limited to** your validated data.  This means other data that the user decided to send along could be returned as well.  Combining this with no limitations on your model could have dire consequences. Instead, you should use `validated()` on your request.  This returns all of the data that has been validated.  You shouldn't be relying on data you haven't validated, right?

## Demonstrate The Problem!

Ok, so let's demonstrate the problem.  I am a user and I want to shift the dog I'm editing to another user.  I bring up the view in my browser.  Then, I add another line with my developer tools.  See if you can spot it:

```html
<form action="{{ route('dogs.update', ['dog' => $dog]) }}" method="post">
  @csrf
  @method('PATCH')
  <label>
    Name:
    <input name="name" value="{{ old('name', $dog->name) }}">
  </label>
  <button type="submit">Save</button>
  <input type="hidden" name="owner_user_id" value="2">
</form>
```

Yup, added a hidden form field setting the `owner_user_id` value to `2`.  

Before I edit the Dog, I see these values in the database:

```txt
ID, Owner User ID, Name
1, 1, Woofers
```

After I edit it:

```txt
ID, Owner User ID, Name
1, 2, WoofersNewOwner
```

I edited the name, but was also able to move it to another user.  This is a combination of accepting ANY input from a user and not guarding properly (or using a whitelist).

## The Solution

This would be solved by using the `validated()` method on the request, or setting a proper `$fillable` property. However, using both is even better.

The controller code now:

```php
public function update(Dog $dog, EditDogRequest $request)
{
  $dog->update($request->validated());
  return redirect(route('dogs.edit', ['dog' => $dog]))
    ->with('success', 'You have edited the dog.');
}
```

And the model now has the following line replacing the `$guarded` one:

```php
public $fillable = ['name'];
```

Now, that altered form no longer will allow me to steal this dog. :)