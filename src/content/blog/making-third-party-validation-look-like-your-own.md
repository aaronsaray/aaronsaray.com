---
title: "Making third-party validation look like your own"
date: "2024-06-25"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2024-06-25-making-third-party-validation-look-like-your-own"
  canonical: true
---

You're a professional, so you write thorough and secure validation for every one of your forms. You confirm values are in the proper shape and type, and when appropriate, even query the database with rules like `exists`. But what do we do when we aren't the owners of that information? Let's dig in.

<!--more-->

Imagine you've made a deal with the fictional third-party payment provider called Spot to process payments for your users. They provide service in nearly all municipalities you operate in - except for a few. Each of those have custom rates and taxes for transactions. Luckily they provide an endpoint that returns this charge data or informs you that they don't operate there.

When users sign up on your service, all you ask for is a postal code. You have a database that maps these to more municipal areas for those third-party services that require more robust location information.

So, how do we validate that Spot provides service? Well, we certainly don't want to make two API calls (one in the form request to validate service, one in the controller to retrieve and use the rates), and storing results in a Form Request from this validation seems messy - almost like a single responsibility failure.

Most of the solutions I've seen end up requiring complex systems of sessions and additional Blade checks and components. Instead, I like to use the tools that Laravel already provides me. Plus, our users are now trained to see errors near the form fields anyway. Let's see how.

```php
public function store(StoreRequest $request, SpotService $spotService)
{
  $county = App\Models\County::wherePostCode($request->validated('post_code'))->sole();
    
  $rates = $spotService->getRates($county->city, $county->state, $county->postCode);
  if ($rates === null) {
    throw Illuminate\Validation\ValidationException::withMessages([
      'post_code' => 'We are unable to service this area at this time.',
    ]);
  }
    
  // do the rest of the process
}
```

Normally, Laravel uses the `ValidationException` to handle the failed rules in your form requests. The public static method `withMesssages()` is a nice helper method that creates an ad-hoc validator instance and populates your desired error in as a failure. Then Laravel takes over again and will take the user back to show them this third-party error in the same way as a local validation error.  Pretty cool, huh?
