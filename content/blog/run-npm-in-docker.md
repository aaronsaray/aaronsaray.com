---
title: Run NPM in Docker
date: 2019-12-30
tag:
- nodejs
- javascript
- docker
---
For the most part, I've containerized all of my dependencies inside of my Laravel projects. But, one thing was missing: npm.

<!--more-->

I would use docker images for nginx, php and mysql (I even had another one for unit tests for mysql).  But, I never got around to containerizing my node and npm dependencies.  I didn't think it was too big of a deal - mainly because I only used the compiled versions anyway - until I upgraded my local node version and some of my older project's dependencies broke. I could no longer run the `npm run dev` or similar commands. Oh no!

Enter Docker - the way I should have been doing this to begin with.

One simple command line script, and I'm now using npm inside of docker.  Here it is:

{{< filename-header "bin/npm" >}}
```bash
#!/usr/bin/env bash

docker run -it --rm -e "TERM=xterm-256color" -v $(pwd):/usr/src/app -w /usr/src/app node:10-alpine npm "$@"
```

Now, I can run any command I want and it will run inside my containerized, predictable npm docker container.

`bin/npm run watch` for example will watch for changes and compile them.

Let's talk about what this actually doing.

First, we're using docker to run an image.  The image name is `node:10-alpine` which is basically saying "give me the latest release of node 10, but use the Alpine Linux as the base system."  This gives us a very small image.  

After the name of the image, we specify the command we want to run - in this case `npm` - and then using bash syntax, the `"$@"` adds on anything else that was passed on the command line to the invocation of this script.  That's how we can pass `run watch` to npm from outside of the script.

For the options, the `-it` indicates that it will be an interactive, terminal emulated instance.  The `--rm` means to remove the instance of this container when you're done using it.  (While that sounds expensive, it's only removing the instance of the container, not the image.  It's just basically garbage collection.).  The `-e` indicates the type of terminal emulation it should perform.  In this case, I wanted to bring forward the colors of the ANSI output of npm scripts.

Finally, the last two work together.  The `-v` indicates that we'll create a bound volume originating locally at our current working directory and mount that to `/usr/src/app` (which is somewhat arbitrary).  The `-w` command points basically to the same location as that bound mount point so we have access to all of our local files.