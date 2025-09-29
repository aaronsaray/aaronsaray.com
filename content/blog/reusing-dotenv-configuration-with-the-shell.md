---
title: "Reusing DotEnv Configuration with the Shell"
date: 2025-09-29
tag:
- php
- scripting
---
A common security pattern is to add environment-specific configuration and secrets into a local, unversioned file. You're probably already doing this with a tool called DotEnv. Let's see how we can reuse that between PHP and the shell.

<!--more-->

If you're using Laravel, or any other recent framework or PHP project, you're probably familiar with the [DotEnv](https://github.com/vlucas/phpdotenv) project. If you've ever copied a `.env.example` file to `.env` then you are!

Basically, we can use the `.env` file to specify local environment variables for our PHP script - as long as DotEnv is loaded and being initialized.

Sometimes it's necessary to use those same variables with other tooling - like local shell scripts.  Luckily, this is very easy!

Here's the situation.  At the root of our project, we have our `.env` file with a URL variable. Then, we have a `bin/ping` script that will ping our project via that URL.  We don't want to have to specify it twice.  Let's see how this works.

{{< filename-header ".env" >}}
```ini
APP_URL=https://my-website.local
```

{{< filename-header "bin/ping" >}}
```shell
#!/usr/bin/env bash

source "`dirname $0`/../.env"
ping $APP_URL
```

Now, your environment variables are available to the script as well. When you call the `dirname` command, you get the current directory of the running script. Since we know where it's located, and where our `.env` file is, we can then use that
to source it.  This then makes all of the variables available in the current environment.
