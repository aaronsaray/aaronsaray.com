---
title: The Many Ways to Remove a Composer Package
date: 2019-04-22
tag:
- php
- composer
---
Turns out there's a few different mechanisms to remove a package from your composer project.  It's important to understand what each method does and what its side effects are.

<!--more-->

```bash
composer remove my/package
```

This removes the package from the filesystem, removes it from `composer.json` and executes an **update** on all of the rest of the packages as part of it's dependency reconciliation.  This might not be what you want.

```bash
composer remove my/package --no-update
```

This only removes the package from your `composer.json` file.  It does not execute an update, so that's good.  But, it also leaves the package on the local filesystem.  This can be confusing - especially with IDE autocompletion - because you'll have different local files than the next install.

Remove the line from `composer.json` yourself and then execute `composer update my/package`.  This will remove the package from the filesystem but will not execute an update on the rest of the packages. You've already removed it from `composer.json` yourself so you're set.
