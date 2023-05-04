---
title: "Use DPI Media Query for Crisp Text and Images with High Density"
date: 2023-05-04T14:37:47-05:00
tag:
- css
---
What do you do when your website looks great to you - but others say the text is hard to read and the image is grainy?  Well, because of this specific reason, I use two monitors always - one with a higher resolution and one with less. So, as it turns out, there's a way to make both resolutions - and people - happy. Let's see how.

<!--more-->

First, let's see what I was talking about. I was working on my development business site [MoreBetterFaster.io](https://morebetterfaster.io/?ref=as) - when I started noticing the problem.

Well, first of all, I thought it looked great.  I was using some antialiasing on my text and I found an image that I really felt connected with the content.  It looks good:

{{< image src="/uploads/2023/screen-ok.jpg" alt="Screen OK" >}}

_(Keep in mind that if you're on a lower resolution currently, the above screenshot may still look grainy. )_

I did this with the following CSS:

```css
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#home-hero {
  background-image: url('/images/hero-back.webp');
  background-size: cover;
  background-position: center top;
}
```

As one of the last steps, I slipped the browser over to my lower resolution monitor, and I was dumbfounded. All of my work looked like crap. No matter what I did to the image, it always looked washed out. The text was hard to read.  What was going on here?

{{< image src="/uploads/2023/screen-problem.jpg" alt="Screen Problem" >}}

Well, as it turns out it had to do with the DPI of my monitors.  My primary monitor is a Retina 5K Mac monitor.  The other one is a Dell U2415 which is a 24 inch at 1920x1200.

So, if I remove the antialiasing it looks a little better - at least the text. It's too heavy, though. I wanted a lighter feeling.

I couldn't get the image ever to look good.  So I decided that I would just use a blue gradient in place of that.

Finally, I combined these two with media queries based on the DPI (the 5k monitor being a much higher DPI).  I came up with this:

```css
@media (min-resolution: 192dpi) {
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #home-hero {
    background-image: url('/images/hero-back.webp');
    background-size: cover;
    background-position: center top;
  }
}

#home-hero {
  background: linear-gradient(
    180deg, 
    rgba(0, 17, 34, 1) 0%, 
    rgba(22, 40, 60, 1) 52%, 
    rgba(0, 17, 34, 1) 100%
  );
}
```

Now, the 5k and 192dpi+ screens see my initial design - and less resolution see's a similar, but better for them version:

{{< image src="/uploads/2023/screen-fixed.jpg" alt="Screen Fixed" >}}
