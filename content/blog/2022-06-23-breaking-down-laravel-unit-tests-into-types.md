---
title: How to Break Down Laravel Unit Tests into Types
date: 2022-06-23
tags:
- php
- laravel
- testing
---
What's the difference between unit test, integration test, and a feature test? Which should you use for what type of test? Is it just preference or does performance factor in when using Laravel? Let me give you my take from over a decade of unit testing experience.

<!--more-->

First of all, let's talk about the definitions of these terms. We're going to focus on four terms: unit test, integration test, feature test and external test. There are even more (smoke test, e2e test, dusk tests, etc...) but we're going to focus on these because they fit nicely in our Laravel ecosystem.

All of these things are broadly called unit tests.  Really, a more accurate way to refer to them would be automated tests.  The idea is that we write code to automatically test other code.  So, let's break down the types that I use in my Laravel project.

### Unit Test

A unit test is the simplest form of test. You write a test that takes the smallest part of a piece of code and tests the outcome from possible inputs.  Think the size of one method on a class - or a simple function.  A default Laravel project even provides a folder and example test for these.  Laravel's default `ExampleTest` in the `tests/Unit` directory doesn't even load the entire application kernel. It's meant to convey that these are the simplest forms of testing.

A way to look at this is that you should be only testing the smallest part of code, or the thing that makes roughly, at max, one decision. Preferably you're writing your methods simple anyway, so this is easy.  (In fact, proper unit testing actually helps you write cleaner code - because clean code is required for simpler, faster unit tests.) Let's take a look at an example where our default Laravel user model has a first and last name, and we want to get a display name - which is first name and last initial.

```php
class User extends Authenticatable
{
  public function getDisplayName(): string
  {
    return trim($this->first_name . ' ' . substr((string) $this->last_name, 0, 1));
  }
  // snip
```

Our unit tests would be the very simplest version of this. I can think of a few cases... I want to test the output of `$user->getDisplayName()` when...

* first_name is not empty, last_name has more than one character
* first_name is not empty, last_name has 1 character
* first_name is not empty, last_ name is empty
* repeating these all with first_name being empty

They're very simple tests of the smallest amount of code possible.  

Like I mentioned, in the default implementation of the Laravel unit test folder, it doesn't even implement the `CreatesApplication` trait.  And maybe that's the best default scenario. In real life, however, I tend to blur the lines a little bit.  I will test the smallest piece of code that sometimes use the Laravel framework as well.  (I trust that Laravel works as expected because it is properly tested, so I can assume when I use it, it's going to work as expected).  Sometimes, it's necessary to have the Laravel app loaded... for example - let's say I wanted to test a gate I wrote.  As long as that gate doesn't hit the database, this is fine: it can be a unit test.

For this example, let's say we have a gate that verifies if a user can search location-based results. Right now, that check is simple - they have to have a zip code. (In the future it might be based on their plan, some other things, who knows.). We make the following gate:

```php
Gate::define('can-search-location-based', function (User $user) {
  return $user->zipcode !== null;
});
```

This is another place where I could write a small unit test.  Technically it's requiring that we load the Laravel application, but that shouldn't require anything that integrates anywhere - it's just heavier.  So, what would our unit test look like?

```php
public function testUserCanSearchLocationBased(): void
{
  $user = new App\Models\User();
  $user->zipcode = '12345';
  
  self::assertTrue($user->can('can-search-location-based'));
```

See, just a quick small test - so it's a unit.  

Now, what if that Gate required that we query the database?  That's integration testing.

### Integration Test

I define an integration test as integrating two separate sets of contexts.  A context to me means one of our code, our database, our redis, etc...  This "concept" doesn't appear in the standard Laravel project install.

In practice, most often this is just something that connects with the database, but doesn't execute a whole user flow. It's a middle ground.  For example, you might have an end point that queries 4 different types of Eloquent scopes, processes user inputs and displays outputs. That's too much for integration - that's a feature test. But think about all of the set up that's required to test that. Maybe each scope requires tons of different databases entries to be created and many services to be mocked. That takes a lot more work and that takes a lot more runtime for the tests.

Because of this, I use integration tests.  These are your mid-level, and sometimes very detailed tests.  Let's take a look at our updated Gate as an example:

```php
Gate::define('can-search-location-based', function (User $user) {
  return $user->subscriptions()->contains(Subscription::PREMIUM);
});
```

Now, our gate is doing some sort of query against the database to determine if this user has the premium subscription.  We now move to integration tests, so we can boot up the application and use factories to generate data. (Note that we're not fully testing an end point).  We test these integrations with all of the scenarios we can think of because they're faster to run (less setup).  We might test:

* user under test has no subscriptions: false
* user under test has premium subscription: true
* user under test has premium subscription and basic subscription: true
* user under test has basic subscription: false
* user under test has basic subscription, second user in db has premium subscription: false

That last bullet point is an example of things that should be tested (are we sure we're targeting the right user? What if our gate was just searching the first user, or any user, with premium) but are hard to really set up for a full end point test. Why would I need to do a search through a full end point with processed data, when really I just want to check one instance of the gate's logic.

Anyway, the point of integration tests are to test integrating our code with one other context. Most often, I find this to be the database layer. I will test scopes, gates, services that group together multiple actions and more. I just won't use a full set of user-provided (or mocked) inputs and measure outputs from the application. That's a feature test.

### Feature Test

A feature test is a way of saying a full end to end test in the context of our PHP code.  Provided this URL, user state, application state, and user input, what output do I get with what side effects? It's still in our 'unit test' umbrella in a way - so make sure you don't start moving from end point to end point in one test. (That's something different, outside the scope of this article.). You're testing an API end point, or a controller method, or a console command one time only.

Laravel provides a feature test folder with an example test. It shows how you might load an URL and process the response of it.  

Feature tests are a great place to set up realistic application and user states, and pass in data, and test the result.  The benefit of the tooling we have in Laravel is we can use factories to set up data states - we don't have to process all of this through end point calls on our application.

Let's break down what I might test on a store end point for a blog entry.  The blog entry is created by a logged in user, it has a title that is required but may not be longer than 255 characters, and a body that is required and may not be longer than 65535 characters.  I would write separate, unique tests for each of the following bullet points.

* unauthorized user posts to /store gets 403
* authorized user posts to /store
  * no fields fails with 422
  * title and body fields empty strings fails with 422
  * title field 256 characters, body field 65536 characters, fails with 422
  * title field and body field set as array values fails 422
  * title field 'the-title' body field 'the body here' succeeds, test new blog entry with those values appears associated with current user as a model

That's just the basics of a feature test.  Now, you might repeat this for editing (including checking for permission to edit that, and making sure it overwrites the proper blog entry.)

> Fun tip: Sometimes... rarely... I write a set of tests and they run successfully immediately. For the most part, even after all these years, that freaks me out. So, I go to my code and specifically edit it (temporarily) so my test will fail and run my tests again. If they continue to pass, I know my test is targeting the wrong thing. If they fail, then I know I just am "that good" this one time.

Feature tests may also do things that integrate with third party APIs or have complex sets of relationships between eloquent models.  One of the benefits of the integration test layer for the eloquent models is that we've tested their functionality thoroughly (and much faster).  Therefore, we only need to write Feature tests that are unique enough to indicate that those proper scopes are being called. If we know that, we can reasonably assume (not always, but reasonably) that the integration tests will then cover the uniqueness and edge cases.

When it come to third parties, feature tests should mock them out.  Generally, I tend to wrap a third party call in a service (even if I'm using Laravel's mockable HTTP facade.).  Then, this is injected with Laravel's dependency injection. This allows me to mock it out.  Let's say that our service has a method called `executeSearch()` which takes a string, queries FooDotCom and returns a results object.  That has a key called `results` which has the count of results.  In my end point I test that to see if I should display the results or show a message saying nothing was found.

I might have a test like this:

```php
public function testFooDotComReturnsNothing(): void
{
  $term = 'what??'
  
  $this->mock(FooDotComService::class, function ($mock) use ($term) {
    $results = (object) ['results' => 0];
    $mock->shouldReceive('executeSearch')->once()->with($term)->andReturn($results);
  });

  $response = $this->get(route('search-foo', ['q' => $term]));
  $response->assertOk();
  $response->assertSeeText('There were no results.');
}
```

Here we search for the term `what??` and tell the service to pretend it had queried the external service.  We mock the results and then test how our code handles that third party result.  We don't actually hit the third party.

You still need to test that your third-party or external dependencies are functioning as expected. But, you don't have to do this very often compared to how often you should be running the rest of your unit tests.  In fact, your core unit tests should **never** be hitting external services in my opinion.  (I tend to configure PHPUnit environment variables in the xml file to failing values, so that it doesn't accidentally load in my local environment's sandbox credentials and hits an endpoint without me knowing.) That's why we have a separate suite called external.

### External Tests

Following along with our FooDotCom external service, let's talk about actually executing the search.  I tend to make a separate folder, a separate `phpunit.xml` file with the proper environment variables, but use the same framework as a feature test case.  By default, this won't run all the time. By using the Laravel tools, though, we can still achieve most of the things we need easily.  This is where we would test the different methods of how our service hits the external third party.  I might only run this on the `main` branch continuous integration - right before I deploy - to make sure that my third party hasn't changed on me.

With our example, I would probably only have three external tests for our service:

* sending invalid search data into the service (like a blank string) returns a results object with results key equalling 0.
* search a term that we know can never be found, should have zero results
* search a term that we know always will be found (hopefully with a predictable amount of results, but definitely above 0).

These would be done by actually asking for the service, which our combination of PHPUnit environment variables and Laravel dependency injection make possible.  For example:

```php
public function testExecuteSearchFindsResults(): void
{
  $service = app()->make(FooDotComService::class);
  $responseObject = $service->executeSearch('blueberries');
  self::assertIsObject($responseObject);
  self::assertGreaterThan(0, $responseObject->results);
}
```

### End Notes

The point of breaking up these tests into different types is two fold.

First, it allows us to think clearly about the types of tests and how to split up our code into simpler blocks. In order to write good unit tests, you have to write good units of code.  In order to have integration tests to test specific scenarios, you have to think in the form of repeatable scopes, not inline queries.  In order to write good feature tests, you have to have services to mock out, thereby reducing third party coupling.

Second, it can help our test suite run faster in total.  Feature tests always take longer to run because they must load the whole environment, run middleware, process input, call databases, process output, and finalize the application.  Integration tests always take longer than unit because they hit the database, and while databases and transactions are fast, they're not as fast as simple PHP code.  Unit tests are fastest because they should only be checking a few small pieces of code and decisions.  External tests take the longest because they're hitting a third party.  We're reasonably certain the third party is honoring it's contract of keeping things the same, so we don't need to hit them all the time.

This is just my experience after 20 some years of programming, and more than a decade of actually using unit tests. It doesn't mean it's the only way, but it hopefully inspires you into thinking about how you should structure your project.