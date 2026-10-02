---
title: "Trimming Filament Strings Globally"
date: "2026-10-02"
tags:
  - filament
  - laravel
context:
  - Laravel 13
  - Filament 5
---

When I first started using Laravel, I really didn't like the global middleware that trimmed strings. But after a while, it became an irreplaceable part of my tool belt, and I am a convert.

I became so used to this that the first time a user used my Filament input and I saw a space after some text, I was really confused. Why did this happen?

Let me tell you how to fix this on the form itself, how to do it globally, and what that might cause a problem with.

<!--more-->

First, let's take a look at the middleware stack inside of Laravel 13. I just want to review one piece. It's configured in `Middleware::getGlobalMiddleware()` in the Laravel project itself.

```php
public function getGlobalMiddleware()
{
  $middleware = $this->global ?: array_values(array_filter([
    \Illuminate\Http\Middleware\ValidatePathEncoding::class,
    \Illuminate\Foundation\Http\Middleware\InvokeDeferredCallbacks::class,
    $this->trustHosts ? \Illuminate\Http\Middleware\TrustHosts::class : null,
    \Illuminate\Http\Middleware\TrustProxies::class,
    \Illuminate\Http\Middleware\HandleCors::class,
    \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
    \Illuminate\Http\Middleware\ValidatePostSize::class,
    \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
    \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
  ]));
}
```

`TrimStrings` is being registered for everything. (As a reminder, you can customize - or remove - your `TrimStrings` in the `bootstrap/app.php` file.)  

This is disabled in Filament (because of Livewire) - it turns off that middleware for its requests. There are obvious reasons for this - but that's beyond the scope of this entry.

The point is, you have to write it on individual fields yourself.

Let's see what a `name` field might look like before.

```php
return $schema
  ->components([
    TextInput::make('name')
      ->required()
      ->maxLength(255),
  ]);
```

Very simply, this just takes the name, validates the length, and saves it to the record.

Sending in `aaron` results in `aaron` as the saved data. Send in `aaron ` and now the saved data is `aaron `.

## Solving String Trimming on a Single Filament Field

We can solve this on the field itself by just adding the `trim()` method.

```php
return $schema
  ->components([
    TextInput::make('name')
      ->required()
      ->trim()
      ->maxLength(255),
  ]);
```

Now, the data is trimmed before it is sent/saved.

This is awesome... but now I have to rely on adding this for every field. 

Why would I even want to do that, though? Don't I want this to happen to every field?

## Solving String Trimming Globally for Filament

Well, there is a way to do this. We can add a global configuration in the `boot` method of a service provider. Like this:

```php
use Filament\Forms\Components\TextInput;

TextInput::configureUsing(function (TextInput $textInput): void {
  $textInput
    ->dehydrateStateUsing(function (?string $state): ?string {
      return is_string($state) ? trim($state) : $state;
    });
});
```

Simply, this adds a `dehydrateStateUsing` callback to all `TextInput` fields. If it's a string, it trims it and returns - otherwise just sends it back.

Perfect, tested and it trims them all.

### One Caveat for This Solution

There is one thing I have to remind you of, though. Since you register this here, it's the `dehydrateStateUsing` callback for all `TextInput` fields. If you need to customize your own, you will define that on the field itself. Don't forget to call `->trim()` yourself then - as there is only one callback, not a stack.
