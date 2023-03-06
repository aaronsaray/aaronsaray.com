---
title: setTimeout proper syntax
date: 2011-05-03
tags:
- javascript
---
The javascript function setTimeout can be used to execute a function after a specified amount of delay.  It uses the javascript callback pattern.  Its important to use the callback pattern correctly, however, or you may get different results than you expect.  One example of this is the immediate execution of a function versus the callback execution.  Note this example:

<!--more-->

```javascript
function myTime(x)
{
  alert(x);
  alert(new Date());
}
alert(new Date());
```

Incorrect usage:
    
```javascript
setTimeout(myTime(), 5000);
```

When this is run, the script executes an alert that shows the current time.  After this is dismissed, immediately the `myTime()` function is executed and another alert shows the current time.

The proper way to do this is to make sure the function is not called immediately, and is referenced in callback pattern:

```javascript
setTimeout(myTime, 5000);
```

Now, the current date is immediately alerted.  Five seconds later, the next date is alerted.

Last note: some have been known to enclose the function call in string notation:

```javascript
setTimeout("myTime()", 5000);
```

This is considered to be bad form as the string must be evaluated and it is not a standard function callback pattern.
