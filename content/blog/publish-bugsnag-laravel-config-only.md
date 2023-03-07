---
title: Publish Bugsnag's Laravel Configuration Only
date: 2021-11-14
tag:
- php
- laravel
---
If you follow the [instructions to customize the configuration of Bugsnag's Laravel package](https://docs.bugsnag.com/platforms/php/laravel/#basic-configuration), they'll tell you to run `vendor:publish`.  But this is not what I want.

<!--more-->

This may actually publish more things than just their package's details.

Instead, you can easily limit this to their configuration only by targeting their service provider with the following command:

```bash
php artisan vendor:publish --provider="Bugsnag\BugsnagLaravel\BugsnagServiceProvider"
```

Now, it will only publish the `config/bugnsag.php` file.