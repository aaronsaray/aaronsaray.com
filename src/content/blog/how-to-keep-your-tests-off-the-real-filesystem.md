---
title: "How to keep your tests off the real filesystem"
date: "2026-07-23"
tags:
  - testing
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-07-23-how-to-keep-your-tests-off-the-real-filesystem"
  canonical: true
---

Tests that read or write files can be really annoying.
I'll admit it, in the past I've skipped a few.
I just hate having to think about seeding the files, cleaning them up after, and don't get me started on the pollution left over when a test crashes before it can tear down.

<!--more-->

Laravel made this much easier with `Storage::fake()`.
It swaps the disk for a temporary one and handles all of that for you. Nice.

But what about code that never touches the `Storage` facade?
Let's say I have a command that streams a CSV and rewrites it as pipe delimited.
It uses raw PHP file functions for performance:

```php
public function handle(): void
{
  $input = fopen(config('imports.csv_input'), 'r');
  $output = fopen(config('imports.csv_output'), 'w');

  while (($row = fgetcsv($input)) !== false) {
    fwrite($output, implode('|', $row) . PHP_EOL);
  }

  fclose($input);
  fclose($output);
}
```

`Storage::fake()` does nothing here, because none of these go through the facade.
So how do I test this without writing real files?

This is where [`vfsStream`](https://github.com/bovigo/vfsStream) steps in.
Under the hood, every one of those file functions is really talking to a stream.
`vfsStream` registers its own `vfs://` stream wrapper, a virtual filesystem that lives entirely in memory.
Point your code at a `vfs://` path and the same native functions read and write to it like a real path, but nothing ever hits your disk.

The nice part is I can seed files into that virtual filesystem right when I set it up:

```php
public function testItConvertsACommaCsvToPipeDelimited(): void
{
  $root = vfsStream::setup('data', null, [
    'input.csv' => "item1,item2\nitem3,item4\n",
  ]);

  config([
    'imports.csv_input' => $root->url() . '/input.csv',
    'imports.csv_output' => $root->url() . '/output.txt',
  ]);

  $this->artisan('convert-csv')->assertSuccessful();

  self::assertSame(
    "item1|item2\nitem3|item4\n",
    $root->getChild('output.txt')->getContent(),
  );
}
```

No real files, no cleanup, and nothing left behind if the test crashes halfway through.
