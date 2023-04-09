---
title: "Sort Nova Users on Spatie Role"
date: 2023-04-09T11:42:29-05:00
tag:
- laravel
---
The specific challenge is to sort users in a Laravel Nova application by their role.  For this specific example, though, we have a number
of assumptions. Although this article solves this very specific problem, you can probably extend it to apply to other custom data challenges
in Nova.  Let's check it out.

<!--more-->

## First, Assumptions

The setup for this is that we have a standard User model on the `users` table in Laravel.  We also are using the [spatie/laravel-permission](https://spatie.be/docs/laravel-permission/v5/introduction)
package.

The big assumption or unique thing to make this work is how this application will be using Roles. Although the roles relationship is a many to many (or a `BelongsToMany` in Nova/eloquent speak),
this application is ensuring that users will only have one role.  I've decided to expand the scope to allow for users who have no roles as well.

The important thing to note is that there are only User models that have roles, and users never have more than one role.

## Next, the task

So, we want to show roles on the detail page. We can allow people to manage them there. Ensuring only 0 or 1 is beyond the scope of this article.  

We also want to show the primary role (or the only role) on the index list.  Then, we also want to make sure that the list is sortable by that role name.

Let's see how we can do this.

## The Code

First, let's set up our data.  

### The Setup 

We have a standard Laravel install.  Then, we're going to ensure that the Laravel Permissions package is installed (you can check the Spatie documentation for that).  Finally, let's
seed in some users.  I've added the following to the database seeder.  It just creates some roles and some users with various settings.

{{< filename-header "database/seeders/DatabaseSeeder.php" >}}
```php
<?php
declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
  public function run(): void
  {
    $adminRole = Role::create(['name' => 'admin']);
    $regularRole = Role::create(['name' => 'regular']);

    User::factory(5)->create(['name' => 'admin ' . Str::random()])
      ->each(function ($u) use ($adminRole) {
        $u->assignRole($adminRole);
      });

    User::factory(5)->create(['name' => 'regular ' . Str::random()])
      ->each(function ($u) use ($regularRole) {
        $u->assignRole($regularRole);
      });

    User::factory(5)->create(['name' => 'none ' . Str::random()]);
  }
}
```

After this is done, we should have 15 users: 5 with admin roles, 5 with regular role and 5 with no role. I used random strings
as the names so that I could prefix their name with their role - just to quickly verify what we're working on.

Next, let's check out our Nova user resource.

{{< filename-header "database/seeders/DatabaseSeeder.php" >}}
```php
<?php
declare(strict_types=1);

namespace App\Nova;

use Illuminate\Database\Eloquent\Builder;
use Laravel\Nova\Fields\BelongsToMany;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class User extends Resource
{
  public static $model = \App\Models\User::class;

  public static $title = 'name';

  /**
   * Build an "index" query for the given resource.  
   * 
   * We introduce a primary_role_name for sorting.
   *
   * Note that this only works with a single role - or none.
   *
   * @param NovaRequest  $request
   * @param  Builder  $query
   * @return Builder
   */
  public static function indexQuery(NovaRequest $request, $query)
  {
    return $query->leftJoin('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
      ->leftJoin('roles', 'roles.id', '=', 'model_has_roles.role_id')
      ->select('users.*', 'roles.name as primary_role_name');
  }

  public function fields(NovaRequest $request)
  {
    return [
      ID::make()->sortable(),

      Text::make('Name')
        ->sortable()
        ->rules('required', 'max:255'),

      Text::make('Role', 'primary_role_name')
        ->sortable(),

      BelongsToMany::make('Roles'),
    ];
  }
}
```

Let me break down what we're doing here - from the most simple parts first, to the complex ones.

First, I'm only showing a few fields in this Nova resource. Yours likely has many more.  The important thing to note here is that
I am using the `BelongsToMany` relationship for `Roles` - this is normal. This is required because we want to be able to see
and manage the roles on the details page.  Remember, these belongs to many do not appear on the index page.

Next, I've made a text field called `Role` which is pointing to the `primary_role_name` field on the model.

There are two ways you can bring custom data into a nova resource: calculated fields or fields defined by properties on the eloquent model.
In our case, we're pointing to a property on the eloquent model.  But, this doesn't normally exist.  `primary_role_name` is not a field
in our database.  That's where `indexQuery` comes in.

The `indexQuery()` method is in the parent class and is allowed to be overwritten like this.  You can customize the details, the default sorting, basically
anything you want. Nova gives you access to the query that it's going to be running.

So, to get our extra data in, we're doing two left-joins. The first is against the table that defines the relationships between models and roles, and the second is the role
definition table itself.

Once we have that data, we modify the select statement. It was already going to get all of the fields needed in the `users` table (note: we could customize this even further
to get only the fields we need. Consider this article more of a proof-of-concept) and then add on our aliased joined table value.

Now, all eloquent models have all of the user data on them, plus one extra column that we've defined.  For models that don't have a role at all, the value will be null.

Since it's "recognized" as a field on the eloquent model, Nova now allows us to define it as `sortable()`.

## End Notes

Remember, this is a unique situation. We **only allow one or zero roles** and we're just doing a simple search.  If you have more complexity, you should be able to customize
this further. 

You're not limited to just the index query for customization, either. You can also do so on the detail and scout queries.  

Finally, I should point out that the beauty of Nova is that it allows you to jump start your administration development.  As time goes on, if you're doing more and more custom things like this,
Nova may not be the right tool for you.  A few customizations are fine - but if you find yourself overwriting every single index query or detail query, adding on extra 'fields' to eloquent to 
communicate state and joined properties, and just in general having to make certain assumptions and 'rules', Nova might not be the tool for you.  In most cases, though, little tweaks like this should help.