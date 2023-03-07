---
title: Stop Using Assert Database Has in Laravel
date: 2020-04-24
tag:
- php
- laravel
- phpunit
- testing
---
Please stop using `assertDatabaseHas` in Laravel.  There are many reasons why this is bad, and there are better options available.  Let's find out why.

<!--more-->

### Theory

So, it's very difficult to say "this is wrong" and be 100% certain. Titles like mine above are great for click-bait, of course, but they don't necessarily reflect the entire thought clearly. Let's talk some theory.

First of all, instead of never using `assertDatabaseHas`, I think it's likely I mean "you probably shouldn't."  There are some situations where it might be useful, but generally, not.  So, as with most advice, this isn't 100% black and white.

Anyway, let's talk about the theory of this and why it's not a great idea.

When you're working with Eloquent, you specify a table name - or it automatically figures it out.  Then, you forget about it.  In fact, if someone wants to refactor your database, that can be done with minor changes to your codebase - just change the property of the model to a new table name.  So, it's ideally designed for you not to have to know the name of the table.

This continues through the rest of the Eloquent configuration as well.  This is why you don't specify table names in relationships, but you instead point to another Eloquent model's class.

Laravel is architected, then, so that we don't have to know the names of our database tables.  With `assertDatabaseHas` you have to know the name of the table every time you use it.

Now, when you're writing your tests, you care about the end result of the business process, not the mechanics or implementation. By this I mean, you should be dealing with models directly when you're in the context of testing your app. 

Let me talk it through a different way:  I take model `Car`, send it into `UpgradeWheelsService`, and now I expect that I not only have a `Car` but I have 4 `Wheel` models.  Well, I could check the database.  But that means I need to understand what `car_id` might be - or - how the wheels are related to the car.  Instead, what if I just assert something on `$car->wheels()->count()` and make sure there are 4 of them now?  By doing that, we see that they're related (we don't need to know if the field name is `car_id` or maybe `auto_id`), we know there are 4 of them as we thought we'd have, and we know they're Eloquent models (we don't need to know what table they came from because we trust our relationship was created properly).

The method `assertDatabaseHas` could potentially provide false positives.  The calculation done in the method validates that the data retrieved exists more than 0 times. But, the eagle-eyed of you will see that weird wording actually means something: it could exist 2, 3 or 4 times. Imagine a scenario where you have two models in the database, execute an update, and your query was wrong - it updates all of the models.  Using this method will return a false positive - yes, it did change your data, but it changed everything else to match.

Finally, and this is a pretty far stretch, but I wanted to bring it up: you don't always know that your model is in the database.  It could be a remote model, like in Salesforce. When you're dealing with your models in your code, you really don't care where they come from. You enjoy the value that this is abstracted behind a PHP class. But, in your tests, you now need to understand how each is implemented?  That doesn't make sense.

### Practical

Let's see some examples of how to implement tests that test the models have been written to the database without calling the evil method.

The following before and after of our tests demonstrates how we follow the advice not to use `assertDatabaseHas`.

**`app\Models\Car.php`**
```php
<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
  protected $guarded = [];
}
```

**`app\Controllers\CarCreateController.php`**
```php
<?php
namespace App\Http\Controllers;

use App\Car;
use Illuminate\Http\Request;

class CarCreateController extends Controller
{
  public function __invoke(Request $request)
  {
    $c = Car::create($request->all());
    return $c->id;
  }
}
```

**`tests\Feature\CreateCarTest.php`**
```php
<?php
namespace Tests\Feature;

use App\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateCarTest extends TestCase
{
  use RefreshDatabase;

  public function testBeforeCase()
  {
    $data = [
      'make' => 'Ford'
    ];

    $this->post('/cars', $data);

    $this->assertDatabaseHas('cars', $data);
  }
}
```

In this very simple case, we're creating a `Car` through an endpoint.  We're testing with the `assertDatabaseHas` which is not recommended.  I can say, if you ignore all of the points I made above, this looks like a very simple, clean test.  But, just because code is small and concise, doesn't mean it's the best way.

Let's look at our suggested way of doing it instead.

**`tests\Feature\CreateCarTest.php`**
```php
<?php
namespace Tests\Feature;

use App\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateCarTest extends TestCase
{
  use RefreshDatabase;

  public function testAfterCase()
  {
    $data = [
      'make' => 'Ford'
    ];

    $result = $this->post('/cars', $data);

    $car = Car::find($result->content());
    $this->assertNotNull($car);
    $this->assertEquals($data, $car->only(['make']));
  }
}
```

Here, we're grabbing the ID from the response, and then using the Car model to retrieve it.  We assert we have the car model, and then validate the data as well.  In this way, we're not having to know what the database is.  Admittedly, it is more code, and that can seem unattractive.

Here's an even more vivid example of a test where we're updating a model:

```php
public function testUpdateWorks()
{
  $car = factory(Car::class)->create(['make' => 'Ford']);
  $otherCar = factory(Car::class)->create(['make' => 'Ford']);
  
  $update = [
    'make' => 'Alfa Romeo'
  ];

  $this->patch(route('cars.update', ['car' => $car]), $update);
  
  $car->refresh();
  $otherCar->refresh();
  
  $this->assertEquals('Alfa Romeo', $car->make);
  $this->assertEquals('Ford', $car->make);
}
```

In this example, we're executing our update via our endpoint with a named route.  Then, we call `refresh` on the model we intended to update, which will get the new data, and tested the data that way.  In addition, we also test that we haven't changed _all_ of the models by validating the other model has not changed.

### End Notes

There are many ways to test, with tons of different mechanism and methodologies. I'm glad you're testing at all!  But, I think it's best to stop asserting directly against a database when you don't need to. Especially since your code is not generally architected in Laravel to deal directly with the database, why would your tests?  Stay in your domain and test the input and output values, not the implementation.