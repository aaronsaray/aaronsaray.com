---
title: document.URL vs document.location.href
date: 2009-12-18
tag:
- javascript
---
When reviewing some javascript security ideas, I came across the `document.URL` property.  Turns out that my normal way of retrieving the location (`document.location.href`) is both a getter and a setter.  The `document.URL` is just a getter.

<!--more-->

Check it out with this code:

```javascript
alert(document.URL);
alert(document.location.href);
document.URL = 'http://google.com';
document.location.href = 'http://yahoo.com';
```

The results are simple: you will get the current location twice - and then an error.  If you comment out the `document.URL` line, it will redirect to yahoo.
