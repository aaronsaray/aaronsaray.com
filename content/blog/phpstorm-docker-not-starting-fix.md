---
title: "PHPStorm Docker Not Starting Fix"
date: 2025-05-31T18:33:45-05:00
tag:
- docker
- phpstorm
---
Recently, I had an issue with PHPStorm not detecting my Docker configuration. I was using Docker Compose and everything worked fine with docker cli and Orbstack. Why wouldn't PHPStorm recognize this? It's a simple fix, actually. It has to do with the name of your project. Let me explain.

<!--more-->

In my docker compose file, I've named my project. This is great. It works well with the multiple projects I have locally. When I do `docker ps` I can nicely see each project named with its dependent services quite easily.

However, when I configured PHPStorm to use my existing docker container instance, it kept failing. It could not find the running instance.  This is weird because I see it running in the command line and also in the Services pane.

It turns out, the issue was the name of the project in docker compose coupled with a legacy deprecated API that PHPStorm uses to monitor the containers. [This was described in this ticket](https://youtrack.jetbrains.com/issue/WI-71204/Failed-to-start-docker-compose-service-start-it-in-a-command-line-and-retry) - and the solution is simple (although it should just work...).

All you have to do is specify the name you've used as an environment variable in the CLI interpreter for your dockerized PHP.

Add `COMPOSE_PROJECT_NAME` to the environment variables of the configuration.  This will help it properly connect to the existing instance using `docker-compose exec`

My project name in my `docker-compose.yml` file was `skunkwork-app` so I've set the value to `COMPOSE_PROJECT_NAME=skunkwork-app` and we're good to go!
