---
title: Adding CSV Responses to Laravel Using Macros
date: 2018-08-03
tag:
- php
- laravel
---
Laravel has a lot of the most common functionality built into the framework.  However, decisions need to be made to balance the needs of the majority of use cases with the stability and agility that programmers need.  No one really wants a bloated library.  Because of this, you might find that you need functionality that is not directly built into Laravel.  When I started working with Laravel-based CSV responses, this was the case.  (This article is based on Laravel 5.6.)

<!--more-->

### The Problem

I’ve been building out API endpoints to handle JSON responses using the built-in method `Request::wantsJson` and the response type `JsonResponse` like this:

```php
if ($request->wantsJson()) {
  return response()->json($myPayload);
}
```

Now I need to build some reporting-based endpoints that respond to requests for CSV data.  A quick look at the `response()` global helper and underlying `Response` facade shows methods like `json()`, `jsonp()`, `streamDownload()` and more. However, I don’t see something that appears to expose a CSV-based response type using the simplicity of my JSON method.

To keep my code consistent, I want to write the CSV response the same as the JSON one.  I imagine I’ll write something like this:

```php
if ($request->wantsCsv()) {
  return response()->csv($myPayload);
}
```

### The Solution

Luckily, the Laravel maintainers have implemented a way for us to extend built-in Laravel functionality using macros.  You can find documentation for macros on the [Response](https://laravel.com/docs/5.6/responses#response-macros) in the official Laravel documentation.  By examining the code, I found out that `Request` also supports this functionality.

I decided to add my CSV functionality as a macro to both the request and response objects using my app service provider. I’m using [The League CSV](https://csv.thephpleague.com/) to easily handle my CSV response (if you’ve dealt with different line-endings, encodings, complicated escape sequences and found yourself spending tons of time, wise up sooner than I have and use this library instead).

**AppServiceProvider.php** in the `boot()` method
```php
Response::macro('csv', function (array $value, int $status = 200) 
{
  if (empty($value)) throw new \DomainException('The CSV document must have content.');

  $csv = Writer::createFromFileObject(new \SplTempFileObject());

  $headers = array_keys($value[0]);
  $csv->insertOne($headers);
  $csv->insertAll($value);

  return Response::make($csv->getContent(), $status)->withHeaders(['Content-Type' => 'text/csv']);
});

Request::macro('wantsCsv', function () {
  $acceptable = $this->getAcceptableContentTypes();
  return isset($acceptable[0]) && Str::contains($acceptable[0], ['/csv', '+csv']);
});
```

First, I’m adding the method `csv` as a macro using the `Response` facade which will proxy it forward to the `\Illuminate\Http\Response` class.  Then, I do a bit of housekeeping.  In my use case, I’ve decided that this response should always have at least one row of associative array data.  (I won’t be calling this end point if there is no data to return; your use case may be different).  If there is not a first row, I’ll throw an exception.

After that, it’s time to use The League’s CSV writer and create a CSV document (your implementation of this might require additional configuration, so make sure to refer to the [documentation](https://csv.thephpleague.com/) for more help).  Then, retrieve the array keys of the first row to generate the first row of the CSV, the header row.  Then, complete the document by inserting all remaining data.

Finally, I create a response using the `Response` facade with the content of the CSV, my status code and the headers to support my content type of `text/csv`.

The second section of code adds a method of `wantsCsv` as a macro using the `Request` facade which will proxy it forward to the `\Illuminate\Http\Request` class.  This functionality has been shamelessly copied from the `wantsJson()` method, but altered to check for CSV.  (I can’t claim I’ve done anything original or interesting here).

Now, I’m free to use the request `wantsCsv()` and the `csv()` response methods in my project.

### Final Notes

As with any custom implementation, there are ways that this code works for me but may not work for you.  (For example, my CSV response doesn’t handle empty documents or additional headers.)  The important part here is to understand that you can add functionality into classes like `Request` and `Response` using macros.  For more insight into the macro functionality, I suggest checking out the [Macroable](https://laravel.com/api/5.6/Illuminate/Support/Traits/Macroable.html) trait that Laravel provides.

**One note of caution:** the more you use “magic” like the macro functionality, the harder it is for other people to follow your code.  IDE’s won’t be able to parse your new functionality automatically, so you’ll have to up your game at writing proper PHPDoc annotations. I recommend making use of the `@method` annotation if you’re using `Macroable` on your own classes.  You can find the documentation for that PHPDoc annotation [here](https://docs.phpdoc.org/references/phpdoc/tags/method.html).
