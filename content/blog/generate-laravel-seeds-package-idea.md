---
title: "Generate Laravel Seeds Package Idea"
date: 2024-06-21T12:15:11-06:00
tag:
- ideas
- laravel
---
When projects don't have a proper set up of dev data using Laravel seeders, getting started can be kind of tough. And if you can help it, you really don't want to be pulling data from production. User data is precious and should be protected! So what kind of package or utility could help us here? Let me detail out my thoughts - maybe it's something you want to build!

<!--more-->

So the first issue is that we don't have Factories maybe?  There are tools like this package, the [laravel-factory-generator](https://github.com/TheDoctor0/laravel-factory-generator), that will help us here.

So, now, we just have to have the data.  

What if we could temporarily get access to the production database - by just one trusted programmer - and they could use a read-only connection and generate seeds from the data in production?

Now, I don't mean everything. But I do mean specific queries.

I envision a command where you can submit somehow a DB query - or set of queries - either using the DB facade or an Eloquent query (with joins, filters, wheres, etc) that you can then pass to this tool. It will then use your factories to generate seeds for your local development based on this.

So, here's a bit of pseudo code.

```php
$generator = new LaravelSeederGenerator\Generator();

$clients = App\Models\Client::whereIn('id', [44, 45]);
$users = App\Models\User::where('client_id', '=', 44);

$generator->write([$clients, $users]);
```

And this somehow writes a Seeder file with the data retrieved by these specific queries.

I'd definitely use this on new projects all of the time!

So if you're looking for your next open source project - or you're just getting started and want to build a portfolio - this is something I'd be very interested in!