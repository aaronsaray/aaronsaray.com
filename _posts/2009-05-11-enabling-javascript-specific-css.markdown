---
layout: post
title: Enabling Javascript Specific CSS
tags:
- CSS
- javascript
---

While reading the blog post about [Enabling Javascript specific CSS](http://greatwebguy.com/programming/dom/enable-javascript-specific-css-with-one-line-of-jquery/) and the comments, I started thinking about my own ways to implement this.  And how to do it validly.

### Why Use Javascript Specific CSS

Believe it or not, we still have visitors to our websites that disable javascript.  It could be a configuration setting on purpose, a malfunction or even an older browser (or a mobile one...?)  At any rate, if you can make portions of your site accessible without javascript, you should do so.  (I know some would argue that you should always make your site accessible without javascript enabled... but thats a whole other discussion.)

Before this method we're going to talk about, the only way to display stuff to users without javascript was to use the NOSCRIPT tag.  Luckily, this takes it one step further.  You are not limited to using that tag.  Instead, CSS attributes can be added to items that you would like to be visible (or invisible) if no javascript is enabled.  Conversely, other stylings can take affect if javascript is on.  One of the commentors on the previous link suggests using this technique to limit the visibility of icons that represent more dynamic behavior when javascript is disabled.  Other usability enhancements include expanding hidden content automatically if no javascript controls are available.


### How are people doing this?

The consensus after comments and edits appears to be to create the following type of code (this is just for an example)

**main.css**

```css
.no_js a { color: #f00 }
.js a { color: #0f0 }
```

**test.html**

```html
<html class="nojs">
    <head>
        <link href="main.css" type="text/css" rel="stylesheet"></link>
        <script type="text/javascript">
            document.documentElement.className = 'js';
        </script>
    </head>
    <body>
        <h1>Hello!</h1>
        <a href="http://www.somewhere.com">Link!</a>
    </body>
</html>
```


Basically, when javascript is enabled, it replaces the html's class of 'nojs' with 'js'  - then any of the CSS qualified with '.js' is executed.

Not a bad idea.


### How I Would Do It

I like the idea - but I have to point to the [HTML tag reference](http://www.w3.org/TR/html4/struct/global.html#h-7.3) and note that using a class attribute in your HTML tag is illegal.

You can use it on your body tag though.  This is how I would do it.

```html
<html>
    <head>
        <link href="main.css" type="text/css" rel="stylesheet"></link>
    </head>
    <body class="nojs">
        <script type="text/javascript">
            document.body.className = 'js';
        </script>
        <h1>Hello!</h1>
        <a href="http://www.somewhere.com">Link!</a>
    </body>
</html>
```

This should execute the javascript as the very first part of the body rendering.  Then, the CSS will work fine - and its valid.

Thoughts?
