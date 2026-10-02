---
title: "When a validation failure causes a redirect loop"
date: "2026-08-27"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-08-27-when-a-validation-failure-causes-a-redirect-loop"
  canonical: true
---

Laravel's default behavior on a failed `FormRequest` validation is to throw a `ValidationException`, which the framework's exception handler converts into a redirect to the previous URL with the input flashed to the session and errors attached.

That works perfectly when a person submits the form as the redirect lands them back on that page with the errors.
It breaks down when the form submits itself, for example a bookmark to a `GET` form with validation, or submitting something into a `target="_blank"` (like PDF generation).

<!--more-->

In all of these, Laravel redirects to `url()->previous()` which is the `Referer` header or the last `GET` URL stored in the session.
Both point at the form, because the form page sent the request and loading it stored it in the session.
The form submits, validation fails, the framework redirects to the form, the form auto-submits again and the user is stuck.

One fix for this rare condition is to override `failedValidation()` on the `FormRequest` and abort with a 422 instead of letting the default redirect behavior run:

```php
protected function failedValidation(Validator $validator): void
{
  abort(422, sprintf(
    'A validation error occurred: %s',
    $validator->errors()->first()
  ));
}
```

This may not be the most elegant solution, but it stops the loop.
Validation failures on these routes tend to be rare in practice, so showing the first error is enough information.

You could also override `getRedirectUrl()` instead of `failedValidation()`, which lets you keep Laravel's normal flash-and-redirect flow.
But then you need to have a location to redirect them to, and also a way to show error messages.
I don't think that's worth it if this is a non-standard user flow and the result of good defense in depth coding.

_This post has been edited from the original for accuracy._
