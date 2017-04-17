---
layout: post
title: Internet Explorer CSS Hacks - Transparent PNG and Selectors
tags:
- CSS
---
As a reference for myself, I wanted to jot these things down.

First off, lets look at some common css selectors - and how we can use them to identify styles for specific versions of IE.  (Note: I am way not into using hacks such as broken comments, etc, in CSS.  I'd rather write a selector)

**IE 6 and below**

```css
* html {}
```

**IE 7 and below**

```css
*:first-child+html {} * html {}
```

**IE 7 only**

```css
*:first-child+html {}
```

**IE 7 and modern browsers only**

```css
html>body {}
```
_I can't tell you how many times I wished for the parent/child selector option in IE 6.  I've written way too many `ul ul ul li ul` type strings_

Next, lets check out the behavior for transparent GIFs:

First off, use the conditional comment to bring in the stylesheet only when needed.

Then, the actual behavior:

```css
* html img {
  position:relative;
  behavior: expression((this.runtimeStyle.behavior="none")&&(this.pngSet?this.pngSet=true:(this.nodeName == "IMG" && this.src.toLowerCase().indexOf('.png')>-1?(this.runtimeStyle.backgroundImage = "none",
    this.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.src + "', sizingMethod='image')",
    this.src = "transparent.gif"):(this.origBg = this.origBg? this.origBg :this.currentStyle.backgroundImage.toString().replace('url("','').replace('")',''),
    this.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.origBg + "', sizingMethod='crop')",
    this.runtimeStyle.backgroundImage = "none")),this.pngSet=true)
  );
}
```

The original article (I'll link it at the end) references HTML .png as well - but I don't give my png files a class of png... so its not worth it.

At any rate, I'm referencing [this article](http://www.noupe.com/better-design/7-css-hacks-you-cannt-live-without.html) and [that article](http://komodomedia.com/blog/index.php/2007/11/05/css-png-image-fix-for-ie/).  I just didn't want them to go offline and not have a copy of them. ;)
