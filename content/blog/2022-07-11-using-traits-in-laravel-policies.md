---
title: Use Traits in Laravel in Policies
date: 2022-07-11
tags:
- php
- laravel
---
I love using [Policies](https://laravel.com/docs/9.x/authorization#creating-policies) in Laravel. A particularly useful feature is the interception of checks. But what if only some of our policies need that? That's where we can judiciously use traits.

<!--more-->

Let's take a look at a simple policy for a Company model.  I want to authorize a user to view a company. It should check to see if there is a relationship between the user and the company.  We're going to skip all the implementation of the policies into Laravel and our workflow - and just look at the policy itself.

**`app/Policies/CompanyPolicy.php`**
```php
<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CompanyPolicy
{
  use HandlesAuthorization;

  public function view(User $user, Company $company)
  {
    return $user->companies()->contains($company);
  }
}
```

Simple, right? Now what about our admins?  We want them to be able to view every company.  But there are other things that we don't necessarily want them to be able to do (perhaps admins can look at companies, but they can't see the details of the financial bank accounts - no one can).  

You might use an interception with the `before()` method to handle this.  We have an easy solution if we want to apply this same check to all policies: we make a parent abstract class which contains a shared `before()` method.  But what if some of them don't actually need this?  Don't fall for the trap of making the parent class more complex.

Instead, create a trait and apply it only to the policies that need it.  Let's see the trait.

**`app/Policies/AllowAdminToDoAnything.php`**
```php
<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

trait AllowAdminToDoAnything
{
  public function before(User $user)
  {
    if ($user->hasAdminRole()) {
      return true;
    }
  }
}
```

This has the `before()` method that returns true on the user is an admin.

Now, we just modify some of our policies, like our `CompanyPolicy` - like so:

```php
class CompanyPolicy
{
  use HandlesAuthorization;
  use AllowAdminToDoAnything;

  public function view(User $user, Company $company)
```

As you can see, now this policy will allow admins to view any company, and others can share this implementation via trait.  Other policies are still free to do their own assessment of access for the admin.