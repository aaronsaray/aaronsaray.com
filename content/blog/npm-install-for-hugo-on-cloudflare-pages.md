---
title: NPM Install for Hugo Theme on Cloudflare Pages
date: 2023-02-06
tag:
- javascript
- hugo
---
You've created a nice Hugo-based theme which uses Node dependencies. Time to deploy on Cloudflare pages, but it won't recognize you need to do an NPM Install. What do you do?

<!--more-->

## Why

First of all, the why.  Why are you using Node dependencies?  Well that's simple - you might be using something like Bootstrap and you want to use ES Build to remove the code you're not using, tree shake, minify, etc.

Is this always a problem? 

No, not really.  By default, Cloudflare pages will understand you have Node modules to install if you have a `package.json` in the root of your project.  But, since I plan to cycle through themes in Hugo, and each may use different dependencies, I don't necessarily want all of them installed.  I want to keep my themes componentized (maybe I want to distribute them at some point).  

Point is, there is a way to get this to work - but it's not the way I want to structure my code.

## How Do You Do It?

Well, when you configure Cloudflare Pages, you can choose the Hugo preset which will set the command `hugo` as your build command.  Now, you have to customize this.  

At any one time, you're only going to use one theme at a time in your Hugo project.  So, we're going to assume the theme you want to target is `my-current-theme`.

Log in to Cloudflare pages, and go to your build settings.  At time of writing, this is:

* Click on your website in the Pages section
* Click the Settings tab
* Click the Builds & Deployments menu
* Click the Edit configurations button
* Change the Build command to the following:

`npm --prefix=./themes/my-current-theme install && hugo`

This tells NPM that it's working directory (basically) is your current theme directory.  Then it will do an NPM install.  Note by specifying the prefix, though, you haven't _changed_ directories.  Then the `&&` says run the next command if the first didn't fail. So that's the `hugo` build command.  From there on, Hugo takes over.

**PS: Bonus tip**

I like to minify my output with Hugo, so I had already modified my build command before this to use the `--minify` command line option for hugo.  But basically, my real command I run is this:

`npm --prefix=./themes/my-current-theme install && hugo --minify`

