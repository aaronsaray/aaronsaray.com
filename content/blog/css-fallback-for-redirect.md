---
title: CSS fallback for failed Javascript redirect
date: 2021-05-14
tag:
- css
- javascript
---
For some analytic tools, an interstitial page may be required to load javascript and then redirect the user again.  Normally these page switches happen pretty fast and the user doesn't really notice or care. Some have a link to 'continue' the redirect just in case the Javascript fails.  But, what if we only wanted to show that link after a certain amount of time has elapsed, regardless of if the Javascript has failed or not?

<!--more-->

The conditions for failure may be that the javascript is taking too long to load it's resource, or that something in the javascript has thrown an error without proper error handling and the browser has stopped processing the rest of the javascript.  So, we want to show the link only later (we don't want to bother the user with this display unless we really have to) regardless of whether the javascript takes too long or completely crashes.

We can rely on CSS animations with a uniquely configured keyframe setting to do this.

With CSS animations, we can set keyframes with `from` and `to` - or we can use percentages.  You can consider those percentages stop points between animation steps.  So, let's say we wanted to show something after 7 seconds.  99% of the time we don't want it to show. It's only at the end of 7 seconds that we want to show it. So, we could do something like this:

```css
#item {
  opacity: 0;
  animation: item-show 7s forwards;
}

@keyframes item-show {
  0% {
    opacity: 0;
  }

  99% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
```

Here, we start the item out with 0 opacity (opacity is a supported animatable CSS property).  We apply an animation named `item-show` which is defined below.  The length is 7 seconds and its fill mode is `forwards` (which basically says to remain at the end frame when done).  The keyframe definition is where the magic happens.  At 0%, we start out with opacity at 0.  Then, at 99% we also define the opacity at 0.  Finally 100% is fully visible.  If we didn't add the 99% keyframe, the animation would slowly animate the opacity setting from 0 to 1 - not what we wanted.

So now, you could write some javascript that loads some resources and when done, executes a redirect.  Let's say you assume that might take 2 seconds - or that's the longest you want to wait before giving the user an option to move on.  Simply write the javascript as you'd wish and then add a CSS animation for your link to redirect the user to appear after 2 seconds. Done!

To see something like this in action, you can check out [this Codepen](https://codepen.io/aaronsaray/pen/vYxGQeW).