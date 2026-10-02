---
title: "Get the benefits of final classes in Rector"
date: "2026-01-15"
tags:
  - ide-and-web-dev-tools
  - php
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-01-15-get-the-benefits-of-final-classes-in-rector"
  canonical: true
---

[Rector](https://getrector.com/) is a powerful tool for automated code refactoring and upgrades.
Among its many features, it can enforce coding standards and apply fixes across your entire codebase.

One setting I find particularly useful is `->withTreatClassesAsFinal()`.
When enabled, Rector analyzes your code as if all classes were declared `final`, even when they're not.

<!--more-->

```php
return RectorConfig::configure()
  ->withTreatClassesAsFinal();
```

There's a whole debate about whether classes should be `final` by default.
I'll sidestep that.
But this setting helps Rector in a very useful and specific way.

It tells Rector to assume your classes won't be extended and this lets it make smarter decisions about method visibility and inheritance.
You get the stricter analysis without actually committing to `final` in your code.
