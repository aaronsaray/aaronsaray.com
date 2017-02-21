---
layout: post
title: Laravel Command to Generate Swagger Documentation
tags:
- php
- laravel
---
If you're not using [Swagger](http://swagger.io/) (or OpenAPI) yet to document your APIs, you should start.  It's pretty simple to get started - especially in PHP.  I recommend using the [swagger-php](https://github.com/zircote/swagger-php) package - it's pretty easy.  Just use annotations, and then generate the Swagger definition when you're done.

Now, let's say you're totally immersed in the Laravel ecosystem - and you'd like to use `artisan` to generate your swagger docs.  Well, you can use a couple of the packages out there - but they really seem like bloat to me (a lot of features that I don't want.)  All I really want is one quick command that scans my `app` folder, and outputs the `swagger.json` file to my `public` directory.  Boom and done.

So, check out this little bit of code - maybe you'll find it useful in your project:

**app/Console/Commands/Swagger/Generate.php**  

```php
<?php
/**
 * Generate the swagger docs
 */

namespace App\Console\Commands\Swagger;

use Illuminate\Console\Command;

/**
 * Class Generate
 * @package App\Console\Commands\Swagger
 */
class Generate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'swagger:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Swagger Docs and put them in /public';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $swagger = \Swagger\scan(app_path());
        $swagger->saveAs(public_path('swagger.json'));
    }
}
```

To generate your docs, simply run `artisan swagger:generate` and you're done. (Don't forget to version control your `swagger.json` file!)
