---
title: "Customize Laravel Ide Helper to Autocomplete Blade Files"
date: 2025-12-17
tag:
- laravel
- phpstorm
params:
  context:
    - Laravel 12
    - PHPStorm 2025.3
---
I'm working with [Yajra DataTables](https://github.com/yajra/laravel-datatables) in a Laravel project and I've ran into a little bit of a headache. They provide their own `render()` method, which you pass a blade file to as the first parameter. Something like `users.dogs.index` - and through that mechanism it loads the proper blade for the datatable.

Here's the problem, though. I can't get auto complete and I can't click through on that in PHPStorm. But I want to. Let's find out how.

<!--more-->

First, the most important thing: this requires that we have [Laravel IDE Helper](https://laravel-idea.com/) installed (this was a paid plugin but is [now free for PhpStorm users](https://blog.jetbrains.com/phpstorm/2025/07/laravel-idea-is-now-free/) and comes as part of PHPStorm). Then, we want to work with its custom `ide.json` file. This will help tell the IDE + plugin some more configuration steps. Plus, since it's a versioned file, everyone on your team gets the same settings. (Don't like it? Don't commit the file - or git-ignore it then - just like sharing or not-sharing the .idea folder).

Let's take a look at how I solved the problem.

{{< filename-header "ide.json" >}}
```json
{
  "$schema": "https://laravel-ide.com/schema/laravel-ide-v2.json",
  "completions": [
    {
      "complete": "viewName",
      "condition": [
        {
          "classParentFqn": ["Yajra\\DataTables\\Services\\DataTable"],
          "methodNames": ["render"],
          "parameters": [1]
        }
      ]
    }
  ]
}
```

This targets the parent class - which is the datatable class that I extend all of mine off of.  Then, when we call `$dataTableInstance->render()` it will target the first parameter of that method (that's the condition).  The task is to 'complete' the 'viewName' which is basically the blade file.  Now, when you type in that method, you'll get the same autocomplete you get if you were to use something like `view()` directly.  As an added bonus, you can now click-through as well.
