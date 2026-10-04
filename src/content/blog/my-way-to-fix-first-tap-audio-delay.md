---
title: "Fixing the First Tap Audio Play"
date: "2026-10-13"
tags:
  - javascript
  - mobile
  - archived-projects
---
I thought it would be funny to joke about a nickname I have had before "Angry Aaron" - so I made a website. It was AngryAaron.com.
Basically, you tapped the angry emoji and it was my voice saying 'no' or 'grrr' increasingly louder and more angry, repeatedly.

That's it.

But, on my phone, the first tap never started the yelling. It was always the second one (even though the web seemed to work fine).
I hated this because it felt like the site was broken. 

Now, there probably are better ways to fix this - but I went with a unique way that solves the problem and gives me a UX bonus.

<!--more-->

You can [try it out here](/uploads/2026/angry-aaron/index.html) yourself. Turn your volume up.

## The Bug

I wanted the button to feel instant, so I played the sound on `touchstart` and called `preventDefault()`.

```javascript
angryButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleButtonInteraction();
}, { passive: false });
```

On desktop, clicking worked for the animations and audio perfectly.  On my iPhone though, only the animation fired the first time.
Audio didn't happen until the second tap.

## Why

Browsers won't play audio until the person has actually interacted with the page, and apparently `touchstart` doesn't count. 
The [HTML spec](https://html.spec.whatwg.org/multipage/interaction.html#activation-triggering-input-event) lists the events that do count (only `touchend` is in there).

This makes me wonder if I should have tried to capture `touchend` instead. But I went with a different solution.

## The Fix

People have their phones muted, right? (Or they should - if you're in public!).  So, I put a modal up with a note about
the sound.  It reminded them to turn on their audio or headphones.  

And to dismiss, that's a browser interaction. Yes!  From then on, everything worked as expected.
