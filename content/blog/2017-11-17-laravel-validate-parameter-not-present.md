---
title: Validate Request Parameter Not Present in Laravel 5.4
date: 2017-11-17
tags:
- php
- laravel
---
You can make use of guarded or fillable attributes in Eloquent models in Laravel to help control what values you might allow to be updated via your API.  But, I wanted to go a step further and actually stop certain values from being passed in.  You could go pretty wild with this and try to block everything, but that's not what I did. I made this validator.

<!--more-->

This is useful in two ways: first, whenever a field was deprecated and not used, I wanted to invalidate API calls with that value now.  All of my clients should have been moved over, but just in case, I wanted to stop the value from coming in.  The second way this is valuable is if you want to accept some values in a post, but not in a patch or vice versa. (If you kept validation in request files directly this might not be such a problem, but I opted to share/save my validation on my model to keep this all domain knowledge all in one area.)  Anyway, I ramble.

Here's how you'd validate that a field is not present in Laravel 5.4 (the version is mentioned because the most recent Laravel has a different format of validator.)

**`app/Validators/NotPresentValidator.php`**

```php
<?php
/**
 * Validator to test that the value isn't present
 */
declare(strict_types=1);

namespace App\Validators;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Arr;

/**
 * Class AnyBooleanValueValidator
 * @package App\Validators
 */
class NotPresentValidator
{
  /**
   * This is invoked by the validator rule 'not_present'
   * 
   * @param $attribute string the attribute name that is validating
   * @param $value mixed the value that we're testing
   * @param $parameters array 
   * @param $validator Validator The Validator instance
   * @return bool
   */
  public function validate($attribute, $value, $parameters = [], Validator $validator = null): bool
  {
      return !Arr::has($validator->attributes(), $attribute);
  }
}
```

This is then registered using `extendImplicit` on the `Validator` class in the app service provider:

```php
Validator::extendImplicit('not_present', NotPresentValidator::class);
```

Extend implicit is needed because we are saying we want to validate on a field that doesn't exist.  If we didn't do this, it would never check for a field that doesn't exist - basically a chicken+egg issue.  This solves it by running validation on a field whether it exists or not.

Finally, I added an error to the validation language resource file.

**`resources/lang/en/validation.php`**
```
'not_present' => 'The :attribute field should not be present in this request. (It may be deprecated.)',
```