---
title: Mark WIP Features for Better UX/Customer Acceptance
date: 2019-08-22
tag:
- testing
- misc-web
- javascript
---
When you're trying to demo your **w**ork **i**n **p**rogress to a client, it can be difficult to know where to draw the line between working and non-working features.  On one hand, you want to show them some context so they can understand the current feature. But, then what happens when they invariably try to explore the context (which may not be done)?  Let me put that in a more concrete example.

<!--more-->

Imagine you have a menu with three options in your final app. You've worked on the first menu item and it's ready to demonstrate.  You want to display the other two menu items to give proper context. However, those other items are not completed.

Sometimes a client or tester might understand that the extra links are just there for show.  Others, though, might click through and be confused.  They could be frustrated or even add false bug reports: "second and third menu item don't function."  It's no fun to explain to them that that's the way it's meant to be right now.

**There's an easy solution to these problems.**

Find a way to mark your contextual buttons as **wip** or not-yet-complete.  For example, you may make the first menu item clickable and functional. The other two may just create a quick alert that says this feature is not yet available.  Then, the client knows you _will_ build it, but it's just not done yet.

In practice, when you're just adding contextual links, you don't want to spend too much time building out their temporary "under construction" display.  So, to make things easier/faster, I have adopted a mechanism like this: (you can see the working code on [codepen](https://codepen.io/aaronsaray/pen/yLBVGeZ))

```html
<nav>
  <a href="https://google.com">Working link</a>
  <a href="#wip">Not Done Feature</a>
  <a href="#wip">Another Feature</a>
</nav>
```

You'll notice that I mark the ones that are not done yet with a `#wip` anchor. (This is assuming that you don't actually ever have an anchor named that.) Instead of just using the `#`, I give it something identifiable that I can now target to display a message.

If you're using jQuery, you can then do this:

```javascript
$('a[href="#wip"]').click(function(e) {
  e.preventDefault();
  alert('This functionality is not yet complete.');
});
```

This will stop all of those work in progress tags from clicking through, but will also display a useful alert to the tester.

## End Notes

It can be difficult to know how much of the work in progress functionality to release and build out. But, when you do, remember that not every stakeholder and tester is familiar with how much progress you've made - or which parts _should_ and _shouldn't_ work yet.  Reduce friction and give a better experience by creating a mechanism to alert people that **wip** items are just that.