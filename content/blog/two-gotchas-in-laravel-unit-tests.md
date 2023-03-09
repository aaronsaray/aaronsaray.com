---
title: Two Gotchas in Laravel Unit Testing
date: 2019-05-20
tag:
- php
- phpunit
- laravel
---
There's a struggle to balance the easy-to-use Laravel helpers and functions with very verbose, complicated methods in unit tests.  As I've been relying on Laravel's way of doing testing more, I've ran into a couple of gotchas that I should share.

<!--more-->

## Eloquent is function isn't exact

Eloquent models offer a function called `is()` which allows you to compare one model to another.  The method works by comparing the key, the table and the connection.  If they're identical, the first model _is_ the second model.

Its important to understand the definition of _is_ in this case.  It does **not** mean identical or the same **class**.

For example,

```php
<?php
$model1 = MyModel::find(12);
$model1->setType('bad');

$model2 = MyModel::find(12);
$model2->setType('good');

$model1->is($model2) === true;
```

In this case, model 1 is model 2, although the values in them are different.  So, they're the same source model, but they are not the same.

Also, take this example:

```php
<?php
class OneModel extends MyEloquentModel
{
  protected $table = 'our_table';
}

class TwoModel extends MyEloquentModel
{
  protected $table = 'our_table';
}

/** @var OneModel $m1 **/
$m1 = app('service.one')->giveMe(12);

/** @var TwoModel $m2 **/
$m2 = app('service.two')->giveMe(12);

$m1->is($m2) === true;
```

In this case, using inheritance, there might actually be different classes.  However, since the key, the table and the connection are the same, it'll appear that m1 is m2.

## Starting at 1 in Factory Unit Tests Gives False Positives

I often use the `factory()` method to generate different models for my tests.  Since I use a fresh database for my tests, oftentimes the models I get begin with an auto incrementing ID of 1.

However, when you do testing, you have to really test your end result for accuracy.  When you cut corners (like I sometimes do), you can get false positives, especially when you're checking with IDs from fresh databases.  Let me explain.

Our method will create a model, then attach two children to it.  Here is the unit test:

```php
<?php
public function testCreateWithChildrenValueSetAndChildAdded(): void
{
  $unrelatedElement = factory(Unrelated::class)->create();
  
  $child1 = factory(Child::class)->create();
  $child2 = factory(Child::class)->create();
  
  $parent = MyParent::createWithChildren('george', [$child1, $child2]);
  $this->assertEquals('george', $parent->name);
  $this-assertEquals(2, $parent->children->count());
  $this->assertEquals($child1->id, $parent->children->get(0)->id);
  $this->assertEquals($child2->id, $parent->children->get(1)->id);
}
```

Do you see the false positive here? `$unrelatedElement` and `$child1` have the same ID (because we start at 1).  There's nothing in this test that guarantees that the first element attached is `$child1` and not somehow `$unrelatedElement` - we need to test more detail.

If you really don't want to test more detail, I suggest you passing in ID's directly to the factory method.  Then, at least, there's a much better chance it's not overlapping a different model.