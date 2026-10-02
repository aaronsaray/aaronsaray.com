---
title: "Pluralization works in JSON language files"
date: "2026-08-25"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-08-25-pluralization-works-in-json-language-files"
  canonical: true
---

Laravel gives you two ways to define translations, PHP array files with short keys, or JSON files where the key is the default string itself.
Array files are nice when you want stable, namespaced keys you reference everywhere.
JSON files are nice when you don't want to invent a key for every string and you'd rather just write the English (or default) version inline.

I picked JSON on a recent project, and then I hit a moment that gave me pause.
I needed pluralization.

<!--more-->

For array files, the pipe syntax is everywhere in the docs:

```php
// lang/en/messages.php
'users_online' => 'There is :count user online|There are :count users online',

// lang/es/messages.php
'users_online' => 'Hay :count usuario en línea|Hay :count usuarios en línea',
```

But in a JSON file, the key is the string.
And keys feel like identifiers.
Putting a pipe character inside a JSON key felt strange enough that I had to stop and double-check it would actually work.

But, it does.
The syntax is identical, just shifted into the key position.

Here is `lang/en.json`:

```json
{
  "There is :count user online|There are :count users online": "There is :count user online|There are :count users online"
}
```

And `lang/es.json`:

```json
{
  "There is :count user online|There are :count users online": "Hay :count usuario en línea|Hay :count usuarios en línea"
}
```

And you call it the same way you would for an array file:

```php
echo trans_choice('There is :count user online|There are :count users online', $count);
```

Once you see it written out, the weirdness fades.
The pipe lives wherever the translatable string lives, key or value, and `trans_choice()` doesn't care which form you picked.
