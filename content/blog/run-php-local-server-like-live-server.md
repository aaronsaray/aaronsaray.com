---
title: "Run PHP Local Server Like live-server"
date: 2023-11-19T15:48:31-06:00
tag:
- macos
- php
- scripting
---
I'm a huge fan of the [live-server](https://www.npmjs.com/package/live-server) package for running local HTML servers to test my HTML and Javascript code.  What about if you want to run a local PHP server quickly to test something? That's easy. But I tend to forget the exact command - so I came up with a ZSH-based solution.

<!--more-->

I love being able to type `live-server` and know that it'll start up a server in the current directory, find an open port and launch the browser.  But what if I need to test a quick PHP file?  Of course I'm going to reach for the [built-in PHP CLI server](https://www.php.net/manual/en/features.commandline.webserver.php).

But what was the command again?  I just want to be able to type something like I do with `live-server` and get a PHP server running.

_The rest of this entry assumes you're using ZSH on a Mac.  However, it should work and apply to most other operating systems and shells with minimal changes._

## Use a ZSH alias

The simplest way to get close to what I want is to add a ZSH alias.  In order to do that, edit your `.zshrc` file and add the following to it:

```zsh
alias php-server="php -S localhost:8000 "
```

Then, source it again and you should be good to go.

```zsh
source ~/.zshrc
```

Sweet - now you have a locally running web server with PHP at localhost on port 8000 when you run `php-server`.

But we can do better than this, can't we?

## Use a ZSH function

Eagle-eyed readers may have seen that there was a space after the alias declaration.  This allows additional parameters to be passed to the command after the alias.  For example, we could run `php-server -t my-project/` and it would point to the `my-project` for the doc root.

I'm not interested in this, though. I just need something quick. I know that I'll be starting my PHP server always in the root where the files are located.  (You could expand the following code and solutions though to handle many other options like custom ports and custom doc roots. I'm just not doing that.)

Instead, what I want is to copy some of the basic `live-server` stuff - like picking an open port and launching the browser.

So, I'm going to create a ZSH function instead.

Go and edit the `.zshrc` file and remove the alias and add the following:

```zsh
function php-server() {
  local port open
  port=8999
  open=0

  until [ $open -eq 1 ]
  do
    ((port++))
    if [ $port -gt 65535 ]; then
      echo "Ports 9000-65535 are not available."
      return 1
    fi

    nc -z 127.0.0.1 $port &>/dev/null
    open=$?
  done

  {sleep 1 && open http://localhost:$port} &
  php -S localhost:$port
}
```

Again, `source` the file.  Now you should be good to go!  But, let's take a look anyway and explain the source (you shouldn't be running code you don't understand!)

First, we're defining a function named `php-server`. The idea is that it will find an open port starting at 9000 and then try to launch the PHP server.

So, we make a few local variables so we don't pollute the regular shell when this is ran.  I then set the port 1 value before where I want to start scanning and the open variable to a success value (0) which indicates a connection.  We want a 1 which means the port is available because nothing is listening.

(I'm not a shell scripter - so there are other things that could be done better I'm sure. For example, maybe a do while style instead of an until loop - or using lsof instead of netcat.  Definitely open to feedback!)

The until loop means it will run everything until that value evaluates as true. In the loop the port is increased.  Then, we check to make sure we haven't hit our limit. This is good defensive programming. Likely this will never happen - but I don't want a run-away command anywhere.  If will return an error status if it's looped through all of the ports and all of them are returning successful connections to netcat.

Next, netcat connects to the local IP with the port - and sends that output to dev null. (The `-z` tells it to connect, but not attempt to send anything.). Finally, `open` is assigned to the last return value of previous command.

Finally, once we've retrieved a port that works, we run two commands.  First, a sleep 1 and then opening the URL.  This is ran in the background.  The sleep is because it takes a split second for the PHP server to start - and once it starts, it keeps this function and the script open. So, we want to push a wait and open into the background so the next command - the PHP server command - can start.

Now when you run this, you should get a new URL and port combination that's available and it'll open your default browser just like `live-server` does.