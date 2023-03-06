---
title: When to use stopPropagation vs preventDefault
date: 2020-11-04
tags:
- javascript
---
These Javascript methods sound confusingly similar, but they're not the same. Let's see what each does and why you'd use it.

<!--more-->

### Prevent Default

[preventDefault()](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) is used to prevent the default browser behavior when you engage with an element.  For example, when you click a link, the default browser behavior is to navigate to that `a` tag's `href` attribute.  When you click an `input` of type `submit` or a `button` of type `submit` the browser will submit the parent form.  These are the default actions.  `preventDefault()` does not interfere with behavior of the parent elements in the DOM.

### Stop Propagation

[stopPropagation()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) is used to stop the propagation of the current event up through the parent DOM elements.  Sometimes this is called bubbling up.  Calling this method on an event will stop parent elements from executing their handler on this particular event.  It does not interfere with this current element's default behavior in the browser.  For example, imagine you have a box that, when clicked, removes itself from the DOM. Inside of that you have a button to submit a form. You may put a handler on that `button` to stop that click event from bubbling up (and therefore removing the box before the form has completed submitting).

### Demonstrations

Still a bit hazy? That's fine. Let's see some demonstrations.

First, the set up.  We have a `div` that has a click handler on it to fire an `alert` message.  Inside of that `div` I have an `a` tag with a `href` that has an anchor defined in it.  Finally, that `a` tag has a handler on it to issue an `alert` as well.

Here is the simplified code (in the examples, there is some style added):

**Default**

```html
<div id="box">
  <a id="link" href="#clicked">I am a link</a>
</div>
```

and

```javascript
document.getElementById('box').addEventListener('click', () => {
  alert('I am a box!');
});

document.getElementById('link').addEventListener('click', () => {
  alert('I am a link!');
});
```

This is what this looks like:

[![Demo](/uploads/2020/stopprevent-1.gif)](/uploads/2020/stopprevent-1.gif){: .thumbnail}{: .inline}

The alert appears from the link being clicked. The alert appears from it bubbling up to the click handler on the box. And finally, the URL is appended with the anchor.

**stopPropagation()**

```javascript
document.getElementById('box').addEventListener('click', () => {
  alert('I am a box!');
});

document.getElementById('link').addEventListener('click', e => {
  e.stopPropagation();
  alert('I am a link!');
});
```

This is what this looks like:

[![Demo](/uploads/2020/stopprevent-2.gif)](/uploads/2020/stopprevent-2.gif){: .thumbnail}{: .inline}

Here the alert appears from clicking the link. The event is stopped from bubbling up to the box. But, the URL is appended with the anchor.

**preventDefault()**

```javascript
document.getElementById('box').addEventListener('click', () => {
  alert('I am a box!');
});

document.getElementById('link').addEventListener('click', e => {
  e.preventDefault();
  alert('I am a link!');
});
```

This is what this looks like:

[![Demo](/uploads/2020/stopprevent-3.gif)](/uploads/2020/stopprevent-3.gif){: .thumbnail}{: .inline}

Here the alert appears from clicking the link. The alert appears from the box as well. However, the browser is stopped from doing its default action: appending the anchor to the URL.

### Which Should I Use?

Obviously, since each does its own thing, there isn't a single rule here. However, I can say 95% of the time I've wanted to use `preventDefault()`  I want to prevent whatever would normally happen when I click this thing from happening.  Maybe I want to validate the form before I want to submit it, I want to prevent the default action of submitting the form.  Maybe I want to use some AJAX to interact with the page if the user has Javascript enabled (instead of navigating to the URL for non-JS users).  If you're doing something where you're certain that when you handle your action, nothing else, EVER, should happen, you might want to **add** on `stopPropagation()` in addition to your call to `preventDefault()`.

But the important thing, if you're doing **tldr;**:

* Use `preventDefault()` to stop the browser from doing things it normally does
* Use `stopPropagation()` to stop other elements from doing their thing when you gotta do your thing first
