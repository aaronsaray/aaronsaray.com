---
title: "Phpstorm Terminal Lcall Error Fix"
date: 2025-12-05T15:39:43-06:00
tag:
- macos
- phpstorm
- scripting
---
When a new terminal opens in PHPStorm on macOS, I was getting a weird error: `bash: warning: setlocale: LC_ALL: cannot change locale (en_US-u-hc-h12-u-ca-gregory-u-nu-latn): Invalid argument.`. Strange, I use Oh My Zsh with the Zsh shell. Why am I getting that error? Why bash?  I could ignore it each time - but I wanted a fix.

<!--more-->

The first solution I came up with was to add some environment variables to the Shell / Terminal settings in PHPStorm. I exported my LC_ALL to an `en_us.UTF-8` style value - whatever was appropriate for me at the time. 

I found that it did fix the problem ... "fix"... but only in this one project. I would have to figure out how to globally set that setting in PHPStorm.  But I still didn't like it.

I wanted to understand why it was happening.

## The reason

In my `.zshrc` file I had some logic to evaluate the Python environment.  Something like `$(pyenv init -)` - and that was launching this bash process.

Then, PHPStorm would see that and not understand how to handle the new environment variable in bash - from macos - which is a BCP 47 locale identifier.  If this happened in PHPStorm, it could happen in other apps that try to launch my zsh shell too.  Hrm.

## The Solution

The solution that works for me (and notice, I said works for me, because I'm not sure if this is the "right" solution) was to alter my `.zshrc` file to unset the LC_ALL if it was something more complex. Then, it would fall back to the default en / us / utf-8 one.  Here's what I did

```bash
# Fix PHPStorm + macOS BCP47 locale issue before pyenv runs
if [[ "$LC_ALL" == *"-u-"* ]]; then
    unset LC_ALL
fi
```

Now, if it has that `-u-` based locale, it is unset and the fallback is allowable in my various software.

*Is this the right solution?* Is there a better one? Let me know!
