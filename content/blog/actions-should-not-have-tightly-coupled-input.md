---
title: "Actions Should Not Have Tightly Coupled Input"
date: 2023-10-12T13:54:05-05:00
tag:
- laravel
- php
- programming
---
If you're going to use an [Action](https://laravelactions.com/) pattern for your application, be careful what you expect coming in as input.  In fact, input should be loose and output should be tightly coupled. Let me explain...

<!--more-->

This entry focuses a lot on the Laravel-specific implementations of an Action-based design pattern - but it's not limited to Laravel. Any PHP, or that being said NodeJS or any other MVC-esque language and framework also fall until this umbrella.

## What's the Problem?

So, what's the problem?  

In a standard MVC type application in Laravel, you may have some logic inside of a controller - or a model - and find that that's not as flexible as you might like. Say that you allow multiple routes or workflows to do your said action - like purchase and confirm a subscription.  After a bit of copying and pasting, mixing in traits, and other shenanigans, you might find that you lean towards moving this into an Action class.  Other times, programmers choose to do this right away - even when the functionality is not shared anywhere.

That's usually where our problem rears it's ugly head: tightly coupled input.

What do I mean?

Well, let me give a pseudo code example I saw the other day.

```php
public function store(SubStoreRequest $request)
{
  $sub = \App\Actions\Subs\Create::make($request);
  return redirect()->route('user.subs.manage', ['sub' => $sub]);
}
```

In this controller, an action called `Create` uses a static method `make()` which accepts the `SubStoreRequest` class that Laravel injected. This request class likely contains validated data.  If we look at an example implementation of the `make()` method, we can see the problem hopefully.

```php
public static function make(SubStoreRequest $request): Models\Sub
{
  $sub = Models\Sub::create($request->validated());
  SomeQueuedEvent::dispatch($sub);
  return $sub;
}
```

In this very contrived example, you can see that we take the validated data (yay for validation!) and create a new `Sub` model. Then some other logic happens - perhaps a queued event, or other manipulation - and then the `Models\Sub` is returned.

The problem here is that you still have the same logic that could have been in the controller - just moved to another class - with no benefit. Matter of fact, this currently is probably worse because it's moving code around with no benefit at all (and don't say 'well I don't have to scroll so much in my IDE' - split the screen. You're welcome ;) )

I like that the return is tightly coupled - it's always going to be a `Sub` model.  But the incoming data can only come from one request object - so unless you're going to share this request object for every route and controller that uses this action in it (don't!), you have a one-use-only Action.  

## What's the Fix?

So how do you fix something like this? 

Well with all programming tips, there's some nuance and some art to it.  So, I'll give you a couple options - and you can pick the one you want.

But before we get to those, let's dismiss a few false-starts.

**Don't type hint the incoming parameter.** Yeah, you could remove that, but you're going to make code safety and static analysis a lot harder. Come to think of it, if you don't type hint anything (not even the base `FormRequest` or some interface you make), you may run the risk of someone (or yourself!) injecting an array or some other object in there that doesn't have the `validated()` method - or that doesn't return the same shape of data.

**Make a new action for every instance and they all proxy forward and accept their own unique form requests.** Yeah, maybe. You're getting closer. But I think that this is a lot of complication just for the sake of using a chosen pattern. If you're going to use Actions, you probably are more of a composition-based programmer. The idea of then using traits or inheritance seems a little at odds with that.

So let's talk about options.

**Pass an array into the `make()` method always.** This is one option.  Since we know that we'll likely use this action with form requests and those all have a `validated()` method usually - and we can specify the format of the data in the form request - we could just make it an array.

```php
public static function make(array $subData): Models\Sub
{
  $sub = Models\Sub::create($subData);
  SomeQueuedEvent::dispatch($sub);
  return $sub;
}
```

Then, you can do something like this:

```php
public function store(SubStoreRequest $request)
{
  $sub = \App\Actions\Subs\Create::make($request->validated());
  return redirect()->route('user.subs.manage', ['sub' => $sub]);
}

public function specialDeal(SubSpecialStoreRequest $request)
{
  \App\Actions\Subs\Create::make($request->validated());
  return redirect()->route('special-deal.confirmed');
}
```

So you can now use this `Create` action in many places.  You don't need to tightly couple them to the incoming form request.

_But with all solutions, there is some pro's and cons._ As you can see here, you don't really have any control of the incoming data. In fact, some programmer could send in something like `make(['ding' => 'dong'])` and that would 'work' but generate an error most likely.

**Pass a data object into `make()`** This is another option. Here we're swinging to the potentially opposite side of the spectrum - that is, making it more difficult.  This solution might be great if you're part of a large team (see: 10+ programmers all on the same project - or very high turnover - or non-invested consultants.). 

Let's take a look.

```php
public function store(SubStoreRequest $request)
{
  $subCreationData = new \App\DO\SubCreation($request->validated());
  $sub = \App\Actions\Subs\Create::make($subCreationData);
  return redirect()->route('user.subs.manage', ['sub' => $sub]);
}
```

And then your `make` method might look like this:

```php
public static function make(DO\SubCreation $subData): Models\Sub
{
  $sub = Models\Sub::create($subData->payload());
  SomeQueuedEvent::dispatch($sub);
  return $sub;
}
```

In this case, maybe our `SubCreation` data object knows how to take an array (in this case from the `validated()` method) and then somehow convert it into the format that our Eloquent model needs. The `payload()` method probably converts the existing data, formulates it, filters it, whatever it has to do - to get to a good position for the model.

_This seems like overkill._ I'm not going to lie - I've done this sort of stuff in the past, too. But that was when I was dealing with multiple data sources that had equal footing (data entry, salesforce, mailchimp).

**Using custom methods on your Action** Somewhere in the middle is the next approach.  Let's take a look.

```php
public function store(SubStoreRequest $request)
{
  $sub = \App\Actions\Subs\Create::fromStore($request);
  return redirect()->route('user.subs.manage', ['sub' => $sub]);
}

public function specialDeal(SubSpecialStoreRequest $request)
{
  \App\Actions\Subs\Create::fromSpecial($request);
  return redirect()->route('special-deal.confirmed');
}
```

Here we're using the same action, but we're using specifically crafted methods on the action.  The `make()` method can still be there - with any sort of specification and hinting you require - but you maybe work just with public static methods that are designed for specific requests.

Let's see:

```
public static function fromStore(SubStoreRequest $request): Models\Sub
{
  return static::make($request->validated());
}

public static function fromSpecial(SubSpecialStoreRequest $request): Models\Sub
{
  $data = $request->validated();
  if (Carbon::now()->after('2024-01-01')) {
    $data['promo_id'] = 2;
  } else {
    $data['promo_id'] = 1;
  }
  return static make($data);
}

protected static function make(array $data): Models\Sub
{
  $sub = Models\Sub::create($data);
  SomeQueuedEvent::dispatch($sub);
  return $sub;
}
```

In this example, if it's a normal subscription store, it's just a simple proxy from the type-hinted form request to the protected `make()` method.  But, if it's the special discount subscription, depending on the date, we can add in a promotion ID as well.  Then, that information is passed to the `make()` method.

Now, we have a sort of contract in the fact that we only have public methods that can accept specifically defined classes to be formulated properly.  We still have the `make()` method available - which could actually become public if we really wanted.

This example demonstrates a middle ground. Keeping logic all in the same action for parsing the incoming data _may_ make it easier to keep in mind the format of the data array.

## No Seriously, What's the Solution?

Hah!  Ok - so not only could you do one of those three solutions, you could also make static methods on the Eloquent model to parse the data properly and hook onto model events to dispatch queued events or jobs and bypass all of these choices directly as well.

So what's the right answer?  

Not one really. But the point is to take a look at what you're doing and determine if you should be doing it. Are you using Actions because you think it's a good idea or you have a legit need?  Are you creating data objects out of a desire to make very strongly typed relationships and contracts - or just because you don't want to forget what keys an array needs?  Do you use controllers as a very specific simple proxy, make them fat, or something in between?

I don't know if I have the right answer.  But I can tell you what I normally do.

I don't normally reach for Actions. However, I will if I have enough actions that have to happen in order that follow a specific workflow. Others might use a service class - which I've used in the past.

Controllers tend to take user input and prepare it from untrusted user input in a logical human shaped data structure to validated, filtered and confirmed predictable structures for my domain logic.  Then controllers also make all decisions ahead of time and pass those values with their output (likely a view or a resource).

I use observers for data that needs to be current (like MySQL triggers but in application code). I use events in controllers to indicate that an action has occurred - whether or not I have used an actual Action class.

And then sometimes I don't. :)

Remember, our projects are nuanced, it's both engineering and art. Have a reason for your choices that make sense for you, your team and the project requirements. Technology toolboxes are secondary - they should help you obtain your coded vision, not direct it.
