---
title: Flash of Unstyled Content - in FireFox 3
date: 2009-04-28
tag:
- css
- html
- javascript
---
So I've heard of the [Flash of Unstyled Content](http://bluerobot.com/web/css/fouc.asp/) before - but never really had this problem.  I always use a `link` tag for my stylesheets.

<!--more-->

However, I just ran into it today - in FireFox even with a `link` tag...

## Fixing Flash of Unstyled Content in Firefox

Simple really - I was loading way too much javascript before my stylesheet (not my fault on the large amount of js!!) - and the delay was causing the flash.  I moved the link to the very first part of the content - and presto - good to go.

So, **instead of**
    
```html
<head>
  <script src="#"></script>
  <script src="#"></script>
  <script src="#"></script>
  <script src="#"></script>
  <link href="#" type="text/css" rel="stylesheet"></link>
</head>
```
    
**Just move it to the top:**

```html
<head>
  <link href="#" type="text/css" rel="stylesheet"></link>
  <script src="#"></script>
  <script src="#"></script>
  <script src="#"></script>
  <script src="#"></script>
</head>
```
    
... next battle, getting rid of sooo much js ;)
