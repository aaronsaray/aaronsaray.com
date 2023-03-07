---
title: Fixing c:\fakepath in filestyle jquery plugin
date: 2010-03-26
tag:
- javascript
- jquery
---
The other day I ran across an issue with the FileStyle jquery plugin.  Whenever a new file was chosen, windows and Internet Explorer would put `c:\fakepath\` before the filename.  Turns out its not FileStyle's issue - but a security feature of Internet Explorer.

<!--more-->

As a quick fix, however, I made the following changes to FileStyle:

**BEFORE**

```javascript
$(self).bind("change", function() {
  filename.val($(self).val());
});
```

**AFTER**

```javascript
$(self).bind("change", function() {
  var s = $(self).val().replace(/(c:\\)*fakepath/i, '');
  filename.val(s);
});
```
    
