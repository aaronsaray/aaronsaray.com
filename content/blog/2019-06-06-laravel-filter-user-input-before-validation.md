---
title: Filter User Input Before Validation in Laravel
date: 2019-06-06
tag:
- php
- laravel
---
Sometimes it makes sense to filter user input before it goes to validation.  If you're using controller-based validation in Laravel, this is pretty easy. But, if you're doing your validation in request classes, your approach needs to be different.

<!--more-->

In this example, I have an item coming in as an array.  The item is an array as well.  Sometimes, because of the UI, the user can send in a blank item, followed by a filled item.  So, I don't want to give them errors for the blank one - I just want it removed.

To give a better idea, here's an example of what the form fields look like.

```html
<div>
  <input name="items[0][id]">
  <input name="items[0][label]">
</div>
<div>
  <input name="items[1][id]">
  <input name="items[1][label]">
</div>
```

This markup is obviously programmatically generated, but this gives you an idea.  The user could not fill in the first row, which is ok. It should be ignored.

To do this, you can use the method `prepareForValidation` on your request class.

```php
<?php
class ItemStoreRequest extends FormRequest
{
  /**
   * get rid of empty items before validation
   */
  protected function prepareForValidation()
  {
    if (is_array($items = $this->get('items', []))) {
      $this->merge(['items' => array_filter($items)]);
    }
  }

  public function rules(): array
  // snip
```

And, obviously the controller looks like this:

```php
<?php
MyController extends Controller
{
  public function store(ItemStoreRequest $request)
  {
    $validated = $request->validated();
    // snip
```

The `prepareForValidation()` method runs before the rules are retrieved and validated.  In this example, I'm retrieving the items array. If the item is an array, we filter out any empty ones, then merge it back into the request.  Simple!  This way we can keep our request-based logic in the same class and we don't have to make lax validation rules.