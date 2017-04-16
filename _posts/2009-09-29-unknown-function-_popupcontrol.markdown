---
layout: post
title: Unknown function _popupControl()
tags:
- javascript
---
In my Javascript Error Handler post, I discussed how I track user and client side errors.  Recently, my error logs became inundated with tons of javascript errors.  The function `_popupControl()` is undefined.  After a little googling, I found out that the CA Personal Firewall is responsible for inserting the following code into every page:

```html
<script type="text/javascript">_popupControl();</script>
```

Well, for whatever reason, that software is no longer providing that function to the page.  Not sure about the inner workings.  My concern is that Internet Explorer is generating a popup error on the page, however.  This would make it look like my page is erroring out.  Or even worse, it may stop other scripts.

I've implemented a work around, and I'm curious how well it will work.  My javascript now includes this code:

```javascript
if (typeof _popupControl != 'function') {
  var _popupControl = function() {};
};
```

This script simply checks to see if the `_popupControl()` function is defined.  If it is not, it assigns it to an anonymous function that does nothing.  Curious to see if this will work...
