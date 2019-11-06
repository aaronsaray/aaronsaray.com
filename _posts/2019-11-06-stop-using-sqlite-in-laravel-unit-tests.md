---
layout: post
title: Stop Using Sqlite in Laravel Unit Tests
tags:
- php
- testing
---
**tldr;** Using Sqlite in Laravel (or most PHP apps) for unit testing causes false positives in unit tests.  Things that work will not work when you move to production and use a different db like MySQL.  Instead, spin up a test database that is the same tech and engine as your application will be.

First, let me start out saying I'm super happy to see that you're doing unit testing - way to go! Laravel has introduced a lot of developers to the world of unit testing by making testing utilities a first class part of the framework. This is great! But, we need to make sure that we're that our sense of security we're gaining from our unit tests is true.

One of the mechanisms that Laravel suggests for unit tests revolves around using a Sqlite database for your data store. To make it even faster and easier, the in-memory database is configured.  This works fine for 95% of the situations. But, the devil is in the details, in that 5%.

Let's talk about the reasons why this is not the best choice.  For this setup, I'm using a brand new Laravel 6 application (v6.4.1) and Sqlite on MacOS (v3.29.0).  I've configured PHPUnit by adding the following line to the `<php>` key of `phpunit.xml`: `<server name="DB_CONNECTION" value="testing"/>`. In the `config/database.php` file, the following configuration is used:

```php
'testing' => [
  'driver' => 'sqlite',
  'database' => ':memory:',
  'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
],
```

### Issue: Type Safety

Type safety or type accuracy is very important. PHP developers (and other languages like Javascript where there can be type coercion) can become complacent - because doesn't `6` kind of, sort of equal `"6"` anyway?  This becomes a problem, though, when you consider `4.5` should not equal `4`.  

Equality is one concern, but another is data integrity.  In this example, I am going to store information about a Car.  I want to know if it's easy to get into.  2 Door cars are harder to get into than 4 door cars.  So, let's see my model:

**`app/models/Car.php`**
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Car
{
  protected $guarded = [];

  public function isEasyToGetInto(): bool
  {
    return $this->doors > 2;
  }
}
```

And our migration:

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class BlogTestSetup extends Migration
{
  public function up()
  {
    Schema::create('cars', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->tinyInteger('doors');
      $table->timestamps();
    });
  }
}
```

Finally, our test that **passes.**

```php
<?php
namespace Tests\Unit;

use App\Models\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MyTest extends TestCase
{
  use RefreshDatabase;

  public function testEasyToGetInto(): void
  {
    $userInput = 4.5;

    $car = Car::create([
      'doors' => $userInput
    ]);

    $this->assertTrue($car->isEasyToGetInto());
}
```

Yay - the tests pass!  But here's the problem. If you look at our `$userInput`, you'll notice that it's a float.  Our database is a tiny **integer** - so this is a type mismatch.  Sqlite allows us to insert this into our database even though it's not the proper type.

To verify, here is the description of the sqlite database:
```
select sql from sqlite_master where name='cars';
CREATE TABLE "cars" ("id" integer not null primary key autoincrement, "doors" integer not null, "created_at" datetime null, "updated_at" datetime null)
```

If we look at a dump of a newly retrieved instance of this model, we will see this:

```
#original: array:4 [
  "doors" => 4.5
  "updated_at" => "2019-11-01 20:34:09"
  "created_at" => "2019-11-01 20:34:09"
  "id" => 1
]
```

Now, I know what you're thinking: "That's not a big deal because you can clearly see the variable is set wrong."  But, keep in mind that this is a contrived example. The user input could be the result of some math you do that returns a float when you normally expect it to be an integer. 

Now, you're probably running MySQL in production.  In this case, something different than your test setup will happen. When you retrieve the data back from your database, or get a fresh model, you'll get the int value instead (because that's what was stored).

```
 #original: array:4 [
  "id" => 1
  "doors" => 4
  "created_at" => "2019-11-01 20:38:37"
  "updated_at" => "2019-11-01 20:38:37"
]
``` 

This inconsistency can cause a number of problems (if even as simple as `$userInput` does not equal `$car->doors` anymore.)

### String Length

String length on columns is ignored.  Let me show an example of something that could happen to you.

First, our migration created a table with a trim that is 3 characters in length:

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class BlogTestSetup extends Migration
{
  public function up()
  {
    Schema::create('cars', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('trim', 3);
      $table->timestamps();
    });
  }
}
```

Our model looks something like this:

```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{  
  public const TRIM_XLT = 'XLT';
  public const TRIM_SE = 'SE';

  public const TRIMS = [
    self::TRIM_SE,
    self::TRIM_XLT,
    self::TRIM_SPORT,
  ];
  
  protected $guarded = [];
}
```

We like to refer to `Car::TRIMS` for our trims list.  Now, we're expanding our line up and adding `Sport` as a premium option.  We need to be able to test if the car is a premium option as well.  Let's modify our model.

```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{  
  public const TRIM_XLT = 'XLT';
  public const TRIM_SE = 'SE';
  public const TRIM_SPORT = 'Sport';

  public const TRIMS = [
    self::TRIM_SE,
    self::TRIM_XLT,
  ];
  
  protected $guarded = [];
  
  public function isPremiumTrim(): bool
  {
    return $this->trim === self::TRIM_SPORT;
  }
}
```

Now, let's write a quick test:

```php
<?php
namespace Tests\Unit;

use App\Models\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MyTest extends TestCase
{
  use RefreshDatabase;

  /**
   * @dataProvider premiumProvider
   */
  public function testIsPremium($trim, $expected): void
  {
    $car = Car::create([
      'trim' => $trim
    ]);
    $this->assertSame($expected, $car->isPremiumTrim());
  }

  public function premiumProvider(): array
  {
    return [
      [Car::TRIM_SE, false],
      [Car::TRIM_XLT, false],
      [Car::TRIM_SPORT, true],
    ];
  }
}
```

Running this with our Sqlite testing database, we have nothing but green, green green.  Each test passes successfully.  So, we should be good to use this new trim in production, right?  **Wrong!**

What happens when we insert the `Sport` trim in our database when we use MySQL?  Well, it was only 3 characters in length, so we get an error: `String data, right truncated: 1406 Data too long for column 'trim' at row 1`.

### Foreign Keys

For a while, Sqlite didn't support foreign keys.  Old timers will remember this and immediately shun Sqlite because of this.  Well, that's no longer the case.  Yes!

However, there are a couple of things to remember.  Sqlite can be compiled without Foreign Key Support or it can be turned off.  Luckily, most recent copies of Sqlite are configured and supporting this feature.

But let's take a look at a scenario where this will cause failure. Imagine that your Sqlite is configured not to use foreign keys (and let's be honest, how many times have you checked to see if it was configured this way? ... yeah me either)  

Our data migration:

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class BlogTestSetup extends Migration
{
  public function up()
  {
    Schema::create('makes', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('name', 128);
      $table->timestamps();
    });

    Schema::create('cars', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('make_id');
      $table->foreign('make_id')->references('id')->on('makes');
      $table->string('model_name', 128);
      $table->timestamps();
    });
  }
}
```

And our test:

```php
<?php
namespace Tests\Unit;

use App\Models\Car;
use App\Models\Make;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MyTest extends TestCase
{
  use RefreshDatabase;

  public function testSomethingContrived(): void
  {
    $make = Make::create([
      'name' => 'Ford'
    ]);

    //$makeId = $make->id;
    $makeId = 44; // here is our mistake

    $this->assertNotNull(Car::create([
      'make_id' => $makeId,
      'model_name' => 'Pinto',
    ]));
  }
}
```

When you run this without foreign key constraints, it will pass.  It obviously shouldn't.

To fix this problem, you'd need a new compiled version of Sqlite.  If you already have the support, you may need to turn it on by issuing the statement `PRAGMA foreign_keys=on`.

At least the good news is that the inverse is compatible: disabling foreign key checks exactly the same using `Schema::disableForeignKeyConstraints()`.

### Lack of User Authorization

One of the nice things about Sqlite is that it doesn't deal with all of those pesky user permissions and authorizations. I jest, but this is important to understand.  

As your application grows in size and complexity, you might find yourself using multiple SQL users or read and write connections.  Where this becomes a problem is when you meant to write a record but you grabbed the read-only connection.  With Sqlite, it will 'just work.'  But, when you get to production, you'll start getting permission errors.

### Special Queries

Eloquent is a great ORM, but there are some things it just doesn't support. These might be things that are unique to only one specific database engine, or they might be things that are just too unique, rare or hard to implement in ORM code.  Other times there are things that you can do with Eloquent or the query builder, but they're inefficient. It might just be better to write a raw SQL statement.

If you find yourself using `DB::raw()` that's a good indicator that you're going to have problems using a database that's a different engine than what you're using in production.

In the past, I've seen people just not test this section of the code.  I'd argue that this is some of the most important code to test because it's so unique and non-standard.  You can still write the tests, but your test tool has to use the same database engine to be an accurate representation.

### It's Just Not The Same

As much as we like ORMs like Eloquent that let us swap out databases whenever we want to, that's not really that realistic.  Rarely do we push a whole application into a different database engine without some alterations or a significant rewrite.  You might swap frameworks, but you probably stick with MySQL (for example).

When it comes to our tests, which are supposed to be our gatekeeper and the most accurate of code we write, we suddenly throw all of that out the window?

Using Sqlite for your tests - if you're not using it in production - is just not the same.

The speed is different.  (And it's not that much slower to use MySQL vs Sqlite when running your unit tests.) The connection style is different (if you've ever battled between `localhost` vs `127.0.0.1` with MySQL, imagine then a whole different database engine - even more complexity).  And chances are, you've already configured one "production-like" database for your development anyway.

If you're using something like [Valet](https://laravel.com/docs/6.x/valet), the set up is super easy. Just open your MySQL admin tool and create another database. Boom, done.  What about [Homestead](https://laravel.com/docs/6.x/homestead)?  Simple - just add another line in your `Homestead.yaml` file's `databases` key.  Using a [Docker Compose](https://docs.docker.com/compose/) set up? Simple, just duplicate your MySQL container and change the container name.

For a professional developer, there really is no excuse.

### End Notes

Besides these things I've demonstrated and described, there are a number of other things that Sqlite doesn't implement or does in a quirky way. You can check out the list of [SQL Features that SQLite Does Not Implement](https://www.sqlite.org/omitted.html) or get more information on the [quirks of Sqlite](https://www.sqlite.org/quirks.html) on the official Sqlite documentation website.

Just take the few minutes to set up an identical testing database. It's not that much slower and it will help your tests be more accurate.
