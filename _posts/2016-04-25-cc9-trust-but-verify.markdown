---
layout: post
title: Trust, But Verify
tags:
- php
---
> This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news.

### Episode 9: Trust, But Verify

"Trust falls" are a team-building activity that some of my friends have had to endure.  I've been threatened with this exercise a few times.  But, I've never had to do it.  Luckily, I've been able to convince my team members I will participate without having to test their bicep and shoulder strength.  Or, perhaps I'm just not trusting enough.  (I once worked at a place that had a few employees that were really good friends and would force-trust-fall on each other.  When a group of colleagues were walking in a row, one would just throw himself backwards into the person behind him surprising them and shouting "trust fall!"  This was the only "trust fall" that I was forced to participate in.)  

If my team from work reads this, they're going to be dumbfounded.  "We thought Aaron trusted us!?"  Let me be clear, I do trust people.  I just don't trust programmers!  Ok, I'm kidding a bit here.  What I mean to say is that, as a Confident Coder, you should never blindly trust code and data.  Let me illustrate this with some examples.

#### Verifying a Data Type

In PHP, sometimes a variable is not the expected data type.  If you are expecting a different data type, the code you've written may halt with an error.  Or even worse, it will be a functional bug with unknown results and the code will still continue to execute.  

I personally find an unexpected data type very annoying.  (And, I've seen enough online rants about the loose-typing of PHP to know I'm not the only one.)  But before we get all angry, remember this can happen for a number of reasons.  It could be a mistake by yourself or your team.  It could also be a coding standard from a third party library that you weren't expecting.

So, for example, let's imagine that we're going to be calling a third-party library.  It will return an array of elements more than 99% of the time.  Every once in a while, it may return `null` if no results were found.  We might be tempted to write code like this:

```php?start_inline=1
$results = $thirdPartyService->fetchAll();

foreach ($results as $result) {
  echo $result['name'] . '<br>';
}
```

This code will expect an array from the `fetchAll()` method.  Normally this has an array of results to loop through.  However, in the very rare case that there are no results found, `null` is passed to the `foreach` loop.  This will give us an error:

    PHP Warning: Invalid argument supplied for foreach()

Fortunately (or unfortunately), the code will still execute after this error.  But, having a warning like this is not a desired outcome.  Using the trust, but verify mantra, let's add a guard statement.

```php?start_inline=1
$results = $thirdPartyService->fetchAll();

if (is_array($results)) {
	foreach ($results as $result) {
  	echo $result['name'] . '<br>';
	}
}
```

In our new version of the code, the `$results` variable is now checked to make sure it is of a type that the `foreach` loop can process.  If it is `null`, the loop never has a chance to evaluate.

#### Monitor Third Party Input

A very popular way to pass information between websites is the JSON format.  A PHP script can easily consume JSON data using the `json_decode()` method.  Let's see an example of how we might consume a third party data source.

```php?start_inline=1
$jsonString = file_get_contents('http://thirdparty.org/feed.json');
$jsonObject = json_decode($jsonString);

echo 'The name of the website we just consumed from:' . $jsonObject->name;
```

Previously, we've determined the format of the JSON object and can trust that the `name` property will always be populated with the site name.  There was that scary word again: trust.  Can you guarantee that the JSON feed will never change the object property to `site_name` - what would happen then?  Consider this code:

```php?start_inline=1
$jsonString = file_get_contents('http://thirdparty.org/feed.json');
$jsonObject = json_decode($jsonString);

if (isset($jsonObject->name)) {
	echo 'The name of the website we just consumed from:' . $jsonObject->name;
}
else {
	// log that the json decoding has failed
}
```

In our trust, but verify programming style, this code will now verify that the expected property is set.  If not, we'll notify and log an error so we can come and update the code.

Let me show another example.  This one is actually inspired by a real event that happened while I was programming a third-party integration a few years ago.  The scenario is simple: call a third party service and it reveals how many minutes have passed since a specific event.  Then, I formulate that into a human readable version and display it.  (Please note, there are other ways to do this, but I've created this code in this manner to illustrate the issue as clear as possible.)

```php?start_inline=1
$minutesPassed = $thirdPartyService->minutesSinceEvent($eventID);

$hours = floor($minutesPassed / 60);
$minutes = $minutesPassed - (60 * $hours);

echo "Time elapsed: {$hours}:{$minutes}";
```

This worked well for me: the hours and minutes were separated by a colon, a very familiar time elapsed format.  The `$minutesPassed` variable was always an integer of minutes.  So, if the value I received from the third party was `90`, `1:30` was displayed.

This third party saw how I was using the information and liked what they saw.  They decided to change their API response to mirror the output I had created.  So, instead of returning the integer of `90` like before, they now sent `1:30` to each API consumer.  Because I didn't verify (I should have tested `$minutesPassed` with `is_numeric()` for example), my code crashed as soon as they updated their API.

#### End Notes

Confident Coders know there is a difference between being trusting and confident.  Confident programming is knowing how a process or method should work.  Trust is implied in code, but trust can never be guaranteed.  Confident Coders know to follow the defensive programming mantra of trust, but verify to guarantee more accurate code.
