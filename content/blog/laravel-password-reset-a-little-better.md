---
title: "Laravel Password Reset a Little Better"
date: 2024-03-27T12:02:33-05:00
tag:
- laravel
- security
- ux
---
There are a number of tools and packages that help you manage your users and their associated password reset flows available. The Laravel docs also describe a way that [you can reset your password in your own controller](https://laravel.com/docs/11.x/passwords#password-reset-handling-the-form-submission). Depending on the use case of the application, I end up having to use code like this in some applications when other packages won't work as drop-ins. But, can we make this example a little better, more secure, easier to read or a better UX? I think so. Let's go.

<!--more-->

So - let's look at the code in the example and dissect it.

```php
$request->validate([
  'token' => 'required',
  'email' => 'required|email',
  'password' => 'required|min:8|confirmed',
]);
    
$status = Password::reset(
  $request->only('email', 'password', 'password_confirmation', 'token'),
  function (User $user, string $password) {
    $user->forceFill([
      'password' => Hash::make($password)
    ])->setRememberToken(Str::random(60));
 
    $user->save();
 
    event(new PasswordReset($user));
  }
);

return $status === Password::PASSWORD_RESET
  ? redirect()->route('login')->with('status', __($status))
  : back()->withErrors(['email' => [__($status)]]);
```

Running through this real quick - we set the `$status` variable to whatever the `Password::reset()` returns.  The first parameter is the parameters necessary for Laravel to reset the password.  The next parameter is a call back that runs on successful current user verification.  Note that this function is if the user is identified correctly, but you still have to set the password yourself.

The callback takes the incoming user object, and a password. Then it force-fills a hashed password and sets a new remember token.  Then, it saves the user and issues a new event.

Later on, you'll see the user redirected to a login page if they're successful - or back if there are errors.

### Can We Make It Better?

First, let's define better. The first thing, code readability and quality. Second, security. Third, user experience.

The first thing is that I tend to do my validation in a Laravel Form Request, not inline in a controller. So, let's move those to a form request. In fact, let's take a look at our two files now after the refactor.

{{< filename-header "app/Http/Requests/UpdatePasswordRequest.php" >}}
```php
<?php declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
{
  public function rules(): array
  {
    return [
      'email' => [
        'required',
        'string',
        'email',
      ],

      'password' => [
        'required',
        'string',
        Password::default(),
      ],

      'token' => [
        'required',
        'string',
       ],

      'remember' => [
        'nullable',
        'boolean',
      ],
    ];
  }
}
```

Now, a couple things to notice about this request.  First, you'll notice that there is **no password confirmation** - what?? Honestly, I think we're past that. You should be using complex passwords with password managers. Or, you likely will run into problems typing a brand new password over and over and will likely only use the reset functionality again in the future. So, let's trust the user to type their password.

Next, you'll notice that the field `remember` is now added. I'm treating the reset password as a login page, too. I mean, **if we already know who the user is, and what their password is, what value does anyone get from them typing it again?** So, if we can trust them to reset their password, they should already be logged in. Remember this later.

Now, let's see our controller.

{{< filename-header "app/Http/Requests/UpdatePasswordRequest.php" >}}
```php
<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Api\UpdatePasswordRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class UpdatePasswordController extends Controller
{
  public function __invoke(UpdatePasswordRequest $request)
  {
    $validated = $request->validated();
    $remember = Arr::pull($validated, 'remember');

    $validated['password_confirmation'] = $validated['password'];

    $status = Password::reset($validated, function (User $user, string $password) use ($remember) {
      $user->forceFill([
        'password' => Hash::make($password),
        $user->getRememberTokenName() => null,
      ])->save();

      event(new PasswordReset($user));

      Auth::login($user, $remember);
    });

    if ($status === Password::PASSWORD_RESET) {
      return redirect(route('dashboard'))->with('success', __($status));
    }

    return back()->withErrors(['password' => [__($status)]]);
  }
}
```

So a couple notable changes here.  First of all, if we don't have the validated information, we won't even get into this controller.  Next, I get all of the validated information out of the form request, but I remember the remember me token. That's not useful for our `reset()` call.  Finally, since the built-in Laravel tools require a password confirmation, I'm just forcing that data into the `$validated` array myself.

The callback is a little different. I decided to get rid of the call to the token setting method to set it explicitly in the `forceFill()` I believe this gives us a better insight as programmers to understand what is happening. The user is updated with a null remember me token (just in case they had one earlier but maybe they're on a different computer. In the old version, this was set to another random value. I don't like that because I don't think it's accurate - and I wonder if there are any security implications. At this point, we want to reset their password and any chance that they could log back in again with old credentials or remember me.

Then, after the event is issued, I call the `login()` method with the `$remember` token. This way the user is now logged in, honoring their remember me preference (which is empty on false, or generated on true).

Finally, I just made the return statement more readable - and redirected them to the dashboard instead of a login page. They don't need to bounce around - we already logged them in.  This is a good example of how some code 'seems' or 'looks' nice or 'elegant' but is harder to read. This of course is subjective, but I believe that most programmers will read the if block easier/faster than the complicated ternary.

### End Notes

I think this made the reset password functionality - at least in this one very particular step - better. There are some (arguably) easier to read and follow code blocks, potentially clearing a security hole, and now don't require the user to do silly things that they don't need to do. You know, like type their password again - or - type it AGAIN to login.

This isn't the only way to do this - or maybe even the best. But one of the points I'm trying to make as well is that you can still modify the flows that Laravel provides. You can appreciate and use the toolset, yet slightly modify the functionality as your needs and preferences change.