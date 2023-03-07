---
title: 'jQuery Validator: Twitter username validator'
date: 2012-08-07
tag:
- javascript
- jquery
---
If you use the [jQuery Validation](http://docs.jquery.com/Plugins/Validation) plugin, and of course, you follow an [amazing PHP Programmer](http://twitter.com/aaronsaray) and now have twitter boxes on all your forms, you might need to validate it some day.  I wrote this method for it.

<!--more-->

```javascript
jQuery.validator.addMethod("twitterhandle", 
  function(value) {
    if(value == "") return true;
    var pattern = /^\w{1,32}$/;
    var result = pattern.test(value);
    return result;
  }, 
  "Twitter handle only - no spaces, @, and not a URL."
);
```
