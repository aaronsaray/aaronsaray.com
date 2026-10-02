---
title: "Add a healthcheck to your local MySQL container"
date: "2026-01-13"
tags:
  - docker
  - mysql
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-01-13-add-a-healthcheck-to-your-local-mysql-container"
  canonical: true
---

When you start your Docker containers, the database container might be "running" before MySQL is actually ready to accept connections.
A healthcheck solves this by verifying the service inside the container is responsive.

<!--more-->

In local development, this gives you a quick visual indicator.
Run `docker ps` and you will see "(healthy)" in the STATUS column when the healthcheck passes.
In PHPStorm, the Services tab shows a green checkmark for healthy containers.

Here's an example for the official MySQL image:

```yaml
database:
  image: mysql:9.0.1
  environment:
    MYSQL_ROOT_PASSWORD: supersecretpassword
    MYSQL_DATABASE: laravel-app
    MYSQL_USER: appuser
    MYSQL_PASSWORD: secretpassword
  healthcheck:
    test: mysqladmin ping -h 127.0.0.1 -u $$MYSQL_USER --password=$$MYSQL_PASSWORD
    start_period: 3s
    timeout: 2s
    retries: 50
```

The healthcheck uses `mysqladmin ping` to verify MySQL is responding.
Notice the double `$$` before the environment variables.
Docker Compose uses `$VAR` for its own variable interpolation, so `$$` escapes it and passes a literal `$` to the container's shell.
This way, the container resolves `$MYSQL_USER` at runtime instead of Docker Compose trying to resolve it during parsing.

This example works with the official MySQL image, but may work with other MySQL-compatible images as well.
