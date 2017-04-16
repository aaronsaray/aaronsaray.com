---
layout: post
title: JfbConsole - chainable Firebug Console jQuery plugin
tags:
- javascript
- jquery
---
I find myself wanting to document various different attributes mid development on my jquery code.  I have created the following function to help use FireBug's console access code effectively in the jQuery fashion.

```javascript
 /**
  * JConsoleFB 0.1
  *
  * Jquery plugin for FireBug console integration.  Uses chainable method.
  * See: http://getfirebug.com/console.html for options
  * @author Aaron Saray (http://aaronsaray.com)
  */
$(document).ready(function () {
  if (typeof window.console != 'undefined') {
    jQuery.fn.log = function(msg) {
      window.console.log("%s: %o", msg, this);
      return this;
    };
    jQuery.fn.debug = function(msg) {
      window.console.debug("%s: %o", msg, this);
      return this;
    };
    jQuery.fn.info = function(msg) {
      window.console.info("%s: %o", msg, this);
      return this;
    };
    jQuery.fn.warn = function(msg) {
      window.console.warn("%s: %o", msg, this);
      return this;
    };
    jQuery.fn.error = function(msg) {
      window.console.error("%s: %o", msg, this);
      return this;
    };
    jQuery.fn.assert = function(expression) {
      window.console.assert(expression, this);
      return this;
    };
    jQuery.fn.dir = function() {
      window.console.dir(this);
      return this;
    };
    jQuery.fn.dirxml = function() {
      window.console.dirxml(this);
      return this;
    };
    jQuery.fn.trace = function() {
      window.console.trace();
      return this;
    };
    jQuery.fn.time = function(name) {
      window.console.time(name);
      return this;
    };
    jQuery.fn.timeEnd = function(name) {
      window.console.timeEnd(name);
      return this;
    };
    jQuery.fn.profile = function(title) {
      window.console.profile(title);
      return this;
    };
    jQuery.fn.profileEnd = function() {
      window.console.profileEnd();
      return this;
    };
  }
});
```

Usage is pretty simple.  For example, say I wanted to log something about the current element I'm going to clone.  I may do this:

```javascript
var newClone = $("#cloneable").log('Cloning this').clone();
```

This will display a reference to this object as well as the message 'Cloning this' in the Firebug console as a log type.
