---
layout: post
title: Remove Internet Explorer Button Border
tags:
- CSS
---
Internet Explorer provides an additional border to any `button` element in the page if you don't explicitly assign a 0px border to it.  I have a bunch of buttons on a design that I'd like to have a `1px #fff` border on.  Unfortunately, with the additional border that IE adds, it looks horrible.

The solution was to add a span around the button:

```css
button {
  border: 0px;
}
.button {
  border: 1px solid #fff;
}
```

And the HTML:

```html
<span class="button"><button>My Button</button></span>
```
    
