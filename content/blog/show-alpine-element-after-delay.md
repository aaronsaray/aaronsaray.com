---
title: "Show Alpine Element After Delay"
date: 2024-09-02T12:45:52-05:00
tag:
- javascript
---
Showing and hiding AlpineJS elements on click or other actions are pretty easy. But what if you just wanted to show the element after a little bit of a delay with no user interaction? We can do that easily!

<!--more-->

First of all, why might you do this? Many reasons - but one of the things that I use it for is for when I send a password reset. I don't want to show the 'send again' dialog if we've just sent it. We don't want to try to put in the user's head that maybe they won't receive it. And we don't want them to misunderstand and start clicking that. So, we may delay the resending. The logic is that the user will check their email and click the link - and never see the updates. If they don't get the link, they'll come back to ths page, but the dialog will now be visible.

So let's see how we can **easily** do this in AlpineJS.

```html
<div x-data="{show: false}" x-cloak x-show="show" x-init="setTimeout(() => show = true, 5000)">
  I show up after 5 seconds!
</div>
```

We simply `x-cloak` the element and set up our `x-data` with `show` being false - and our `x-show` is based on that.  That's the simple part. But, the real power is the `x-init` function. This runs when the element is being initialized in AlpineJS.  The local scope of the `x-init` is the `x-data` - so we can just set a quick timeout and change `show` to true. This does so after 5000ms - or 5 seconds.  Simple!