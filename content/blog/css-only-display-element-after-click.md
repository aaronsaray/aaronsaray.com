---
title: "CSS Only Display Element After Click"
date: 2023-11-09T11:16:46-06:00
tag:
- css
- html
---
Whenever I can use plain CSS instead of Javascript to solve a user interface or experience problem, a thousand angels rejoice. Well that, and usually the result is a lot less bytes sent for a faster page load. With this in mind, I had a problem a while ago that I solved using CSS only: showing a form only when a link was clicked to display it. Let's see how.

<!--more-->

The super cool key to this functionality is the [`:target` pseudo class](https://developer.mozilla.org/en-US/docs/Web/CSS/:target).  This allows us to style something differently if the unique element has an ID that matches the URL fragment.

To say it another way, if your form has the ID that is the same as the link anchor, you can make it show up - otherwise it can be display block.  

So, for example:

```html
<p>
  Click <a href="#test-form">this link</a> to show it.
</p>
<form id="test-form">
  <div>
    <label for="email">Email:</label>
  </div>
  <div>
    <input type="email" required id="email" name="email">
  </div>
  <button type="submit">Go</button>
</form>
```

```css
form {
  display: none;
}

form:target {
  display: block;
}
```

As you can see here, the `form` element will not be displayed.  However, when you click the link the `#test-form` anchor will be the URL fragment which changes the form tags state from normal to targeted.  Because of this, it is displayed.  

This is nice and useful if you just want to hide a bunch of information behind a link - and depending on your layout you could even combine it with opacity and CSS transitions to make it look animated.

You don't always need Javascript.

To see an example, check out [this CodePen](https://codepen.io/aaronsaray/pen/qBgmNMJ).