---
title: "Adding Laravel Validation Errors After Form Request Validation"
date: 2025-01-16T15:41:29-06:00
draft: true # don't forget to change date!!
tag:
- laravel
params:
  context:
    - Laravel 11
    - Laravel 10
---
Most things we want to validate in Laravel are simple. But, what should we do when we want to add more validation outside of the standard patterns that are provided? In this example, I'll show how I do just that.

<!--more-->

When something doesn't fit directly within the examples in the documentation, what do you do? Too often, we try to invent our own solution. But we shouldn't be doing this - especially when it comes to validation.

Let's talk about a specific scenario.

In my application, I do all of my validation in [form requests](https://laravel.com/docs/11.x/validation#form-request-validation) - which is a pretty nice pattern. This means that, if I've written my validation rules properly,
I should have validated data inside of my controller.

So, what if we need to do a little bit more validation besides what we can do in the simple rules setup. Perhaps we want to call out to a third party to confirm some information - but we don't want to do that unless all of the data is at least validated in the proper format.  That's simple, we can use the `withValidator()` and `after()` methods on the form request and validator.

Fine - but what if this still doesn't work - and you need to do validation even further along in your controller's method? This is where programmers tend to reach for the custom solution using sessions or something like that. But, we're not done with our validator!  We have one more tool left!

In cases where we have submitted to our controller's method, the form request has passed and the data is valid, we can still issue a validation error.  We do this by throwing the validation exception.

Laravel provides a nice helper static method to make this easy. You specify the form field and then the errors. You'll recognize this format if you've dealt with the error bag before.

```php
$valid = $request->validated();

$data = $creditCardService->process($valid);
if ($data['status'] === 'failure') {
  throw ValidationException::withMessages([
    'cc_number' => $data['error_message'],
  ]);
}

// continue to process the results from $data
```

In this example, if we have valid data we can process the credit card. If the third party denies the charge, we may want to put this error message back on the credit card number field - just like a validation message would appear.
