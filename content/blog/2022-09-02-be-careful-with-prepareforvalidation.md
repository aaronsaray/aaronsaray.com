---
title: Be careful with prepareForValidation in Laravel
date: 2022-09-02
tags:
- php
- laravel
---
The [prepareForValidation()](https://laravel.com/docs/9.x/validation#preparing-input-for-validation) method is really useful in Laravel requests: it helps modify the incoming data so that validation might be easier.  But you need to be careful that you implement it correctly and don't mess up your data. Let me explain.

<!--more-->

In the documentation, `prepareForValidation()` indicates that you can use the `$this->merge()` method to merge in newly modified data.  This is a great way to update the data in one fell swoop.  Whatever you merge in overwrites the original incoming content, and then the validation can be done.

However, with their example, they use the `slug` field and modify it to become a slug.  I already don't like this - I don't think you should be changing the makeup of a field (I would arguably say that if a slug is not a slug, it should not be forced to be a slug.) But that's an argument for another blog entry.  

For our example, let's do something different: let's uppercase the first letter of the first name. (I realize that not all first names require that type of capitalization, but for our example, we're still trying to keep it simple.). This will turn values like `aaron` and `AARON` into `Aaron`.  

Let's also say we're editing the existing user model.

We might add this to our `UpdateRequest`

```php
protected function prepareForValidation()
{
  $this->merge([
    'first_name' => ucfirst($this->get('first_name')),
  ]);
}
```

This actually looks fine.  But, let's imagine now that the `first_name` field is not required.  It may be `nullable`.  Now, this causes a problem for us.

If the `first_name` field was not sent in, we now merge in an empty string into our incoming data. (This happens because `get()` will return the default value when the field isn't set - which is `null` - and then ucfirst will deal with that like a string and return a uppercase first letter empty string - which is empty.). 

Now, we have an empty string which we might use to unset the value in our model - or even if we're slightly defensive, and use `$request->has('first_name')` to check our `nullable` configuration, we'll get `true` because we've forced this value into it.

There's a solution for this.  It allows us to do simple things like this - or even more complex with more features.  We check if the values exist, and then we can modify them.  It's simple:

```php
protected function prepareForValidation()
{
  $merge = [];
  
  if ($this->has('first_name')) {
    $merge['first_name'] = ucfirst($this->get('first_name'));
  }
  
  $this->merge($merge);
}
```

Now, if `first_name` is set, you can modify it.  Otherwise, `$merge` is empty. (You could technically check if `$merge` is empty - but in this case nothing really happens if you merge in an empty array, so this is easier to follow).  If you have more properties you need to modify, you can continue to add their `if()` checks between the first and last line.