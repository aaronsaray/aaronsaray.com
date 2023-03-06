---
layout: post
title: Conditional Comments - fix blocking
tags:
- html
- misc-web
---
Ok - so I can't take any credit for this - but check out this blog post:
[http://www.phpied.com/conditional-comments-block-downloads/](http://www.phpied.com/conditional-comments-block-downloads/)

Sweet read, huh?

For those who aren't actually going to read it, conditional comments block downloads until it's done processing.  So, instead, start out your <head> with this:

```html
<!--[if IE]><![endif]-->
```

After that, you should be home free.
