---
title: "Docker Healthcheck Values for Laravel Projects"
date: 2025-09-22
tag:
- docker
- laravel
- linux
- misc-web
- mysql
- nginx
- php
---
Docker provides the [HEALTHCHECK](https://docs.docker.com/reference/dockerfile/#healthcheck) instruction for Dockerfiles and Docker Compose files. 

While not absolutely required, configuring these can make your IDE and environment more robust and verbose.

Here's what I use with some common containers in Laravel projects.

<!--more-->

These all can be defined in your `Dockerfile` or your `docker-compose.yml` - check the documentation for the proper syntax.

**PHP-FPM** When using a PHP-FPM image, specifically an Alpine Linux PHP-FPM image, use this HEALTHCHECK

```shell
HEALTHCHECK --start-period=2s CMD pgrep -f php-fpm\:\.pool | grep . || exit 1
```

In this version, I'm waiting 2 seconds, then running a command with the default HEALTHCHECK loop time of 5s intervals and 30s timeouts. Simply, look for the fpm pool - or exit with an error code.

**MySQL** For my MySQL image, I will generally specify this is the `docker-compose.yml` file. You can then use your credentials you defined above.

```yaml
healthcheck:
  test: mysqladmin ping -h 127.0.0.1 -u $$MYSQL_USER --password=$$MYSQL_PASSWORD
  start_period: 3s
  timeout: 2s
  retries: 50
```

This defines the intervals and the timeouts. Then, you can see that the `mysqladmin` binary runs a `ping` command with the credentials. If this pings, it passes, and then it's alive.

**Redis** For my Redis Alpine-based container, I define a Docker compose entry like this:

```yaml
healthcheck:
  test: redis-cli --raw incr ping
```

Simply using the `redis-cli` binary that is included to ping the instance.

**NGinx** For Alpine NGinx containers, I use the following HEALTHCHECK.

```shell
HEALTHCHECK --start-period=2s CMD wget -O /dev/null -q -T 2 http://127.0.0.1/robots.txt || exit 1
```

This tells the container to use `wget` to retrieve the local IP addresses' `robots.txt` file (or any file you know that exists and is served by NGinx). If it doesn't serve, exit with an error code. Otherwise, it's healthy.
