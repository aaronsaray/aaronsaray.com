---
title: Command to Quickly Show Config in Laravel
date: 2021-12-21
tag:
- php
- laravel
---
What if you need to see your config quickly in Laravel from the command line? And you don't want to use Tinker? Let me show you how I do it...

<!--more-->

First of all, I'm not sure if I should even write this entry. I kind of feel like this is cheating or not a "best practice" but I can't put my finger on it.  Maybe it's because it's never really a good idea to be plastering secrets to the screen.  But anyway...

[I don't install Tinker on my production machine]({{< ref "/blog/do-not-use-tinker-in-production" >}}), so in that same vein it feels like I shouldn't have a command to 'debug' config. But, if you're caching your config, and you've ever forgotten to update it correctly, you know the struggle.

So, I wrote a quick command that I use:

```php
namespace App\Console\Commands;

use Illuminate\Console\Command;

class ShowConfig extends Command
{
  protected $signature = 'config:show {key? : Only get this one key}';

  protected $description = 'Shows the config';

  public function handle()
  {
    if ($specifiedKey = $this->argument('key')) {
      $loop = [$specifiedKey => config($specifiedKey)];
    } else {
      $loop = config()->all();
    }

    foreach ($loop as $key => $config) {
      $this->info($key);
      dump($config);
      $this->newLine();
    }

    return Command::SUCCESS;
  }
}
```

Then, I can run `php artisan config:show` to see all of the config dumped out to the screen.  Or, if I just want to see a specific key, I can run something like `php artisan config:show services` to see the `services` key.

Breaking it down, the command creates an array of either all of the config - or just a single key if the argument is specified. Then, it outputs an info line with the key name followed by dumping the config to the screen.  Finally, a new line.

Again, reminder, do not run this where other people can see - you're likely exposing your secrets to the screen.