---
title: Scoping your Bookmarklet Correctly
date: 2011-03-22
tag:
- javascript
---
I've been lucky so far.  I've used variable names and functions in my bookmarklets that weren't that common.  Then, one day, I chose a variable named something very common (x, counter, etc).  I noticed that my bookmarklet accidentally overwrote some properties in the current page.  Now, that could be benefit - you could want your bookmarklet to update/manage variables in the current page.  However, most times I believe we don't want that scope overlap. 

<!--more-->

### Controlling Scope

In order to control that scope, its important to enclose the bookmarklet in its own anonymous function.  If you leave it out there with just the normal executation in the anchor tag with javascript:, it has access to all of the global objects of this page.  While in some cases, this is good, most cases this is bad.

Example of the Bad Behavior

I have a page that creates a global variable named `counter`.  It starts out at value 3.  A VERY COMPLEX function changes the value of counter.  Finally, a button will show me the value of "counter" at any time.
    
```javascript
var counter = 3;
function addToCounter()
{
  counter++;
}
addToCounter();
```

```html
<button onclick="alert(counter)">Show Counter</button>
```

Now, lets say I have a bookmarklet that sets a counter variable for its own usage.  It alerts the counter value whenever its used.  And, to be safe, I redefine `counter` with the `var` statement:

```html
<a href="javascript:var counter=100;alert(counter)">Bookmarklet</a>
```

Now, lets check the output.

  1. Load page.  Counter was 3, increments to 4

  2. Click button - alerts 4

  3. Click bookmarklet.  Bookmarklet counter is now 100.  Alerts 100.

  4. Click button - alerts 100

As you see, even though I thought I properly scoped my variable, it now changes the global variable value - because our bookmarklet is running in the global scope of this page.

### The Fix

Wrap the function in an anonymous function.
    
```html
<a href="javascript:(function(){var counter=100;alert(counter)})();">Bookmarklet</a>
```

By doing this, the counter variable is scoped in the bookmarklet's function scope only.

Now, clicking the button always alerts 4, and the bookmarklet always alerts 100.
