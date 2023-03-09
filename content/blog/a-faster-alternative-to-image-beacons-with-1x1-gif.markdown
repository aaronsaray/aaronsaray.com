---
title: A faster alternative to image beacons with 1x1 gif
date: 2011-03-31
tag:
- misc-web
---
So it seems like a very common solution for tracking hit rates is the transparent 1x1 pixel gif.  Load this and parse your access logs: requests logged.

<!--more-->

The problem I have with this is two fold:

a) it sends a 1x1 gif's worth of data to the server.  This should exist - it could be possible for browsers to show a broken image if the gif doesn't exist

b) it requires a full data connection and transmission to do something so simple.

Instead, let's use the HTTP Code 204: No Content

[HTTP response code 204](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5) stands for "no content".  This means that there will be no additional data processed, sent or displayed after the last blank line in the header of the request.

Let's put this in practice:

Before:

```javascript
var track = new Image();
track.src="/my/source/image/1x1.gif";
```

And the corresponding image is sent.

After:

```javascript
var track = new Image();
track.src = "/track/this/page.php";
```

**`page.php`**
```php
<?php
die(header("HTTP/1.1 204 No Content"));
```

(Note, this also could be done probably just with an apache configuration to not even invoke the PHP engine).
