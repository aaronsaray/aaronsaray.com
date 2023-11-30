---
title: "Stop vs Code Wrapping HTML"
date: 2023-11-30T14:26:28-06:00
tag:
- html
- ide-and-web-dev-tools
---
I already have Prettier and ESLint set up and they handle all of my Javascript code perfectly.  But what about when you're working on just a plain HTML file in VSCode? How do you get it to stop randomly breaking your lines?

<!--more-->

It's not random - it's actually the line length to wrap by default according to the suggestion of VSCode.  Still didn't make me happy. 

Turns out the setting is pretty easy.  Just add the following to your `settings.json` file:

```
"html.format.wrapLineLength": 0
```

This will turn off the formatting in the editor for your HTML line lengths. Yay!
