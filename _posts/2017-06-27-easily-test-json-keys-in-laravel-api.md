---
layout: post
title: Easily Test JSON Keys in Laravel API Response
tags:
- PHP
- phpunit
- laravel
---
In my Laravel application, I have an end point that will retrieve a collection of Client models.  I have many other unit tests that validate that my repository returns the proper clients when requested, that my client model is sound.  My last test is a feature test checks that if I retrieve a list of clients from the end point there is proper pagination and client models exist.  I don't really need to test the exact values because I know this will work - from all my other tests.

So, my goal is simple.  Call `/clients` and validate that the pagination is valid.  Additionally, validate that the returned data is in the format of a Client model.

Let's see an excerpt of this test then:

```php?start_inline=1
public function testGetPaginationResult()
{
  factory(Client::class, 15)->create();

  $response = $this->json('GET', '/clients');
  $response->assertJson([
    'total' => 15,
    'current_page' => 1,
    'per_page' => 10,
    'from' => 1,
    'to' => 10,
    'last_page' => 2
  ])
  ->assertJsonStructure([
    'data' => [
      '*' =>  array_keys((new Client())->toArray())
    ]
  ]);
  $response->assertStatus(200);
  
  // more assertions here...
```

The important parts are tested with exact values.  I want to make sure that there are 15 results (after all, my factory created 15 users).  Are we on the proper page? Is it limited correctly?

But the interesting part is that we can then check the JSON structure with the built in test helper method from Laravel called `assertJsonStructure` - which will require this response to have a `data` key which is an array.  Every array - signified by a `*` should have the following keys.  

Previously, I'd pick just a few keys (like ID, name, city) and check if those exist.  If so, it was probably accurate.  However, I've come up with a more precise way of doing it. 

When the API processes the models, it calls the `toArray()` method to convert the values into JSON.  So, we can do this same thing with a brand new empty model - and then call `array_keys` on those values.  Remember, we're just looking for the structure, not necessarily the values.

I should again remind that this works for _me_ because I have a set of unit and integration tests that cover the rest of my controllers and actions.  If you do not split up your tests into unit, integration and feature tests, you might be missing test cases if you just test on structure, and not on values like I'm doing here.