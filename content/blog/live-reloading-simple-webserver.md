---
title: Live Reloading HTML Webserver
date: 2019-03-25
tag:
- html
- ide-and-web-dev-tools
---
Historically, I've always created virtual boxes with apache environments with vagrant [like this](https://github.com/aaronsaray/local-dev-server) or recently a combined docker image [like that](https://github.com/aaronsaray/docker-lamp-testbed). But, as I do more front end work as well, I realized these were pretty heavy weight.

<!--more-->

So, at first I decided I would just use the built-in PHP server [from the command line](http://php.net/manual/en/features.commandline.webserver.php) using something like:

```bash
php -S localhost:8000
```

Which then would give me a PHP-compatible webserver.  A little over kill because I don't need a back-end processing system.  But, hey it works and I was familiar with it. I got pretty spoiled using [create react app](https://github.com/facebook/create-react-app) - with how it sets up auto reloading and things like that. I thought there has to be something equally as cool and easy, without having to create webpack configurations and everything with each quick project I was working on.

Enter [live-server](https://www.npmjs.com/package/live-server), an NPM package that is a live reloading web server for HTML, CSS, Javascript - basically static files.  Then, it opens up a web socket to listen for local changes.  When local changes happen, it automatically reloads the page.  Pretty cool.

To get started, just install it globally.

```bash
npm i -g live-server
```

Then, where ever you have a docroot, you can fire up live-server and it'll stay active in the foreground.  Simply run it like this:

```bash
live-server
```

And you'll get a web server on `http://localhost:8080` by default.  There are tons of [configuration options](https://www.npmjs.com/package/live-server#usage-from-command-line) so you're not locked down to just that.  Cool and notable features include the fact that it gives a nice directory listing when there is no index file and it can even reload CSS files that changed without reloading the entire html page.  Check it out, and save yourself some time and frustration like I did.