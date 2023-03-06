---
title: Laravel 5.4 API/Request Validate Boolean
date: 2017-11-17
tags:
- php
- laravel
---
For some API work in Laravel, I wanted to validate that the incoming request parameter was a boolean value.  At first I tried using the built in `boolean` slug validator but it didn't accept all of the 'boolean' values I wanted to use.  (Also there were weird scenarios where string values of `false` were triggering as true - like what I wrote about [here]({% post_url 2017-05-23-in-php-false-is-sometimes-true %}).

<!--more-->

In Laravel 5.4 (I mention this version because Laravel has recently updated so this validator format may not be the best anymore), I made the following validator:

**`app\Validators\AnyBooleanValueValidator.php`**
```php
<?php
/**
 * Validator to test for any boolean value, not just ones that is_bool() tests for.
 */
declare(strict_types=1);

namespace App\Validators;

use Illuminate\Contracts\Validation\Validator;

/**
 * Class AnyBooleanValueValidator
 * @package App\Validators
 */
class AnyBooleanValueValidator
{
  /**
   * This is invoked by the validator rule 'any_boolean_value'
   * 
   * @param $attribute string the attribute name that is validating
   * @param $value mixed the value that we're testing
   * @param $parameters array 
   * @param $validator Validator The Validator instance
   * @return bool
   */
  public function validate($attribute, $value, $parameters = [], Validator $validator = null) {
    return in_array($value, [
      '1', 1, "true", true, 'yes', 'on', 
      '0', 0, "false", false, 'no', 'off', ''
    ], true);
  }
}
```

Then, I registered `any_boolean_value` in the AppServiceProvider using the following line:

```php?start_inline=true
Validator::extend('any_boolean_value', AnyBooleanValueValidator::class);
```

Finally, I added an error translation in the validation language resource file.

**`resources/lang/en/validation.php`**
```
'any_boolean_value' => 'The :attribute field must be a boolean type value. (Try true or false, 1 or 0).',
```

Now I can use that slug for validation on boolean values to allow in "acceptable" boolean values.

