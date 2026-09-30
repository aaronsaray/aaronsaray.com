---
title: "Use a local script before falling back to global commands"
date: "2026-01-05"
tags:
  - scripting
  - docker
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-01-05-use-a-local-script-before-falling-back-to-global-commands"
  canonical: true
---

I have `npm` installed globally on my machine.
But in some projects, I have a local `./npm` script that wraps `docker exec` to run `npm` inside a container.

<!--more-->

Here's what that looks like in one of my projects:

```bash
#!/bin/bash
docker exec -it myproject-node npm "$@"
```

This is convenient because I can type `./npm run dev` and it just works, running inside the container.
But sometimes I forget the `./` prefix and accidentally run the global `npm` instead. Tons of errors and confusion ensue.

What did I do to fix this? If you're using `zsh`, it's simple: add a function to your `~/.zshrc` that checks for a local script first:

```bash
npm() {
  if [[ -x ./npm ]]; then
    ./npm "$@"
  else
    command npm "$@"
  fi
}
```

Now when I type `npm run dev`, my shell checks if there's an executable `./npm` script in the current directory.
If so, it runs that.
Otherwise, it falls back to the global `npm` command.

The `command` keyword is important here.
It tells `zsh` to run the actual `npm` binary, not our function.
Without it, you'd get infinite recursion.

After adding this to your `~/.zshrc`, reload it with `source ~/.zshrc` or just open a new terminal.
